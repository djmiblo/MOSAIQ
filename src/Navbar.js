/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';

class Navbar extends Component {
  static height = 50;

  render() {
    // handler for the CastMessageBus message event
    window.messageBus.onMessage = function(event) {
      if (event.data == 'next') {
        console.log('receiving chromecast message');
        console.log(this.props);
        this.props.onNext();
      }
    };
    window.castReceiverManager.start({statusText: "Application is starting"});
    console.log('Receiver Manager started');

    const navbarStyle = {
      'marginBottom': '0px',
      minHeight: '50px',
      height: this.height + 'px'
    };
    const brandStyle = {
      position: 'absolute',
      width: '50%',
      left: '25%',
      // marginLeft: '-200px !important',  /* 50% of your logo width */
      display: 'block'
    };
    return (
      <nav className="navbar navbar-default" style={navbarStyle}>
        <div className="container-fluid" style={navbarStyle}>
          <ul className="nav navbar-nav navbar-left">
            <li><a href="#" onClick={this.props.onPrev}>Prev</a></li>
          </ul>
          <div className="navbar-header" style={navbarStyle}>
            <a className="navbar-brand" href="#" style={brandStyle}>
              MOSAIQ
            </a>
          </div>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#" onClick={this.props.onNext}>Next</a></li>
            </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;