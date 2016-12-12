/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';

class Square extends Component {
  constructor(props) {
    super(props);
  }

  getFontSize() {
    const sizeByCell = Math.sqrt(this.props.width * this.props.width * this.props.height) * 0.004;
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

    if (this.props.article.hasOwnProperty('img')){
      const imgDivStyle = {
        width: this.props.width,
        height: this.props.height,
        overflow: 'hidden',
        position: 'relative',
        verticalAlign: 'middle',
        display: 'table-cell', verticalAlign: 'middle',
        // background: 'black',
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
      const imgTitleStyle = Object.assign({}, titleStyle, {color:"black"});

      return (
        <div>
          <div style={imgDivStyle}>
            <img src={this.props.article.img} style={imgStyle}/>
            <div style={{width: '80%', left: '10%', position: 'relative'}}>
            <p style={imgTitleStyle}>{this.props.article.headline}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p style={titleStyle}>{this.props.article.headline}</p>
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