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
      <div>
        {
          articleRows.map((item, i) => (<Row key={i} articles={item} height={articleHeights[i]} onClick={this.props.onClick}/>))
        }
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