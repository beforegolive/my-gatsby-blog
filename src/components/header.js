import React from 'react'

import './header.scss'
import juejinImg from '../assets/imgs/juejin.png'
import sfImg from '../assets/imgs/sf.png'
// import weiboImg from '../assets/imgs/weibo.png'
import githubImg from '../assets/imgs/Octocat.png'
import myLogoImg from '../assets/imgs/myLogo.jpeg'

const openNewTabAndJumpTo = url => {
  window.open(url, '_blank')
}

const Header = () => {
  const sfProfileUrl = `https://segmentfault.com/u/shangxianqianxi`
  const juejinProfileUrl = `https://juejin.im/user/5cc544fdf265da03867e5a14`
  const githubProfileUrl = `https://github.com/twomeetings`
  // const weiboProfileUrl=``

  return (
    <div className="headerContainer">
      <div className="left">
        <img
          alt="my logo"
          src={myLogoImg}
          className="myLogo"
          onClick={() => (window.location.href = '/')}
        />
        <div onClick={() => (window.location.href = '/')}>首页</div>
        <div onClick={() => (window.location.href = '/profile')}>关于</div>
      </div>
      <div className="right">
        <img
          alt="juejin profile"
          src={juejinImg}
          onClick={() => openNewTabAndJumpTo(juejinProfileUrl)}
        />
        <img
          alt="segmentfault profile"
          src={sfImg}
          onClick={() => openNewTabAndJumpTo(sfProfileUrl)}
        />
        {/* <img alt='weibo profile' src={weiboImg} onClick={() => openNewTabAndJumpTo(weiboProfileUrl)} /> */}
        <img
          alt="github profile"
          src={githubImg}
          onClick={() => openNewTabAndJumpTo(githubProfileUrl)}
        />
      </div>
    </div>
  )
}

export default Header
