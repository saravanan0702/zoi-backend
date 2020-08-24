const express = require('express')
const mongoose = require("mongoose");
const nsq = require('nsqjs')
const cors = require("cors");
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

let connections = [];

io.on('connection', socket => {
    connections.push(socket);
    console.log(connections.length,"connected")

    socket.on('disconnect', () => {
     
      var index = connections.indexOf(socket);
  
      if(index >=0 )
      {
        connections.splice(index, 1);
      }
  
      console.log("Disconnected: %s sockets connected", connections.length)
    })
});


const route = require("./src/routes");

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});
app.use("/api", route);

app.use((req, res, next) => {
  const error = new Error('Route Not Found');
  error.status = 400;
  next(error);
});

app.use((e, req, res, next) => {
  e.status = e.status || 500;
  e.message = e.message || 'server error ';
  console.log(e);
  res.status(e.status).json({
      status: false,
      message: e.message,
      error: e,
  });
});

const { getvideo, createOnevideo } = require("./src/model/video");

app.use(cors());

const port = 5000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://admin-user:admin-user@cluster0.vvoev.mongodb.net/zoi?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('DB connection created successfully');
    } else {
        console.log('error in creating DB connection', err);
    }
});

let videoCount = [];

const reader = new nsq.Reader('test', 'new_user', {
  lookupdHTTPAddresses: '127.0.0.1:4161'
})

reader.connect()

reader.on('message', async (msg) => {
  console.log(msg.body.toString());
  msg.finish();
  await createOnevideo({ videoID: msg.body.toString() });
  const data = await getvideo({ videoID: msg.body.toString() });
  console.log(data);
  // let index = videoCount.findIndex(x => x.id === msg.body.toString());
  // if(index === -1){
  //   videoCount.push({
  //     id: msg.body.toString(),
  //     count: 1
  //   })
  // }else{
  //   videoCount[index].count += 1;
  // };

  // console.log(videoCount);

  io.emit('video-count', data);
})

// const writer = new nsq.Writer(
//   "127.0.0.1",
//   "4150",
// );

// writer.connect();

// writer.on('ready', () => {
//   setInterval(() => {
//     const msg = { name: 'Gijo Varghese' };
//     console.log('Message sent:', msg);
//     writer.publish('new_user', msg);
//   }, 1000);
// });

server.listen(port, (err) => {
    if (!err) {
        console.log(`server started at ${port}`);
    } else {
        console.log('error in starting server', err);
    }
});

// app.listen(port, () => console.log(`NSQ Consumer is listening on port ${port}!`))