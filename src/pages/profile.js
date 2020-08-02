import React from "react";

import Layout from '../components/layout'
import SEO from '../components/seo'
import avatar from '../assets/imgs/myLogo.jpeg'
import wexinQrCode from '../assets/imgs/weixin-qr-code.jpeg'

import "./profile.scss";

const Profile = ({location})=>{
  return (<Layout>
    <SEO title='关于我'></SEO>
    <div className='profileContainer'>
      <h4>关于我：</h4>
      <div className='profile'>
        <img src={avatar} class='mylogo'></img>
        <section className='content'>本名许两会，2010年毕业于安徽大学计算机学院网络工程系，前端工程师，目前就职于Thoughtworks，工作地点在深圳。
          <div>每周分享一篇技术博文，博文会同步在segmentFault、掘金和个人公众号等3个平台。</div>
        </section>
      </div>
      <div className='contact'>
        <h4>联系方式：</h4>
        <div className='contactRow'>  
          <span>邮箱：</span>
          <span>2326220(at)163.com</span>
        </div>
        <div className='contactRow'>
          <span>SegmentFault：</span>
          <a target='_blank'  href='https://segmentfault.com/u/shangxianqianxi'>https://segmentfault.com/u/shangxianqianxi</a>
        </div>
        <div className='contactRow'>
          <span>掘金：</span>
          <a target='_blank'  href='https://juejin.im/user/5cc544fdf265da03867e5a14'>https://juejin.im/user/5cc544fdf265da03867e5a14</a>
        </div>
        <div className='contactRow'>
          <span>Github:</span>
          <a target='_blank' href='https://github.com/twomeetings'>https://github.com/twomeetings</a>
        </div>
        <div className='contactRow'>
          <span>个人公众号:</span>
          <img className='qrcode' src={wexinQrCode} />
        </div>
      </div>
    </div>
  </Layout>)
}

export default Profile