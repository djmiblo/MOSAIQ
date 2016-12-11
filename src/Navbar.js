/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    const navbarStyle = {
      'marginBottom': '0px',
      minHeight: '50px',
      height: '50px'
    };
    return (
      <nav className="navbar navbar-default" style={navbarStyle}>
        <div className="container-fluid" style={navbarStyle}>
          <div className="navbar-header" style={navbarStyle}>
            <a className="navbar-brand" href="#" style={navbarStyle}>
              MOSAIQ
            </a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;