function makeRandomId() {
  const j = [];
  let x;
  for (let i = 0; i < 20; i += 1) {
    x = [[48, 57], [65, 90], [97, 122]][(Math.random() * 3) >> 0];
    j[i] = String.fromCharCode(((Math.random() * (x[1] - x[0] + 1)) >> 0) + x[0]);
  }
  return j.join('');
}

function createMessage(message) {
  date = new Date();
  return {
    from: message.from,
    message: message.message,
    id: makeRandomId(),
    time: date.getTime()
  }
}

const database = require('./firebase');

function writeMessage(messageBody) {
  database.db.ref().child('messages').push(messageBody);
}

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const messages = [];

wss.on('connection', (ws) => {
  console.log('messages length', messages.length)
  if (messages.length === 0) {
    console.log('fetching db data')
    database.db.ref('/messages/').once('value').then(function (snapshot) {
      for (const message in snapshot.val()) {
        messages.unshift(snapshot.val()[message])
      }
      ws.send(JSON.stringify(messages));
    });
  }

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`)
    const mes = JSON.parse(message);
    const received = createMessage(mes);
    writeMessage(received);
    const newMes = JSON.stringify([received])
    ws.send(newMes)
  })
})
