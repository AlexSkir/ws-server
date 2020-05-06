var firebase = require('firebase');
var firebaseConfig = {
  apiKey: "AIzaSyDzthWJFYauBksaK3P76YC3UBJroS-o_dE",
  authDomain: "awesome-chat-ws.firebaseapp.com",
  databaseURL: "https://awesome-chat-ws.firebaseio.com",
  projectId: "awesome-chat-ws",
  storageBucket: "awesome-chat-ws.appspot.com",
  messagingSenderId: "714601216366",
  appId: "1:714601216366:web:669876390fcbb69d07297f"
};
firebase.initializeApp(firebaseConfig)

module.exports = {
  db: firebase.database(),
}