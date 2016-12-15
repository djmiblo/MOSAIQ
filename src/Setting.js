/**
 * Created by edchoi on 12/16/16.
 */
import React, { Component } from 'react';

class Setting extends Component {
  render() {
    let publishers = this.props.publishers.map((item) => (<h4>{item}</h4>));
    return (<div>
      { publishers }
    </div>);
  }
}

export default Setting;