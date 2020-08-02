import React from 'react'
import { Link, graphql } from 'gatsby'

// import Bio from '../components/bio'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'
import './index.scss'

const BlogIndex = ({ data, location }) => {
	const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  console.log('posts:', posts)

	return (
		<Layout location={location} title={siteTitle}>
			<SEO title="博客首页" />
			{/* <Bio /> */}
			{posts.map(({ node }, i) => {
				const title = node.frontmatter.title || node.fields.slug
        const coverUrl = node.frontmatter.cover && node.frontmatter.cover.publicURL
        const showCover = i ===0 && !!coverUrl
				return (
					<article key={node.fields.slug}>
            {showCover && <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
              <header className='coverHeader'>
                <img src={coverUrl} />
                <div className='content'>
                <h2
                  style={{
                    marginBottom: rhythm(1 / 4)
                  }}
                >
                  {title} 
                </h2>
                <small>{node.frontmatter.date}</small>
                </div>
              </header>
            </Link>
            }
            {!showCover&&<header>
							<h2
								style={{
									marginBottom: rhythm(1 / 4)
								}}
							>
								<Link style={{ boxShadow: `none` }} to={node.fields.slug}>
									{title}
								</Link>
							</h2>
							<small>{node.frontmatter.date}</small>
						</header>
            }
            {/* {hightLight &&<section>
							<p
								dangerouslySetInnerHTML={{
									__html: node.frontmatter.description || node.excerpt
								}}
							/>
						</section> */}
					</article>
				)
			})}
		</Layout>
	)
}

export default BlogIndex

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
		allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
			edges {
				node {
					excerpt
					fields {
						slug
					}
					frontmatter {
						date(formatString: "MMMM DD, YYYY")
						title
            description
            cover{
              publicURL
            }
					}
				}
			}
		}
	}
`
