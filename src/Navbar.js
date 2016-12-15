/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';
import Logo from './Logo.png';
import Next from './LeftTri.png';
import Prev from './RightTri.png';

class Navbar extends Component {
  static height = 50;

  render() {
    const navbarStyle = {
      'marginBottom': '0px',
      minHeight: '50px',
      height: this.height + 'px'
    };
    const logoStyle = {
      height: '100%',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    };
    const brandStyle = {
      padding: '0px',
      position: 'absolute',
      width: '50%',
      left: '25%',
      right: '25%',
      // marginLeft: '-200px !important',  /* 50% of your logo width */
      display: 'block'
    };
    return (
      <nav className="navbar navbar-default" style={navbarStyle}>
        <div className="container-fluid" style={navbarStyle}>
          <div className="navbar-header" style={navbarStyle}>
            {/*<ul className="nav navbar-nav navbar-left">*/}
              <a className="navbar-brand" href="#" style={{left:'0%', padding: '0px'}}>
                <img src={Prev} onClick={this.props.onPrev} style={{height:'100%'}}/>
              </a>
            {/*</ul>*/}
            <a className="navbar-brand" href="#" style={brandStyle} onClick={this.props.onTitle}>
              <img src={Logo} style={logoStyle} />
            </a>
            {/*<ul className="nav navbar-nav navbar-right">*/}
              <a className="navbar-brand" href="#" style={{position:'absolute', right:'0%', padding: '0px'}}>
                <img src={Next} onClick={this.props.onNext} style={{height:'100%'}}/>
              </a>
            {/*</ul>*/}
          </div>
          {/*<ul className="nav navbar-nav navbar-right">*/}
            {/*<li><a href="#" onClick={this.props.ok}>OK</a></li>*/}
          {/*</ul>*/}
          {/*<ul className="nav navbar-nav navbar-right">*/}
            {/*<li><a href="#" onClick={this.props.left}>left</a></li>*/}
          {/*</ul>*/}
          {/*<ul className="nav navbar-nav navbar-right">*/}
            {/*<li><a href="#" onClick={this.props.right}>right</a></li>*/}
          {/*</ul>*/}
            {/*<ul className="nav navbar-nav navbar-right">*/}
              {/*<li><a href="#" onClick={this.props.testRemote}>TestRemote</a></li>*/}
            {/*</ul>*/}
        </div>
      </nav>
    );
  }
}

export default Navbar;