import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import { withPrefix } from 'gatsby'


/** 针对js加载有网络延迟的情况 */
const initTwikooWithinNetworkLag = () => {
  if (!window.twikoo) {
    setTimeout(() => {
      initTwikooWithinNetworkLag()
    }, 800)
    return
  }

  window.twikoo.init({
    envId: 'myblog-2g4y35r1e15c5506',
    el: '#tcomment',
    onCommentLoaded: function() {
      console.log('评论加载完成')
    },
  }).then(function() {
    console.log('Twikoo 加载完成')
  })
}


export const Comments = () => {
  useEffect(() => {
    initTwikooWithinNetworkLag()
  })

  return <div>
    <Helmet>
      <script src={withPrefix('twikoo.min.js')} type="text/javascript" />
    </Helmet>
    <h3>评论区</h3>
    <div id='tcomment'>评论加载中……</div>
  </div>
}

export default Comments