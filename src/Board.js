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
        <div className="container-fluid" style={{padding: '0px', margin:'0px', textAlign:'center'}}><h4>{this.props.section}</h4></div>
        {
          articleRows.map((item, i) => (<Row sort={this.props.sort} preference={this.props.preference} remoteSelect={this.props.remoteSelect} key={i} articles={item} height={articleHeights[i]} onClick={this.props.onClick}/>))
        }
      </div>
    );
  }

  divideArticles(articles) {
    let pref = this.props.preference;
    articles.sort(function (a, b) {
      if (this != null)
        return this.props.sort(a,b);
      else
        return b.length*pref[b.type] - a.length*pref[a.type];
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