import React from 'react'
import { ActivityIndicator } from 'antd-mobile'
import './index.less'

export default function loadingRender({
  dataLength,
  total,
  isLoading,
  onLoadMore
}) {
  const hasNext = dataLength < total

  return (
    <div
      className="loading-box"
      style={{
        paddingTop: !dataLength ? `${80}px` : isLoading ? `${20}px` : 0,
        paddingBottom: isLoading && `${20}px`
      }}
    >
      {' '}
      {isLoading ? (
        <ActivityIndicator color="#29243e" size="large" />
      ) : (
        <div
          className="load-text"
          onClick={() => {
            if (hasNext && onLoadMore) {
              onLoadMore()
            }
          }}
        >
          {' '}
          {hasNext ? '加载更多' : '没有更多了'}
        </div>
      )}{' '}
    </div>
  )
}
