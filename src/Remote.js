/**
 * Created by edchoi on 12/13/16.
 */
import React, { Component } from 'react';
import RightArrow from './RightArrow.png';
import LeftArrow from './LeftArrow.png';
import UpArrow from './UpArrow.png';
import DownArrow from './DownArrow.png';
import Circle from './CircleIcon.png';
import Cancel from './CancelIcon.png';
import './Remote.css';

class Remote extends Component {
  constructor(){
    super();
    this.state = {
      isOpen: false,
      isConnected: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.sessionListener = this.sessionListener.bind(this);
  }
  sessionListener(newSession) {
    console.log('New session ID:' + newSession.sessionId);
    window.session = newSession;
    window.session.addUpdateListener(window.sessionUpdateListener);
    window.session.addMessageListener(window.namespace, window.receiveMessage);
    this.setState({
      isConnected: true
    });
  }
  requestSession() {
    window.chrome.cast.requestSession(this.sessionListener, window.onErr);
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
  handleSelect() {
    this.setState({
      isOpen: !this.state.isOpen
    });
    if (!this.state.isOpen)
      this.handleOK();
    else
      this.handleClose();
  }
  handleOK() {
    window.sendMessage('ok');
  }
  handleClose() {
    window.sendMessage('close');
  }
  render() {
    const isConnected = this.state.isConnected;
    return (
      <div id="wrapper">
        <div className="btn-group btn-group-lg" role="group">
        <button onClick={this.requestSession} type="button" className="btn btn-danger session-con" disabled={isConnected}>Start</button>
        <button onClick={this.stopSession} type="button" className="btn btn-danger session-con" disabled={!isConnected}>Stop</button>
        </div>
        <br />
        <br />
        <div className="btn-group btn-group-lg" role="group">
          <button onClick={this.handlePrev} type="button" className="btn btn-success page-con" disabled={!isConnected}>prev</button>
          <button onClick={this.handleNext} type="button" className="btn btn-success page-con" disabled={!isConnected}>next</button>
        </div>
        <br />
        <br />
        <div className="btn-group btn-group-lg" role="group">
          <button onClick={this.handleUP} type="button" className="btn btn-default scroll-con" id="up" disabled={!isConnected}>
            <img className="btn-img" src={UpArrow}/>
          </button>
        </div>
        <br />
        <div className="btn-group btn-group-lg btn-group-square" role="group">
          <button onClick={this.handleLeft} type="button" className="btn btn-default square-con" disabled={!isConnected}><img className="btn-img" src={LeftArrow}/></button>
          <button onClick={this.handleSelect} type="button" className="btn btn-default square-con" disabled={!isConnected}><img className="btn-img" src={this.state.isOpen? Cancel:Circle}/></button>
          {/*<button onClick={this.handleClose} type="button" className="btn btn-success square-con">X</button>*/}
          <button onClick={this.handleRight} type="button" className="btn btn-default square-con" disabled={!isConnected}><img className="btn-img" src={RightArrow}/></button>
        </div>
        <br />
        <div className="btn-group btn-group-lg" role="group">
          <button onClick={this.handleDown} type="button" className="btn btn-default scroll-con" id="down" disabled={!isConnected}>
            <img className="btn-img" src={DownArrow}/>
          </button>
        </div>
        <br/>
      </div>
  );
  }
}

export default Remote;