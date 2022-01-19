import React from 'react'
// import { Link } from "gatsby"
// import Helmet from 'react-helmet'

import { rhythm } from '../utils/typography'

import Header from './header'
import './layout.scss'

const Layout = ({ children }) => {
  // useEffect(() => {
  //   async function setHighlightCode() {
  //     try {
  //       const deckdeckgoHighlightCodeLoader = require("@deckdeckgo/highlight-code/dist/loader")

  //       await deckdeckgoHighlightCodeLoader.defineCustomElements(window)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   setHighlightCode()
  // })

  // const rootPath = `${__PATH_PREFIX__}/`
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(32),
        padding: `0 ${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
      className="post-container"
    >
      {/* <Helmet>
        <script src=
      </Helmet> */}
      <Header></Header>
      <main>{children}</main>
      <footer className="footer">
        <span>
          <a href="https://beian.miit.gov.cn/">粤ICP备2020110796号</a>
        </span>
        <span>Built with</span>
        <a href="https://www.gatsbyjs.org">Gatsby</a>
        <a href="https://twikoo.js.org/">Twikoo</a>
      </footer>
    </div>
  )
}

export default Layout
