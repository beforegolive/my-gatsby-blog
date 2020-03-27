import React, { Component } from 'react'
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'

export class Comments extends Component {
	componentDidMount() {
		const gitalk = new Gitalk({
			clientID: '1d481fc0172197173fb8',
			clientSecret: '887bb8f09c5d35f4bdd70044060ce9ba09663d73',
			repo: 'twomeetings.github.io',
			owner: 'twomeetings',
			admin: ['twomeetings'],
			id: window.location.pathname, // Ensure uniqueness and length less than 50
			distractionFreeMode: false // Facebook-like distraction free mode
		})

		gitalk.render('gitalk-container')
	}
	render() {
		return <div id="gitalk-container"></div>
	}
}

export default Comments
