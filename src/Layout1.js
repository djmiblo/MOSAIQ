/**
 * Created by edchoi on 12/9/16.
 */
import React, { Component } from 'react'

class Layout1 extends Component {
  render() {
    const layout1 = (<table className="table table-bordered">
      <tbody>
      <tr style={rowStyle}>
        <td rowSpan="3" style={cellStyle}>rowSpan3</td>
        <td rowSpan="5" width={screen.width/2} style={cellStyle}>rowSpan5</td>
        <td rowSpan="5" style={cellStyle}>rowSpan5</td>
      </tr>
      <tr style={rowStyle}></tr>
      <tr style={rowStyle}></tr>
      <tr style={rowStyle}>
        <td rowSpan="2" style={cellStyle}>rowSpan2</td>
      </tr>
      <tr style={rowStyle}></tr>
      </tbody>
    </table>);

    return layout1;
  }
}