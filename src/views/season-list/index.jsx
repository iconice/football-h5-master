// 赛季积分、进球统计
import React, { Component } from 'react'
import { Picker, List } from 'antd-mobile'
import { getLocalStorage } from '@/assets/utils/storage'
import { Header, NoData } from '@/components'
import {
  getGrade,
  getSeason,
  getClass,
  getSeasonScore,
  getSeasonShot
} from '@/service'
import './index.less'

export default class SeasonList extends Component {
  constructor(props) {
    super(props)
    this.userInfo = JSON.parse(getLocalStorage('userInfo'))
    this.state = {
      scoreData: [],
      shotData: [],
      size: 8,
      typeArr: [
        { value: { value: 1, name: '天天见' }, label: '天天见' },
        { value: { value: 3, name: '课堂联赛' }, label: '课堂联赛' }
      ],
      typeName: '天天见',
      typeId: 1,
      seasonArr: [],
      seasonName: '赛季',
      seasonId: '',
      yearArr: [],
      yearName: '届',
      yearId: '',
      sortArr: [
        { value: { value: 1, name: '射手榜' }, label: '射手榜' },
        { value: { value: 2, name: '积分榜' }, label: '积分榜' }
      ],
      sortName: '射手榜',
      sortId: 1,
      classArr: [],
      className: '班级',
      classId: ''
    }
  }

  componentDidMount() {
    this.init()
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
    this.setState(
      {
        yearArr,
        seasonArr,
        classArr,
        yearId: (yearArr.length && yearArr[0].value.value) || '',
        yearName: (yearArr.length && yearArr[0].label) || '',
        seasonId: seasonArr[0].value.value,
        seasonName: seasonArr[0].label,
        classId: (classArr.length && classArr[0].value.value) || '',
        className: (classArr.length && classArr[0].label) || ''
      },
      () => {
        this.getSeasonShot()
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

  // 获取赛季积分榜
  getSeasonScore = async () => {
    const { yearId, typeId, classId, seasonId, size } = this.state
    const params = {
      category: typeId,
      classId,
      gradeId: yearId,
      seasonId,
      limit: size, // 每页显示的条数
      offset: 0
    }
    const res = await getSeasonScore(params)
    this.setState({
      scoreData: res.data.records
    })
  }

  // 获取赛季射手榜
  getSeasonShot = async () => {
    const { yearId, typeId, classId, seasonId, size } = this.state
    const params = {
      category: typeId,
      teamType: typeId,
      classId,
      gradeId: yearId,
      seasonId,
      limit: size, // 每页显示的条数
      offset: 0
    }
    const res = await getSeasonShot(params)
    this.setState({
      shotData: res.data.records
    })
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
        }
        const { sortId } = this.state
        if (sortId === 1) {
          this.getSeasonShot()
        } else {
          this.getSeasonScore()
        }
      }
    )
  }

  render() {
    const {
      scoreData,
      shotData,
      typeArr,
      typeName,
      seasonArr,
      seasonName,
      yearArr,
      yearName,
      sortArr,
      sortName,
      sortId,
      classArr,
      className,
      typeId
    } = this.state
    return (
      <div className="page-wrapper season-wrapper">
        <Header isReturn history={this.props.history} title="赛季榜单" />
        <div className="search-box">
          <div className="search-line">
            <label>榜单类型：</label>
            <Picker
              data={sortArr}
              cols={1}
              extra={sortName}
              onChange={val => this.searchChange(val, 'sort')}
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
          {classArr && classArr.length && typeId === 3 ? (
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
          ) : null}
        </div>
        <div className="sort-table">
          {sortId === 1 ? (
            shotData && shotData.length ? (
              <table>
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>球员姓名</th>
                    <th>进球数</th>
                    <th>所在球队</th>
                    <th>最新完成轮次</th>
                  </tr>
                </thead>
                <tbody>
                  {shotData.map((item, index) => (
                    <tr key={`shot${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.studentName}</td>
                      <td>{item.score}</td>
                      <td>{item.teamName}</td>
                      <td>第{item.batchNo}轮</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoData />
            )
          ) : scoreData && scoreData.length ? (
            <table>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>球队名称</th>
                  <th>积分</th>
                  <th>最新完成轮次</th>
                </tr>
              </thead>
              <tbody>
                {scoreData.map((item, index) => (
                  <tr key={`score${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.teamName}</td>
                    <td>{item.score}</td>
                    <td>第{item.batchNo}轮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    )
  }
}
