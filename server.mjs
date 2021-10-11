import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import puppeteer from 'puppeteer';
import util from 'util';
import { ExpressListen } from '@yandeu/express-dev';
import { exec as _exec } from 'child_process';
import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { resolve, join } from 'path';

const params = process.argv.slice(2);
const app = express();
const port = 3020;
const publicPath = 'public';

if (params[0] === 'serve') {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log('listening on %d', port);
  });
  
  app.use(express.static(publicPath));
}

if (params[0] === 'render') {
  const exec = util.promisify(_exec);

  // clean and make dir
  await rm(resolve('output.mp4'), { recursive: true, force: true });
  if (existsSync(resolve('screenshots'))) {
    await rm(resolve('screenshots'), { recursive: true, force: true });
  }
  await mkdir(resolve('screenshots'));
  
  app.use(cors());
  app.use(bodyParser.json({ limit: '25mb' }));
  
  app.use(`/${publicPath}`, express.static(resolve(publicPath)));
  
  app.post('/', async (req, res) => {
    const { img, frame } = req.body;
  
    try {
      const data = img.replace(/^data:image\/png;base64,/, '');
      const f = ('000' + frame).slice(-4);
  
      await writeFile(resolve(join('screenshots', `frame${f}.png`)), data, 'base64');
  
      if (frame > 0) {
        process.stdout.moveCursor(0, -1); // up one line
        process.stdout.clearLine(1); // from cursor to end
      }
  
      console.log('write frame', f);
    } finally {
      res.send();
    }
  })
  
  const listen = new ExpressListen(app);
  
  listen.listen(port).then(async port => {
    console.log(`Example app listening at http://localhost:${port}`);
  
    // start puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // wait for the "DONE" log of the scene
    page.on('console', async message => {
      console.log(message.text());
      if (message.text() === 'DONE') {
        await page.close();
        await browser.close();
  
        const cmd = `ffmpeg -y -r 30 -f image2 -start_number 1 -i "${join(
          'screenshots',
          'frame%04d.png'
        )}" -c:v libx264 -pix_fmt yuv420p -preset slow -crf 16 output.mp4`
  
        console.log('');
        console.log('> Running: ', cmd);
        console.log('');
  
        const { stdout, stderr } = await exec(cmd);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
  
        await listen.kill();
  
        console.log('> DONE!');
        process.exit(0);
      }
    })
  
    await page.setUserAgent('puppeteer');
    console.log(`url:http://localhost:${port}/${publicPath}?mode=render`);
    await page.goto(`http://localhost:${port}/${publicPath}?mode=render`);
  })
}
