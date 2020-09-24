// const { getLoader } = require('react-app-rewired');
const path = require('path')
const {
  addLessLoader,
  fixBabelImports,
  addWebpackResolve,
  override
} = require('customize-cra')

module.exports = override(
  addLessLoader({
    javascriptEnabled: true
  }),
  addWebpackResolve({
    alias: { '@': path.resolve(__dirname, 'src') }
  }),
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es',
    style: true
  })
)
