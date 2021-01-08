import React, { useEffect } from 'react'
import { Link } from 'gatsby'

import Header from './header'
import { rhythm, scale } from '../utils/typography'
import './layout.scss'

const Layout = ({ children }) => {
	useEffect(() => {
		async function setHighlightCode() {
			try {
				const deckdeckgoHighlightCodeLoader = require('@deckdeckgo/highlight-code/dist/loader')

				await deckdeckgoHighlightCodeLoader.defineCustomElements(window)
			} catch (err) {
				console.error(err)
			}
		}

		setHighlightCode()
	})

	const rootPath = `${__PATH_PREFIX__}/`
	return (
		<div
			style={{
				marginLeft: `auto`,
				marginRight: `auto`,
				maxWidth: rhythm(32),
				padding: `0 ${rhythm(1.5)} ${rhythm(3 / 4)}`
			}}
			className="post-container"
		>
			<Header></Header>
			<main>{children}</main>
			<footer className="footer">
				<span>© {new Date().getFullYear()} 深圳市悦初科技有限公司</span>
				<span>粤ICP备2020110796号</span>
				<span>Built with</span>
				<a href="https://www.gatsbyjs.org">Gatsby</a>
				<a href="https://gitalk.github.io/">Gitalk</a>
			</footer>
		</div>
	)
}

export default Layout
