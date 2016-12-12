/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';

class Square extends Component {
  constructor(props) {
    super(props);
    this.SQUARE = 'Square';
    this.VERTICAL = 'Vertical';
    this.HORIZONTAL = 'horizontal';
  }

  getShape(width, height) {
    if (width > height * 1.8)
      return this.HORIZONTAL;
    else if (height > width * 1.8)
      return this.VERTICAL;
    else
      return this.SQUARE;
  }

  render() {
    const style = {
      overflow: "hidden",
      height: this.props.height,
    };

    if (this.props.article.hasOwnProperty('img')){
      const imgLength = this.props.width > this.props.height ? this.props.height : this.props.width;
      const imgDivStyle = {
        width: this.props.width,
        height: this.props.height,
        overflow: 'hidden',
        position: 'relative'
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
      };
      return (
        <div style={{style}}>
          <div style={imgDivStyle}>
            <img src={this.props.article.img} style={imgStyle}/>
          </div>
        </div>
      );
      } else {
        return (
          <div style={{style}}>
            {this.props.article.headline}
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