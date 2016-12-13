/**
 * Created by edchoi on 12/11/16.
 */
import React, { Component } from 'react';
import Square from './Square';
import './Row.css'

class Row extends Component {
  constructor(props) {
    super(props);
    this.rowHeight = 5;
    this.rowStyle = {
      height: this.rowHeight
    }
  }

  render() {
    this.numberOfRows = Math.ceil(this.props.height/this.rowHeight);
    let columns = this.makeColumnsFromArticles(this.props.articles.slice());
    let layout = this.makeCustomLayout(columns);
    return (
      <table className="table" style={{marginBottom: '0px'}}>
        <tbody>
          {layout}
        </tbody>
      </table>
    )
  }

  makeColumnsFromArticles(articles) {
    articles.sort(function (a, b) {
      return b.length - a.length;
    });
    let numberOfColumns = this.getNumberOfColumns(articles.slice());
    let totalLength = articles.reduce((a,b) => a + b.length, 0);
    let columns = [];
    if (articles.length === numberOfColumns) {
      for (let i=0;i<numberOfColumns;i++) {
        let article = articles[i];
        columns.push(this.makeColumn([article],[1],article.length/totalLength * 100));
      }
    } else if (numberOfColumns === 2) {
      /* 기사 3개가 칼럼 2개로 나눠졌을 경우 */
      let longestArticle = articles.shift();
      columns.push(this.makeColumn([longestArticle],[1],longestArticle.length/totalLength * 100));
      columns.push(this.makeColumn(articles, articles.map((item) => item.length), (1 - longestArticle.length/totalLength)*100));
    }
    return columns;
  }

  getNumberOfColumns(articles) {
    if (articles.length !== 3)
      return articles.length;
    else {
      articles.sort(function (a, b) {
        return a.length - b.length;
      });
      /* 기사 3개를 컬럼 3개로 나눌지 컬럼 2개로 나눌지 결정 */
      let totalLength = articles.reduce((a,b)=> a + b.length, 0);
      let longestLength = articles.pop().length;
      let ratio = longestLength/totalLength;
      if (Math.abs(ratio - 0.35) < Math.abs(ratio - 0.5))
        return 3;
      else
        return 2;
    }
  }

  makeColumn(articles, rowSpans=[], width=0) {
    const totalRowSpans = rowSpans.reduce((a,b) => a+b, 0);
    const defaultColumn = {
      articles: [],
      rowSpans: [this.numberOfRows]
    };
    if (articles.length === 1) {
      rowSpans = [100];
    }
    if (articles.length < 1 || rowSpans.length !== articles.length) {
      return defaultColumn;
    }

    let actualRowSpans = rowSpans.map((span) => {
      return Math.ceil(this.numberOfRows * (span/totalRowSpans));
    });
    let totalActualRowSpans = actualRowSpans.reduce((a,b) => a+b, 0);
    while (totalActualRowSpans < this.numberOfRows) {
      actualRowSpans[0]++;
      totalActualRowSpans++;
    }
    while (totalActualRowSpans > this.numberOfRows) {
      actualRowSpans[0]--;
      totalActualRowSpans--;
    }

    let column = {
      articles: articles,
      rowSpans: actualRowSpans
    };

    if (width > 0) {
      column = Object.assign({}, column, {width: window.innerWidth * (width/100)});
    }

    return column;
  }

  makeCustomLayout(columns) {
    columns = this.processWidth(columns);
    const cellStyle = {verticalAlign:'middle', padding: '0px', borderLeft: '2px solid black', borderTop:'2px solid black'};
    const selectCellStyle = Object.assign({}, cellStyle, {background: 'rgba(0,0,0,0.6)', color: 'white'});
    let columnLayouts = [];
    for (let column of columns) {
      let cells = [];
      let rowSpans = column.rowSpans;
      let articles = column.articles;
      let totalRowSpan = 0;
      while (rowSpans.length !== 0) {
        let rowSpan = rowSpans.shift();
        let article = articles.shift();
        totalRowSpan += rowSpan;
        let isRemoteSelected = false;
        if (this.props.remoteSelect != null && this.props.remoteSelect.hasOwnProperty('headline') &&
          this.props.remoteSelect.headline == article.headline) {
          isRemoteSelected = true;
        }
        cells.push((
          <td onClick={() => this.props.onClick(article)} rowSpan={rowSpan} width={column.width} style={isRemoteSelected? selectCellStyle:cellStyle}>
            <Square height={this.rowHeight * rowSpan} width={column.width} article={article}/>
          </td>
        ));
        
        while (cells.length < totalRowSpan) {
          cells.push(null);
        }
      }
      columnLayouts.push(cells);
    }

    let rowLayouts = [];
    for (let i=0; i<this.numberOfRows; i++) {
      let row = [];
      for (let column of columnLayouts) {
        row.push(column[i]);
      }
      let rowLayout = row.reduce((a, b) => {
        if(b)
          a.push(b);
        return a;
      }, []);
      rowLayouts.push((
        <tr style={this.rowStyle}>
          {rowLayout}
        </tr>
      ));
    }

    return rowLayouts;
  }

  processWidth(columns) {
    let alreadySetWidth = columns.reduce((a,b) => {
      if (b.hasOwnProperty('width'))
        return a + b.width;
      else
        return a;
    }, 0);
    let leftWidth = window.innerWidth - alreadySetWidth;
    let numberOfColsWithoutWidth = columns.reduce((a,b) => {
      if (!b.hasOwnProperty('width'))
        return a + 1;
      else
        return a;
    }, 0);
    let averageWidth = leftWidth / numberOfColsWithoutWidth;

    columns = columns.map((column) => {
      if (!column.hasOwnProperty('width'))
        return Object.assign({}, column, {width: averageWidth});
      else
        return column;
    });

    return columns;
  }
}

export default Row;