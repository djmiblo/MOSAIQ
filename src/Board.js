/**
 * Created by edchoi on 12/9/16.
 */
import React, { Component } from 'react';
import Navbar from './Navbar'
import Row from './Row';

class Board extends Component {
  render() {
    let articles = this.props.articles.slice();
    let articleRows = this.divideArticles(articles.slice());
    let totalAvailHeight = (window.innerHeight - Navbar.height);
    let totalArticleLength = articles.reduce((a,b) => a + b.length, 0);
    let articleHeights = articleRows.map((item) => {
      return (item.reduce((a,b) => a + b.length, 0) / totalArticleLength) * totalAvailHeight;
    });
    let remoteSelect = this.props.remoteSelect;
    if (remoteSelect != null && !remoteSelect.hasOwnProperty('headline')) {
      remoteSelect = Object.assign({},articleRows[0][0]);
    }
    return (
      <div>
        {
          articleRows.map((item, i) => (<Row remoteSelect={remoteSelect} key={i} articles={item} height={articleHeights[i]} onClick={this.props.onClick}/>))
        }
      </div>
    );
  }

  divideArticles(articles) {
    articles.sort(function (a, b) {
      return a.length - b.length;
    });
    const totalLength = articles.reduce((a,b)=>a + b.length, 0);
    let selectLength = 0;
    let selects = [];
    while (selectLength < totalLength * 0.55) {
      let selectArticle = articles.pop();
      selects.push(selectArticle);
      selectLength += selectArticle.length;
    }

    return [selects, articles];
  }

  getPreference() {

  }
}

export default Board;