const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let cards = [
  { color: 'red', text: 'Apple' },
  { color: 'blue', text: 'Sky' },
  { color: 'yellow', text: 'Sun' },
  { color: 'green', text: 'Grass' },
];

let currentIndex = 0;

io.on('connection', (socket) => {
  // Send the initial cards to the connected client
  socket.emit('cardUpdate', cards);

  // Listen for 'fetchCards' event from the client
  socket.on('fetchCards', () => {
    socket.emit('cardUpdate', cards);
  });

  // Listen for 'shuffleCards' event from the client
  socket.on('shuffleCards', () => {
    shuffleCards();
    io.emit('cardUpdate', cards);
    io.emit('messageUpdate', '');
    currentIndex = 0;
  });

  // Listen for 'guess' event from the client
  socket.on('guess', (guess) => {
    if (guess.toLowerCase() === cards[currentIndex].text.toLowerCase()) {
      io.emit('messageUpdate', 'CORRECT');
      currentIndex++;
    }
  });
});

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

const port = 3001; // Choose your desired port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
