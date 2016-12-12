/**
 * Created by edchoi on 12/9/16.
 */
import React, { Component } from 'react';
import Navbar from './Navbar'
import Row from './Row';

class Board extends Component {
  constructor() {
    super();
  }

  render() {
    let articles = this.props.articles.slice();
    let articleRows = this.divideArticles(articles.slice());
    let totalAvailHeight = (window.innerHeight - Navbar.height);
    let totalArticleLength = articles.reduce((a,b) => a + b.length, 0);
    let articleHeights = articleRows.map((item) => {
      return (item.reduce((a,b) => a + b.length, 0) / totalArticleLength) * totalAvailHeight;
    });
    //
    // console.log(articles.length);
    // console.log(articleRows[0].length + articleRows[1].length);
    // console.log('total available height: ' + totalAvailHeight);
    // console.log(totalAvailHeight == (articleHeights[0] + articleHeights[1]));
    // if (totalAvailHeight != (articleHeights[0] + articleHeights[1])) {
    //   console.log(articles);
    //   console.log(articleRows);
    // }

    return (
      <div>
          <Row articles = {articleRows[0]} height = {articleHeights[0]}/>
          <Row articles = {articleRows[1]} height = {articleHeights[1]}/>
      </div>
    );
  }

  divideArticles(articles) {
    return [[articles[0], articles[1], articles[2]], [articles[3],articles[4], articles[5], articles[6]]];
  }

  getPreference() {

  }
}

export default Board;