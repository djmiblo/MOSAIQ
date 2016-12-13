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
  render() {
    return (
      <div id="wrapper">
        <button onClick={this.requestSession}>Start cast session</button>
        <button onClick={this.stopSession} type="button" id="stop">Click To Stop</button>
        <button onClick={this.handleUP} type="button">up</button>
        <button onClick={this.handleLeft} type="button">left</button>
        <button onClick={this.handleRight} type="button">right</button>
        <button onClick={this.handleDown} type="button">down</button>
        <button onClcik={this.handlePrev} type="button">prev</button>
        <button onClcik={this.handleNext} type="button">next</button>
      </div>
  );
  }
}

export default Remote;