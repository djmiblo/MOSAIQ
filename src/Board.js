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
    let articles = this.props.articles;
    let articleRows = this.divideArticles(articles.slice());
    let totalAvailHeight = (window.innerHeight - Navbar.height);
    let totalArticleLength = articles.reduce((a,b) => a + b.length, 0);
    let articleHeights = articleRows.map((item) => {
      return (item.reduce((a,b) => a + b.length, 0) / totalArticleLength) * totalAvailHeight;
    });

    return (
      <div>
          <Row articles = {articleRows[0]} height = {articleHeights[0]}/>
          <Row articles = {articleRows[1]} height = {articleHeights[1]}/>
      </div>
    );
  }

  divideArticles(articles) {
    return [[articles[articles.length - 1], articles[0], articles[0]], [articles[3],articles[3], articles[2], articles[1]]];
  }

  getPreference() {

  }
}

export default Board;