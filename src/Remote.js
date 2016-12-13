/**
 * Created by edchoi on 12/13/16.
 */
import React, { Component } from 'react'

class Remote extends Component {
  requestSession() {
    window.chrome.cast.requestSession(window.sessionListener, window.onErr);
  };
  stopSession() {
    window.stopApp();
  };
  handleUP() {
    window.sendMessage("up");
  };
  handleDown() {
    window.sendMessage("down");
  };
  handleLeft() {
    window.sendMessage('left');
  };
  handleRight() {
    window.sendMessage('right');
  };
  handlePrev() {
    window.sendMessage('prev');
  };
  handleNext() {
    window.sendMessage('next');
  };
  handleOK() {
    window.sendMessage('ok');
  }
  handleClose() {
    window.sendMessage('close');
  }
  render() {
    return (
      <div id="wrapper">
        <button onClick={this.requestSession}>Start cast session</button>
        <button onClick={this.stopSession} type="button" id="stop">Click To Stop</button>
        <button onClick={this.handleUP} type="button">up</button>
        <button onClick={this.handleLeft} type="button">left</button>
        <button onClick={this.handleRight} type="button">right</button>
        <button onClick={this.handleDown} type="button">down</button>
        <button onClick={this.handlePrev} type="button">prev</button>
        <button onClick={this.handleNext} type="button">next</button>
        <button onClick={this.handleOK} type="button">OK</button>
        <button onClick={this.handleClose} type="button">Close</button>
      </div>
  );
  }
}

export default Remote;