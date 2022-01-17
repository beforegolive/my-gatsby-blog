import React, { useEffect } from 'react'

export const Comments = () => {
  useEffect(() => {
    window.twikoo.init({
      envId: 'myblog-2g4y35r1e15c5506',
      el: '#tcomment',
      onCommentLoaded: function() {
        console.log('评论加载完成')
      },
    }).then(function() {
      console.log('Twikoo 加载完成')
    })
  })

  return <div>
    <h3>评论区</h3>
    <div id='tcomment'>评论区</div>
  </div>
}

export default Comments