import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { exec as _exec } from 'child_process';
import { resolve } from 'path';
import fs from 'fs';

const params = process.argv.slice(2);
const app = express();
const port = 3020;
const publicPath = 'public';

if (params[0] === 'serve') {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log('listening on %d', port);
  });

  app.use(cors());
  app.use(bodyParser.json({ limit: '25mb' }));
  
  // app.use(express.static(publicPath));
  app.use(`/`, express.static(resolve(publicPath)));

  app.post('/', async (req, res) => {
    const { img, frame } = req.body;
    try {
      const f = ('0000' + frame).slice(-5);

      // get rid of the data:image/png;base64 at the beginning of the file data
      const imageClean = img.split(',')[1];
      const buffer = Buffer.from(imageClean, 'base64');
      fs.writeFile('rendered/frame_' + f + '.png',
      buffer.toString('binary'),
      'binary',
      (err) => {
        if (err) {
          console.log('An error occurred: ', err);
          throw err;
        }
      });

      if (frame > 0) {
        process.stdout.moveCursor(0, -1); // up one line
        process.stdout.clearLine(1); // from cursor to end
        console.log('write frame', f);
      }
    } finally {
      res.send();
    }
  });
}
