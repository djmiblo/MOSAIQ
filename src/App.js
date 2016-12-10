import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar.js'
import Board from './Board.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar/>
        <Board/>
      </div>
    );
  }
}

export default App;
