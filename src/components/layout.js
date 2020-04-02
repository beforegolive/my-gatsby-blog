import React, { useEffect } from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

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
			<h3
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
			</h3>
		)
	}
	return (
		<div
			style={{
				marginLeft: `auto`,
				marginRight: `auto`,
				maxWidth: rhythm(24),
				padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
			}}
		>
			<header>{header}</header>
			<main>{children}</main>
			<footer>
				© {new Date().getFullYear()}, Built with
				{` `}
				<a href="https://www.gatsbyjs.org">Gatsby</a>,{` `}
				<a href="https://gitalk.github.io/">Gitalk</a>
			</footer>
		</div>
	)
}

export default Layout
