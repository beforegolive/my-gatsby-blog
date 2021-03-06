module.exports = {
	siteMetadata: {
		title: `上线前夕`,
		author: {
			name: `许两会`,
			summary: `生活和工作在深圳的前端工程师。作为一名工程师，总要表达点什么。`
		},
		description: `A starter blog demonstrating what Gatsby can do.`,
		siteUrl: `https://gatsby-starter-blog-demo.netlify.com/`,
		social: {
			github: `twomeetings`,
			twitter: 'twomeetings'
		}
	},
	plugins: [
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/blog`,
				name: `blog`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/assets`,
				name: `assets`
			}
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 590
						}
					},
					{
						resolve: `gatsby-remark-responsive-iframe`,
						options: {
							wrapperStyle: `margin-bottom: 1.0725rem`
						}
					},
					`gatsby-remark-copy-linked-files`,
					`gatsby-remark-smartypants`,
					{
						resolve: `gatsby-remark-highlight-code`
					}
				]
      },
      pathFields:["cover"]
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
		`gatsby-plugin-feed`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				start_url: `/`,
				background_color: `#ffffff`,
				theme_color: `#663399`,
				display: `minimal-ui`,
        icon: `./content/assets/myLogo.jpeg`
			}
		},
		{
			resolve: `gatsby-plugin-baidu-tongji`,
			options: {
				siteid: '7d972948fda682a44dfb490ed2060bb6',
				head: false
			}
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: false,
        stripMetadata: true,
        defaultQuality: 75,
      },
    }
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	]
}
