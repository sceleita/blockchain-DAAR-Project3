import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
	render() {
		return (
			<div className='NavigationBar'>
				<Link to='/' className ="heading">HOME</Link>
				<Link to='/ProjectDetails'>PROJECTS</Link>
				<Link to='RequestSponsor'>REGISTER AS A SPONSOR</Link>
				<Link to='Bid'>MAKE A SPONSORSHIP</Link>
				</div>
		);
	}
}

export default Navigation;