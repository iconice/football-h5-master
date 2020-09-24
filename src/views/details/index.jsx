import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import imgs from '@/assets/images'
import { Header } from '@/components'
import { getDetail, getTeamInfo, changeScore, endRace } from '@/service'
import './index.less'

export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      teams: []
    }
  }

  componentDidMount() {
    this.init()
  }

  addScore = (index, idx) => {
    this.changeScore(index, idx, '+')
  }

  delScore = (index, idx) => {
    this.changeScore(index, idx, '-')
  }

  // 改变分数
  changeScore = async (index, idx, operation) => {
    const { teams } = this.state
    const params = {
      operation,
      // eslint-disable-next-line react/prop-types
      eventId: this.props.match.params.id,
      id: teams[index].members[idx].id,
      studentId: teams[index].members[idx].studentId,
      team: index,
      teamId: teams[index].members[idx].teamId
    }
    if (operation === '-' && Number(teams[index].members[idx].score) < 1) {
      Toast.info('进球数不能小于0哦～', 1.5)
      return
    }
    const res = await changeScore(params)
    if (res.code === 100000003) {
      const newData = [...teams]
      if (operation === '-') {
        newData[index].teamScore -= 1
        newData[index].members[idx].score -= 1
      } else {
        newData[index].teamScore = Number(newData[index].teamScore) + 1
        newData[index].members[idx].score += 1
      }
      this.setState({
        teams: newData
      })
    } else {
      Toast.info(res.msg)
    }
  }

  // 球队成员显隐
  toogleMembers = async index => {
    // debugger
    const teams = [...this.state.teams]
    let { members } = teams[index]
    if (!members.length) {
      members = await this.getTeamInfo(teams[index].teamId)
      teams[index].members = members
    }
    teams[index].isShow = !teams[index].isShow
    this.setState({
      teams
    })
  }

  // 获取球队信息
  getTeamInfo = async id => {
    const res = await getTeamInfo({
      teamId: id,
      // eslint-disable-next-line react/prop-types
      eventId: this.props.match.params.id
    })
    if (res.code === 100000003) {
      return res.data
    }

    Toast.info(res.msg)
    return {}
  }

  // 结束比赛
  endRace = async () => {
    // eslint-disable-next-line react/prop-types
    const res = await endRace({ enventId: this.props.match.params.id })
    if (res.code === 100000003) {
      const newData = { ...this.state.data }
      newData.status = '已结束'
      this.setState({
        data: newData
      })
    } else {
      Toast.info(res.msg)
    }
  }

  async init() {
    // eslint-disable-next-line react/prop-types
    const res = await getDetail({ id: this.props.match.params.id })
    if (res.code === 100000003) {
      const teams = [
        {
          teamId: res.data[0].team1Id,
          teamName: res.data[0].team1Name,
          teamScore: res.data[0].team1Score,
          members: [],
          isShow: false
        },
        {
          teamId: res.data[0].team2Id,
          teamName: res.data[0].team2Name,
          teamScore: res.data[0].team2Score,
          members: [],
          isShow: false
        }
      ]

      this.setState({
        data: res.data[0],
        teams
      })
    } else {
      Toast.info(res.msg)
    }
  }

  render() {
    const { data, teams } = this.state
    return (
      <div className="detail-wrapper page-wrapper">
        <Header isReturn history={this.props.history} title="赛事详情" />
        <div className="info-box">
          <div className="info-item">
            名称：
            <label className="txt">
              {data.team1Name} pk {data.team2Name}
              <span className="status">
                （{data.status === '0' ? '未开始' : '已结束'}）
              </span>
            </label>
          </div>
          <div className="info-item">
            赛季：
            <label className="txt">{data.season}</label>
          </div>
          <div className="info-item">
            场地：
            <label className="txt">{data.siteName}</label>
          </div>
          <div className="item-line">
            <div className="info-item">
              类型：
              <label className="txt">
                {data.category === '1' ? '天天见' : '课堂联赛'}
              </label>
            </div>
          </div>
          <div className="item-line">
            <div className="info-item">
              轮次：
              <label className="txt">第{data.batchNo}轮</label>
            </div>
            <div className="info-item">
              比分：
              <label className="txt">
                {data.team1Score}：{data.team2Score}
              </label>
            </div>
          </div>
        </div>
        {teams && teams.length ? (
          <div className="team-box">
            {teams.map((item, index) => (
              <div className="team-item" key={item.teamId}>
                <div className="title-box">
                  <img src={imgs.zuqiu1} className="icon" alt="" />
                  <div className="title">{item.teamName}：</div>
                  <div className="desc">
                    共计
                    <span className="num">{item.teamScore}</span>球
                  </div>
                </div>
                {item.isShow && (
                  <div className="member-lists">
                    {(item.members || []).map((it, idx) => (
                      <div className="member-item" key={`member${index}${idx}`}>
                        <p>
                          {idx + 1}.{it.studentName}
                        </p>
                        <p>
                          进<span className="num">{it.score}</span>球
                        </p>
                        <div
                          className={
                            data.status === '0'
                              ? 'btn add-btn'
                              : 'btn enable-btn'
                          }
                          onClick={() => {
                            if (data.status === '2') return
                            this.addScore(index, idx)
                          }}
                        >
                          加球
                        </div>
                        <div
                          className={
                            data.status === '0'
                              ? 'btn del-btn'
                              : 'btn enable-btn'
                          }
                          onClick={() => {
                            if (data.status === '2') return
                            this.delScore(index, idx)
                          }}
                        >
                          减球
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  className="show-btn"
                  onClick={() => this.toogleMembers(index)}
                >
                  {item.isShow ? '隐藏球员' : '展示球员'}
                </div>
                <img src={imgs.pk} alt="" className="pk-img" />
              </div>
            ))}
          </div>
        ) : null}
        {data.status === '0' && (
          <div className="end-race" onClick={this.endRace}>
            结束比赛
          </div>
        )}
      </div>
    )
  }
}
