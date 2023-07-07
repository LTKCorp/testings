import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://island-romantic-punishment.glitch.me/'); // Replace with your server URL

const App = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for 'cardUpdate' event from the server
    socket.on('cardUpdate', (updatedCards) => {
      setCards(updatedCards);
    });

    // Listen for 'messageUpdate' event from the server
    socket.on('messageUpdate', (newMessage) => {
      setMessage(newMessage);
    });

    // Clean up the socket.io listener on unmount
    return () => {
      socket.off('cardUpdate');
      socket.off('messageUpdate');
    };
  }, []);

  useEffect(() => {
    // Fetch initial cards from the server
    socket.emit('fetchCards');

    // Clean up the cards state on unmount
    return () => {
      setCards([]);
    };
  }, []);

  const handleShuffle = () => {
    socket.emit('shuffleCards');
  };

  const handleGuessSubmit = () => {
    socket.emit('guess', guess);
    setGuess('');
  };

  const renderCards = () => {
    return cards.map((card, index) => (
      <div
        key={index}
        className="card"
        style={{ backgroundColor: card.color }}
      ></div>
    ));
  };

  return (
    <div className="App">
      <h1>Colorful Cards Game</h1>
      <button onClick={handleShuffle}>Shuffle</button>
      <div className="cards">{renderCards()}</div>
      <div className="message">{message}</div>
      <div className="guess-panel">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
        />
        <button onClick={handleGuessSubmit}>Submit Guess</button>
      </div>
    </div>
  );
};

export default App;
