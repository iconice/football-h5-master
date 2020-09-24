import React, { Component } from 'react'
import { Picker, List, Toast, Modal, Button } from 'antd-mobile'
import imgs from '@/assets/images'
import systemConfig from '@/assets/utils/config'
import { getLocalStorage, setLocalStorage } from '@/assets/utils/storage'
import { Header, NoData, LoadMore } from '@/components'
import {
  getGrade,
  getSeason,
  getClass,
  getBatchNo,
  getList,
  loginOut
} from '@/service'
import './index.less'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.userInfo = JSON.parse(getLocalStorage('userInfo'))
    this.state = {
      listData: [],
      currentPage: 0,
      size: 10,
      isLoading: false,
      total: 0, // 总条数
      yearArr: [],
      turnArr: [],
      typeArr: [
        { value: { value: 1, name: '天天见' }, label: '天天见' },
        { value: { value: 3, name: '课堂联赛' }, label: '课堂联赛' }
      ],
      statusArr: [
        { value: { value: 0, name: '未开始' }, label: '未开始' },
        { value: { value: 2, name: '已结束' }, label: '已结束' }
      ],
      seasonArr: [],
      classArr: [],
      yearName: '届',
      yearId: '',
      turnName: '轮次',
      turnId: '',
      typeName: '天天见',
      typeId: 1,
      statusName: '未开始',
      statusId: 0,
      seasonName: '赛季',
      seasonId: '',
      className: '班级',
      classId: '',
      modalShow: false
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const isLogin = getLocalStorage('token')
    if (!isLogin) {
      this.props.history.replace('/login')
    } else {
      const HomeState = JSON.parse(getLocalStorage('HomeState'))
      if (HomeState) {
        this.setState(
          {
            ...HomeState
          },
          () => {
            this.getList(0)
          }
        )
      } else {
        this.init()
      }
    }
  }

  init = async () => {
    const { typeId } = this.state
    // 年级
    const yearData = await getGrade({ userId: this.userInfo.userId })
    const yearArr = (yearData.data || []).map(it => {
      const item = {
        value: { value: it.gradeId, name: it.gradeName },
        label: it.gradeName
      }
      return item
    })
    // 赛季
    const seasonData = await getSeason()
    const seasonArr = (seasonData.data || []).map(it => {
      const item = {
        value: { value: it.seId, name: it.seName },
        label: it.seName
      }
      return item
    })
    // 班级
    let classArr = []
    if (typeId === 3) {
      const classData = await getClass({ gradeId: yearArr[0].value.value })
      classArr = (classData.data || []).map(it => {
        const item = {
          value: { value: it.classId, name: it.className },
          label: it.className
        }
        return item
      })
    }
    // 轮次
    const turnData = await getBatchNo({
      category: typeId,
      classId: (classArr.length && classArr[0].value.value) || '',
      gradeId: (yearArr.length && yearArr[0].value.value) || '',
      seasonId: seasonArr[0].value.value
    })
    const turnArr = (turnData.data || []).map(it => {
      const item = { value: { value: it, name: it }, label: it }
      return item
    })

    this.setState(
      {
        yearArr,
        seasonArr,
        classArr,
        turnArr,
        yearId: (yearArr.length && yearArr[0].value.value) || '',
        yearName: (yearArr.length && yearArr[0].label) || '',
        seasonId: seasonArr[0].value.value,
        seasonName: seasonArr[0].label,
        classId: (classArr.length && classArr[0].value.value) || '',
        className: (classArr.length && classArr[0].label) || '',
        turnId: (turnArr.length && turnArr[0].value.value) || '',
        turnName: (turnArr.length && turnArr[0].label) || ''
      },
      () => {
        this.getList(0)
      }
    )
  }

  // 获取班级
  getClass = async () => {
    const { typeId, yearId } = this.state
    if (typeId === 3) {
      const classData = await getClass({ gradeId: yearId })
      const classArr = (classData.data || []).map(it => {
        const item = {
          value: { value: it.classId, name: it.className },
          label: it.className
        }
        return item
      })
      this.setState({
        classArr,
        classId: classArr[0].value.value,
        className: classArr[0].label
      })
    }
  }

  // 获取轮次
  getBatchNo = async () => {
    const { typeId, classId, yearId, seasonId } = this.state
    const turnData = await getBatchNo({
      category: typeId,
      classId,
      gradeId: yearId,
      seasonId
    })
    const turnArr = (turnData.data || []).map(it => {
      const item = { value: { value: it, name: it }, label: it }
      return item
    })
    this.setState({
      turnArr,
      turnId: (turnArr.length && turnArr[0].value.value) || '',
      turnName: (turnArr.length && turnArr[0].label) || ''
    })
  }

  renderItem = item => (
    <div
      key={item.id}
      className="list-item"
      onClick={() => {
        setLocalStorage('HomeState', JSON.stringify(this.state))
        this.props.history.push(`/detail/${item.id}`)
      }}
    >
      <div className="name text-overflow2">
        {item.team1Name}
        <img src={imgs.pk} alt="" className="pc-ic" />
        {item.team2Name}
      </div>
      <div className="info">
        <div>{item.category === '1' ? '天天见' : '课堂联赛'}</div>
        <div className="status">
          {item.status === '2' ? '已结束' : '未开始'}
        </div>
      </div>
    </div>
  )

  // 获取比赛列表
  getList = async page => {
    await this.setState({
      isLoading: true
    })
    const {
      size,
      yearId,
      turnId,
      typeId,
      classId,
      seasonId,
      statusId,
      listData
    } = this.state
    const params = {
      batchNo: turnId,
      category: typeId,
      classId,
      gradeId: yearId,
      seasonId,
      status: statusId,
      limit: 10, // 每页显示的条数
      offset: Number(page) * Number(size)
    }
    const res = await getList(params)
    if (res.code === 100000003) {
      const { total, records } = res.data
      this.setState({
        total,
        listData: page === 0 ? records : [...listData, ...records],
        isLoading: false,
        currentPage: page
      })
    } else {
      Toast.info(res.msg)
      this.setState({
        isLoading: false
      })
    }
  }

  // 加载更多
  handleLoadmore = () => {
    this.getList(this.state.currentPage + 1)
  }

  // 搜索条件修改
  searchChange = (val, key) => {
    this.setState(
      {
        [`${key}Id`]: val[0].value,
        [`${key}Name`]: val[0].name
      },
      async () => {
        if (key === 'type' || key === 'year') {
          await this.getClass()
          await this.getBatchNo()
        } else if (key === 'class' || key === 'season') {
          await this.getBatchNo()
        }
        this.getList(0)
      }
    )
  }

  toogleMoadal = () => {
    const { modalShow } = this.state
    this.setState({
      modalShow: !modalShow
    })
  }

  // 退出登录
  loginOut = async () => {
    const { authKey } = systemConfig
    const token = getLocalStorage(authKey)
    loginOut({ token })
    localStorage.clear()
    this.props.history.replace('/login')
  }

  render() {
    const {
      listData,
      isLoading,
      total,
      yearArr,
      turnArr,
      typeArr,
      statusArr,
      seasonArr,
      classArr,
      yearName,
      turnName,
      typeName,
      statusName,
      seasonName,
      className,
      yearId,
      typeId,
      modalShow
    } = this.state
    return (
      <div className="home-wrapper page-wrapper">
        <Header title="我的" />
        <div className="user-box">
          <div className="left">
            <img alt="" src={imgs.avatar} className="avatar" />
            <div className="info">
              <div>{this.userInfo && this.userInfo.userName}</div>
              <div>{this.userInfo && this.userInfo.name}</div>
            </div>
          </div>
          <div className="right">
            <img
              alt=""
              src={imgs.settingIc}
              className="setting"
              onClick={this.toogleMoadal}
            />
          </div>
        </div>
        <div className="lists-box">
          <div className="title-box">
            <img src={imgs.zuqiu} className="icon" alt="" />
            <div className="title">赛事列表</div>
          </div>
          <div className="search-box">
            <div className="search-line">
              <label>届：</label>
              <Picker
                data={yearArr}
                cols={1}
                extra={yearName}
                onChange={val => this.searchChange(val, 'year')}
              >
                <List.Item arrow="down"></List.Item>
              </Picker>
            </div>
            <div className="search-line">
              <label>类型：</label>
              <Picker
                data={typeArr}
                cols={1}
                extra={typeName}
                onChange={val => this.searchChange(val, 'type')}
              >
                <List.Item arrow="down"></List.Item>
              </Picker>
            </div>

            {yearId && typeId === 3 && (
              <div className="search-line">
                <label>班级：</label>
                <Picker
                  data={classArr}
                  cols={1}
                  extra={className}
                  onChange={val => this.searchChange(val, 'class')}
                >
                  <List.Item arrow="down"></List.Item>
                </Picker>
              </div>
            )}
            {turnArr && turnArr.length ? (
              <div className="search-line">
                <label>轮次：</label>
                <Picker
                  data={turnArr}
                  cols={1}
                  extra={turnName}
                  onChange={val => this.searchChange(val, 'turn')}
                >
                  <List.Item arrow="down"></List.Item>
                </Picker>
              </div>
            ) : null}
            <div className="search-line">
              <label>赛季：</label>
              <Picker
                data={seasonArr}
                cols={1}
                extra={seasonName}
                onChange={val => this.searchChange(val, 'season')}
              >
                <List.Item arrow="down"></List.Item>
              </Picker>
            </div>
            <div className="search-line">
              <label>状态：</label>
              <Picker
                data={statusArr}
                cols={1}
                extra={statusName}
                onChange={val => this.searchChange(val, 'status')}
              >
                <List.Item arrow="down"></List.Item>
              </Picker>
            </div>
          </div>
          {listData && listData.length ? (
            listData.map(item => this.renderItem(item))
          ) : (
            <NoData />
          )}
          {(listData.length || (!listData.length && isLoading)) && (
            <LoadMore
              dataLength={listData.length}
              total={total}
              isLoading={isLoading}
              onLoadMore={this.handleLoadmore}
            />
          )}
        </div>
        <div className="score-list">
          <div
            className="score-list-item"
            onClick={() => {
              setLocalStorage('HomeState', JSON.stringify(this.state))
              this.props.history.push(`/seasonlist`)
            }}
          >
            赛季榜单
          </div>
          <div
            className="score-list-item"
            onClick={() => {
              setLocalStorage('HomeState', JSON.stringify(this.state))
              this.props.history.push(`/totallist`)
            }}
          >
            总榜单
          </div>
        </div>
        <Modal
          popup
          visible={modalShow}
          animationType="slide-up"
          onClose={this.toogleMoadal}
        >
          <Button type="primary" onClick={this.loginOut}>
            退出登录
          </Button>
        </Modal>
      </div>
    )
  }
}
