import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import imgs from '@/assets/images'
import Header from '@/components/header'
import { setLocalStorage } from '@/assets/utils/storage'
import systemConfig from '@/assets/utils/config'
import { login, getUserinfo } from '@/service'
import './index.less'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      passwordM: '',
      showPassword: false
    }
  }

  login = async () => {
    const { username, password } = this.state
    if (!username || !password.length) {
      Toast.info('请填写正确的账号和密码～')
      return
    }
    const res = await login({ userName: username, password })
    if (res.code === 100000003) {
      const { authKey } = systemConfig
      await setLocalStorage(authKey, res.data)
      const res2 = await getUserinfo({ token: res.data })
      if (res2.code === 100000003) {
        await setLocalStorage('userInfo', JSON.stringify(res2.data))
        this.props.history.push('/home')
      } else {
        Toast.info(res2.msg)
      }
    } else {
      Toast.info(res.msg)
    }
  }

  tooglePassword = () => {
    const { showPassword } = this.state
    this.setState({
      showPassword: !showPassword
    })
  }

  render() {
    const { username, password, showPassword } = this.state
    return (
      <div className="page-wrapper login-wrapper">
        <Header title="登录" />
        <img alt="" src={imgs.loginPic} className="top-img" />
        <div className="info-box">
          <div className="input-box-wrapper">
            <div>
              <img src={imgs.userIc} alt="" className="icon" />
            </div>
            <input
              placeholder="请输入您的账号～"
              value={username}
              onChange={e =>
                this.setState({
                  username: e.target.value
                })
              }
              className="input border-bt"
            />
          </div>
          <div className="input-box-wrapper">
            <img src={imgs.passwordIc} alt="" className="icon" />
            <div className="flex-space border-bt" style={{ flex: 1 }}>
              <input
                placeholder="请输入您的密码～"
                value={password}
                type={showPassword ? 'text' : 'password'}
                onChange={e =>
                  this.setState({
                    password: e.target.value
                  })
                }
                className="input "
                style={{ flex: 1 }}
              />
              <img
                src={showPassword ? imgs.eyeOpen : imgs.eyeClose}
                alt=""
                className="icon-eye"
                onClick={this.tooglePassword}
              />
            </div>
          </div>
        </div>
        <div className="btn" onClick={this.login}>
          登录
        </div>
      </div>
    )
  }
}
