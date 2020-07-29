import React, { useEffect } from 'react'
import { Link } from 'gatsby'

import Header from './header'
import { rhythm, scale } from '../utils/typography'
import './layout.scss'

const Layout = ({ location, title, children }) => {
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
	let header

	if (location.pathname === rootPath) {
		header = (
			<h1
				style={{
					...scale(1.5),
					marginBottom: rhythm(1.5),
					marginTop: 0
				}}
			>
				<Link
					style={{
						boxShadow: `none`,
						textDecoration: `none`,
						color: `inherit`
					}}
					to={`/`}
				>
					{title}
				</Link>
			</h1>
		)
	} else {
		header = (
			<h2
				style={{
					fontFamily: `Montserrat, sans-serif`,
					marginTop: 0
				}}
			>
				<Link
					style={{
						boxShadow: `none`,
						textDecoration: `none`,
						color: `inherit`
					}}
					to={`/`}
				>
					{title}
				</Link>
			</h2>
		)
	}
	return (
		<div
			style={{
				marginLeft: `auto`,
				marginRight: `auto`,
				maxWidth: rhythm(32),
				padding: `0 ${rhythm(1.5)} ${rhythm(3 / 4)}`,
			}}
      className='post-container'
		>
      <Header></Header>
			<main>{children}</main>
			<footer className='footer'>
				© {new Date().getFullYear()}, Built with
				{` `}
				<a href="https://www.gatsbyjs.org">Gatsby</a>,{` `}
				<a href="https://gitalk.github.io/">Gitalk</a>
			</footer>
		</div>
	)
}

export default Layout
