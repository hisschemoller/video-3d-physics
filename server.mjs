import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import http from 'http';
import path, { resolve } from 'path';
import fs from 'fs';

const params = process.argv.slice(2);
const app = express();
const port = 3020;
const publicPath = 'public';

if (params[0] === 'serve') {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log('');
    console.log('\x1b[46m%s\x1b[0m', `                                        `);
    console.log('\x1b[46m%s\x1b[0m', `     V3DPh on http://localhost:${port}     `);
    console.log('\x1b[46m%s\x1b[0m', `                                        `);
    console.log('');
  });

  app.use(cors());
  app.use(bodyParser.json({ limit: '25mb' }));

  // app.use(express.static(publicPath));
  app.use('/', express.static(resolve(publicPath)));

  app.get('/fs-img', (req, res) => {
    const url = `${req.query.dir}${req.query.img}`;
    res.sendFile(path.resolve(url));
  });

  app.post('/', async (req, res) => {
    const { img, frame } = req.body;
    try {
      const f = (`0000${frame}`).slice(-5);

      // get rid of the data:image/png;base64 at the beginning of the file data
      const imageClean = img.split(',')[1];
      const buffer = Buffer.from(imageClean, 'base64');
      fs.writeFile(`rendered/frame_${f}.png`,
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

function startStream(streamWidth, streamHeight, streamFps, writeStreamPath) {
  try {
    // const readStream = fs.createReadStream(new URL('http://localhost:2020/'));
    const writeStream = fs.createWriteStream(writeStreamPath);
    // console.log('writeStream', writeStream);

    // const process = new ffmpeg({
    //   source: readStream,
    //   // logger: winston,s
    //   timeout: 0,
    // })
    const process = new ffmpeg('http://localhost:2020/')
      .fromFormat('rawvideo')
      .addInputOption('-pixel_format', 'argb')
      .addInputOption('-video_size', `${streamWidth}x${streamHeight}`)
    // .fromFormat('image2pipe')
    // .addInputOption('-vcodec', 'mjpeg')
      .toFormat('mp4')
      .withVideoBitrate('800k')
      .withFps(streamFps)
      .stream(writeStream); // .writeToStream(outStream);
  } catch (e) {
    if (e) {
      console.log('e', e);
      // console.log('Error.code', e.code);
      // console.log('Error.msg', e.msg);
    } else {
      console.log('Error');
    }
  }
}

// startStream(800, 450, 30, 'rendered-mp4/output.mp4');
