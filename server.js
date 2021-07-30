const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3020;
const server = http.createServer(app);
// const io = socket.listen(server);
const io = new Server(server);
 
// listen for HTTP requests on specified port
server.listen(port, () => {
  console.log('listening on %d', port);
});

// allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// set public folder as root
app.use(express.static('public'));

app.get('/img/fs-img', function (req, res) {
  const url = `${req.query.dir}${req.query.img}`;
  res.sendFile(path.resolve(url));
});

app.get('/fs-img', function (req, res) {
  const url = `${req.query.dir}${req.query.img}`;
  res.sendFile(path.resolve(url));
});

io.on('connection', (socket) => {
  socket.on('render-frame', function (data) {

    // pad frame number with zreos so it's four characters in length
    data.frame = (data.frame <= 99999) ? ('0000' + data.frame).slice(-5) : '99999';

    // get rid of the data:image/png;base64 at the beginning of the file data
    data.file = data.file.split(',')[1];
    const buffer = Buffer.from(data.file, 'base64');
    fs.writeFile(__dirname + '/rendered/frame_' + data.frame + '.png',
      buffer.toString('binary'),
      'binary',
      err => {
        if (err) {
          console.log('An error occurred: ', err);
          throw err;
        }
      });
  });
});
