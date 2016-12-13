/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';
import Texture from './texture.jpg';

class Square extends Component {
  getFontSize() {
    const sizeByCell = Math.sqrt(this.props.width * this.props.width * this.props.height) * 0.0035;
    const minimumSize = 11;
    return sizeByCell > minimumSize? sizeByCell : minimumSize;
  }

  render() {
    const titleStyle = {
      fontFamily: 'serif',
      fontSize: this.getFontSize(this.props.width),
      marginBotton: '0px',
      overflowWrap: 'break-word',
      margin: '0px',
      position: 'relative',
      fontWeight: 'bold'
    };
    const imgDivStyle = {
      width: this.props.width,
      height: this.props.height,
      overflow: 'hidden',
      position: 'relative',
      verticalAlign: 'middle',
      display: 'table-cell',
    };
    const imgStyle = {
      position: 'absolute',
      left: '-1000%',
      right: '-1000%',
      top: '-1000%',
      bottom: '-1000%',
      margin: 'auto',
      minHeight: '100%',
      minWidth: '100%',
      opacity: 0.35,
    };

    if (this.props.article.hasOwnProperty('img')){
      return (
        <div>
          <div className="imgDiv" style={imgDivStyle}>
            <img src={this.props.article.img} style={imgStyle} alt="article img"/>
            <div style={{width: '80%', left: '10%', position: 'relative'}}>
              <p style={titleStyle}>{this.props.article.headline}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          {/*<p style={titleStyle}>{this.props.article.headline}</p>*/}
          <div className="imgDiv" style={imgDivStyle}>
            <img src={Texture} style={imgStyle} alt="article img"/>
            <div style={{width: '80%', left: '10%', position: 'relative'}}>
              <p style={titleStyle}>{this.props.article.headline}</p>
            </div>
          </div>
        </div>
      );
    }
  }
}
// const imgDivStyle = {
//   height: (this.props.height - titleSize),
//   overflow: 'hidden',
//   position: 'relative'
// };
// const imgStyle = {
//   width: (this.props.width - 10) + 'px',
//   height: 'auto',
//   overflow: 'hidden',
//   position: 'absolute',
//   margin: 'auto',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
// };

export default Square;