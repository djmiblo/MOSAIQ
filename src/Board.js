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
    return (
      <div className="container-fluid" style={{padding: '0px', margin:'0px'}}>
        {
          articleRows.map((item, i) => (<Row remoteSelect={this.props.remoteSelect} key={i} articles={item} height={articleHeights[i]} onClick={this.props.onClick}/>))
        }
      </div>
    );
  }

  divideArticles(articles) {
    articles.sort(function (a, b) {
      return b.length - a.length;
    });
    const totalLength = articles.reduce((a,b)=>a + b.length, 0);
    let selectLength = 0;
    let selects = [];
    while (selectLength < totalLength * 0.55) {
      let selectArticle = articles.shift();
      selects.push(selectArticle);
      selectLength += selectArticle.length;
    }

    return [selects, articles];
  }

  getPreference() {

  }
}

export default Board;