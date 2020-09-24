import React, { Component } from 'react'
import PropTypes from 'prop-types'
import imgs from '@/assets/images'
import './index.less'

export default class Header extends Component {
  render() {
    const { isReturn, title, history } = this.props
    return (
      <div className="header-box">
        {isReturn ? (
          <div
            className="back-box"
            onClick={() => {
              console.log(this.props)
              history.goBack()
            }}
          >
            <img alt="" src={imgs.backIc} className="back-ic" />
          </div>
        ) : null}
        <div className="title">{title}</div>
      </div>
    )
  }
}

Header.propTypes = {
  isReturn: PropTypes.bool,
  history: PropTypes.string,
  title: PropTypes.string
}

Header.defaultProps = {
  isReturn: false,
  history: '', // 当isReturn为true时必传
  title: ''
}
