/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    const navbarStyle = {
      'marginBottom': '0px',
      height: '50px'
    };
    return (
      <nav className="navbar navbar-default" style={navbarStyle}>
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <img alt="MOSAIQ" />
            </a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;