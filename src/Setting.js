/**
 * Created by edchoi on 12/16/16.
 */
import React, { Component } from 'react';
import $ from 'jquery';

class Setting extends Component {
  render() {
    const modeButtonStyle = {width: '33.333%'};
    let publishers = this.props.publishers;
    const mode = this.props.mode;
    let test = (item) => {
      // $("#"+item).css('opacity', 0.1);
    };

    if (mode == 'auto') {
      return (<div>
        <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
          <button type="button" onClick={() => this.props.changeMode('auto')} className="btn btn-primary active" style={modeButtonStyle}>Auto</button>
          <buttonz type="button" onClick={() => this.props.changeMode('semi')} className="btn btn-primary" style={modeButtonStyle}>Semi</buttonz>
          <button type="button" onClick={() => this.props.changeMode('manual')} className="btn btn-primary" style={modeButtonStyle}>Manual</button>
        </div>
        <br/>
        <br />
        <h3 style={{textAlign: 'center'}}>MOSAIQ의 놀라운 추천 시스템이 가동중!</h3>
      </div>);
    } else if (mode == 'semi') {
      return (<div>
        <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
          <button type="button" onClick={() => this.props.changeMode('auto')} className="btn btn-primary" style={modeButtonStyle}>Auto</button>
          <buttonz type="button" onClick={() => this.props.changeMode('semi')} className="btn btn-primary active" style={modeButtonStyle}>Semi</buttonz>
          <button type="button" onClick={() => this.props.changeMode('manual')} className="btn btn-primary" style={modeButtonStyle}>Manual</button>
        </div>
        { publishers.map((item) => {
          return (<div id={item} className="column"  onDrag={()=>test(item)} style={{textAlign:'center'}}>{item}</div>);
        }) }
      </div>);
    } else {
      return (<div>
        <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
          <button type="button" onClick={() => this.props.changeMode('auto')} className="btn btn-primary" style={modeButtonStyle}>Auto</button>
          <buttonz type="button" onClick={() => this.props.changeMode('semi')} className="btn btn-primary" style={modeButtonStyle}>Semi</buttonz>
          <button type="button" onClick={() => this.props.changeMode('manual')} className="btn btn-primary active" style={modeButtonStyle}>Manual</button>
        </div>
        <h3 style={{textAlign: 'center'}}>MOSAIQ의 놀라운 추천 시스템이 가동중!</h3>
      </div>);
    }
  }
}

export default Setting;