import React, { Component } from 'react';
import './index.less'

export default class NoData extends Component {

  render() {
    return (
      <div className='no-data'>
        <img alt="" src={require('./no_data.png')} className='nodata-img' />
        <p>暂无相关数据～</p>
      </div>
    );
  }
}

