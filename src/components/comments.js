import React, { Component } from 'react'
import Gitalk from 'twomeetings-gitalk'
import 'gitalk/dist/gitalk.css'

export class Comments extends Component {
	componentDidMount() {
		const gitalk = new Gitalk({
			clientID: '51669cc516a1b3a3915c',
			clientSecret: 'ca647b664e75cf0602e4826183465d8cdd312ab2',
			repo: 'twomeetings.github.io',
			owner: 'beforegolive',
			admin: ['beforegolive'],
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
