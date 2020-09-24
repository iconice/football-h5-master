import React, { lazy, Suspense } from 'react'
import { ActivityIndicator } from 'antd-mobile'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Config from '@/assets/utils/config'
import history from '@/assets/utils/history'
import './App.less'

// 首页
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@/views/home'))
// 登陆页
const Login = lazy(() =>
  import(/* webpackChunkName: "activity" */ '@/views/login')
)
// 赛事详情页
const Detail = lazy(() =>
  import(/* webpackChunkName: "activity" */ '@/views/details')
)

// 赛季榜单
const SeasonList = lazy(() =>
  import(/* webpackChunkName: "activity" */ '@/views/season-list')
)

// 赛事详情页
const TotalList = lazy(() =>
  import(/* webpackChunkName: "activity" */ '@/views/total-list')
)

// 404
const NoMatch = lazy(() =>
  import(/* webpackChunkName: "404" */ '@/components/404')
)

// 页面切换loading
function Loading() {
  return (
    <div className="fullpage-loading-box">
      <ActivityIndicator color="#29243e" size="large" />
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Router basename={Config.basePath} history={history}>
        <Suspense fallback={Loading()}>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route
              path="/home"
              exact
              component={props => <Home {...props} />}
            />
            <Route
              path="/detail/:id"
              exact
              component={props => <Detail {...props} />}
            />
            <Route
              path="/seasonlist"
              exact
              component={props => <SeasonList {...props} />}
            />
            <Route
              path="/totallist"
              exact
              component={props => <TotalList {...props} />}
            />
            <Route
              path="/login"
              exact
              component={props => <Login {...props} />}
            />
            <Route component={props => <NoMatch {...props} />} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
