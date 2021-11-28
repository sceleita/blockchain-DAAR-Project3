import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
            <div className='NavigationBar'>
                    <div className="Admin">ADMIN</div>
                    <Link to ='/' className ="heading">HOME</Link>
                    <Link to='/ProjectDetails'>PROJECTS</Link>
                    <Link to='/RequestSponsor'>REGISTER AS A SPONSOR</Link>
                    <Link to='/Bid'>MAKE A SPONSORSHIP</Link>
                    <Link to='/VerifySponsor'>VERIFY SPONSORS</Link>
                    <Link to='/AddProject'>ADD NEW PROJECT</Link>
                    <Link to='/Result'>SPONSORSHIPS RESULTS</Link>
                    <Link to='/Admin'>START/END BIDDING</Link>
                </div>
        );
    }
}

export default NavigationAdmin;