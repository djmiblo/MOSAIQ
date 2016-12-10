/**
 * Created by edchoi on 12/9/16.
 */
import React, { Component } from 'react';
import Square from './Square';

class Board extends Component {
  constructor() {
    super();
    this.articleArr = this.getArticlesFromSever();
    this.preference = this.getPreference();
    this.rowHeight = 5;
    this.numberOfRows = Math.ceil(((screen.height - 50)/this.rowHeight)*0.95);
    this.rowStyle = {
      height: 5
    };
  }

  render() {
    let ex1 = this.makeColumn();
    let ex3 = this.makeColumn(3, [1,2,1], 50);
    let ex2 = this.makeColumn(2, [1,1]);
    let exArr = [ex1, ex3, ex2];
    let layout = this.makeCustomLayout(exArr);
    return (
      <table className="table table-bordered">
        <tbody>
        {layout}
        </tbody>
      </table>
    );
  }

  getArticlesFromSever() {

  }

  getPreference() {

  }

  makeColumn(box=1, rowSpans=[], width=0) {
    const totalRowSpans = rowSpans.reduce((a,b) => a+b, 0);
    const defaultColumn = {
      box: 1,
      rowSpans: [this.numberOfRows]
    };
    if (box < 2 || rowSpans.length != box) {
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
      box: box,
      rowSpans: actualRowSpans
    };

    if (width > 0) {
      column = Object.assign({}, column, {width: screen.width * (width/100)});
    }

    return column;
  }

  processWidth(columns) {
    let alreadySetWidth = columns.reduce((a,b) => {
      if (b.hasOwnProperty('width'))
        return a + b.width;
      else
        return a;
    }, 0);
    let leftWidth = screen.width - alreadySetWidth;
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

  makeCustomLayout(columns) {
    columns = this.processWidth(columns);

    let columnLayouts = [];
    for (let column of columns) {
      let cells = [];
      let rowSpans = column.rowSpans;
      let totalRowSpan = 0;
      while (rowSpans.length != 0) {
        let rowSpan = rowSpans.shift();
        totalRowSpan += rowSpan;
        cells.push((
          <td rowSpan={rowSpan} width={column.width}>
            <Square/>
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
}

export default Board;