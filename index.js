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

const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  database.db.ref('/messages/').once('value').then(function (snapshot) {
    const arr = [];
    for (const message in snapshot.val()) {
      arr.unshift(snapshot.val()[message])
    }
    ws.send(JSON.stringify(arr));
  });

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`)
    const mes = JSON.parse(message);
    const received = createMessage(mes);
    writeMessage(received);
    const newMes = JSON.stringify([received])
    ws.send(newMes)
  })
})
