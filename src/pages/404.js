import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const NotFoundPage = ({ data, location }) => {
	const siteTitle = data.site.siteMetadata.title

	return (
		<Layout location={location} title={siteTitle}>
			<SEO title="404: Not Found" />
			<h1>文章找不到了...Sorry</h1>
			<p>
				您可以<a href="/">点击此处</a>回到首页
			</p>
		</Layout>
	)
}

export default NotFoundPage

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`
