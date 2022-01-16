import React from 'react'

import Layout from '../components/layout'
import Seo from '../components/seo'
import avatar from '../assets/imgs/myLogo.jpeg'
import wexinQrCode from '../assets/imgs/weixin-qr-code.jpeg'

import './profile.scss'

const Profile = ({ location }) => {
  console.log('=== location:', location)
  return (
    <Layout>
      <Seo title="关于我"></Seo>
      <div className="profileContainer">
        <h4>关于我：</h4>
        <div className="profile">
          <img src={avatar} className="mylogo"></img>
          <section className="content">
            本名许两会，前端工程师，目前就职于顺丰科技，工作地点在深圳。
            <div>分享技术博文，博文会同步在segmentFault、掘金和个人公众号等3个平台。</div>
          </section>
        </div>
        <div className="contact">
          <h4>联系方式：</h4>
          <div className="contactRow">
            <span>邮箱：</span>
            <span>2326220(at)163.com</span>
          </div>
          <div className="contactRow">
            <span>SegmentFault：</span>
            <a target="_blank" href="https://segmentfault.com/u/shangxianqianxi" rel="noreferrer">
              https://segmentfault.com/u/shangxianqianxi
            </a>
          </div>
          <div className="contactRow">
            <span>掘金：</span>
            <a target="_blank" href="https://juejin.im/user/5cc544fdf265da03867e5a14" rel="noreferrer">
              https://juejin.im/user/5cc544fdf265da03867e5a14
            </a>
          </div>
          <div className="contactRow">
            <span>Github:</span>
            <a target="_blank" href="https://github.com/beforegolive" rel="noreferrer">
              https://github.com/beforegolive
            </a>
          </div>
          <div className="contactRow">
            <span>个人公众号:</span>
            <img className="qrcode" src={wexinQrCode} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
