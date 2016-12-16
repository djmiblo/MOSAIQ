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
    return (
      <div>
      <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
        <button type="button" onClick={() => this.props.changeMode('up')} className="btn btn-primary" style={modeButtonStyle}>Up</button>
        <buttonz type="button" className="btn btn-primary active" style={modeButtonStyle}>{this.props.pages}</buttonz>
        <button type="button" onClick={() => this.props.changeMode('down')} className="btn btn-primary" style={modeButtonStyle}>Down</button>
      </div>
        {/*<br/>*/}
        {/*<br/>*/}
        {/*<div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>*/}
          {/*<button type="button" onClick={() => this.props.changeMode('ok')} className="btn btn-danger" style={{width: '100%'}}>선호도 적용하기</button>*/}
        {/*</div>*/}
      </div>
    );
    //
    // if (mode == 'auto') {
    //   return (<div>
    //     <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
    //       <button type="button" onClick={() => this.props.changeMode('auto')} className="btn btn-primary active" style={modeButtonStyle}>Auto</button>
    //       <buttonz type="button" onClick={() => this.props.changeMode('semi')} className="btn btn-primary" style={modeButtonStyle}>Semi</buttonz>
    //       <button type="button" onClick={() => this.props.changeMode('manual')} className="btn btn-primary" style={modeButtonStyle}>Manual</button>
    //     </div>
    //     <br/>
    //     <br />
    //     <h3 style={{textAlign: 'center'}}>MOSAIQ의 놀라운 추천 시스템이 가동중!</h3>
    //     <br/>
    //     <button type="button" onClick={() => this.props.applySetting} className="btn btn-danger" style={modeButtonStyle}>적용!</button>
    //   </div>);
    // } else if (mode == 'semi') {
    //   return (<div>
    //     <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
    //       <button type="button" onClick={() => this.props.changeMode('auto')} className="btn btn-primary" style={modeButtonStyle}>Auto</button>
    //       <buttonz type="button" onClick={() => this.props.changeMode('semi')} className="btn btn-primary active" style={modeButtonStyle}>Semi</buttonz>
    //       <button type="button" onClick={() => this.props.changeMode('manual')} className="btn btn-primary" style={modeButtonStyle}>Manual</button>
    //     </div>
    //     { publishers.map((item, i) => {
    //       return (<div key={i} id={item} className="column"  onDrag={()=>test(item)} style={{textAlign:'center'}}>{item}</div>);
    //     }) }
    //   </div>);
    // } else {
    //   return (<div>
    //     <div className="btn-group btn-group-lg" role="group" style={{width: '60%'}}>
    //       <button type="button" onClick={() => this.props.changeMode('auto')} className="btn btn-primary" style={modeButtonStyle}>Auto</button>
    //       <buttonz type="button" onClick={() => this.props.changeMode('semi')} className="btn btn-primary" style={modeButtonStyle}>Semi</buttonz>
    //       <button type="button" onClick={() => this.props.changeMode('manual')} className="btn btn-primary active" style={modeButtonStyle}>Manual</button>
    //     </div>
    //     <h3 style={{textAlign: 'center'}}>MOSAIQ의 놀라운 추천 시스템이 가동중!</h3>
    //   </div>);
    // }
  }
}

export default Setting;