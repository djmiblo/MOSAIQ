/**
 * Created by edchoi on 12/8/16.
 */
import React, { Component } from 'react';

class Square extends Component {
  constructor(props) {
    super(props);
    this.SQUARE = 1;
    this.VERTICAL = 2;
    this.HORIZONTAL = 3;
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
      // height: this.props.height,
    };
    const imgStyle = {
      maxHeight: this.props.height,
      maxWidth: this.props.width - 30,
      width: 'auto',
      height: 'auto'
    };

    // console.log(this.state.shape);
    // console.log('width: '+this.props.width);
    // console.log('height: '+this.props.height);

    let shape = this.getShape(this.props.width, this.props.height);
    if (this.props.article.hasOwnProperty('img')){
      if (shape == this.SQUARE){
        return (
          <div style={{style}}>
            <h1>{ this.props.article.headline } {shape}</h1>
            {this.props.width} {this.props.height}
            <br/>
            <br/>
            {/*{ this.props.article.body }*/}
          </div>
        );
      } else if (shape == this.VERTICAL) {
        return (
          <div style={{style}}>
            <h1>{ this.props.article.headline } {shape}</h1>
            {this.props.width} {this.props.height}
            <br/>
            <br/>
            {/*{ this.props.article.body }*/}
          </div>
        );
      } else {
        return (
          <div style={{style}}>
            <h1>{ this.props.article.headline } {shape}</h1>
            {this.props.width} {this.props.height}
            <br/>
            <br/>
            {/*{ this.props.article.body }*/}
          </div>
        );
      }
    } else {
      if (shape == this.SQUARE){
        return (
          <div style={{style}}>
            <h1>{ this.props.article.headline } {shape}</h1>
            {this.props.width} {this.props.height}
            <br/>
            <br/>
            {/*{ this.props.article.body }*/}
          </div>
        );
      } else if (shape == this.VERTICAL) {
        return (
          <div style={{style}}>
            <h1>{ this.props.article.headline } {shape}</h1>
            {this.props.width} {this.props.height}
            <br/>
            <br/>
            {/*{ this.props.article.body }*/}
          </div>
        );
      } else {
        return (
          <div style={{style}}>
            <h1>{ this.props.article.headline } {shape}</h1>
            {this.props.width} {this.props.height}
            <br/>
            <br/>
            {/*{ this.props.article.body }*/}
          </div>
        );
      }
    }
  }
}

export default Square;