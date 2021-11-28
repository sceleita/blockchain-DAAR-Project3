import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AddCandidate from './components/AddProject';
import CandidateDetails from './components/ProjectDetails';
import RequestVoter from './components/RequestSponsor';
import VerifyVoter from './components/VerifySponsor';
import Vote from './components/Bid';
import Result from './components/Result';
import Admin from './components/Admin';
import Home from './components/Home';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route path= '/AddProject' component={AddCandidate} />
			<Route path= '/ProjectDetails' component={CandidateDetails} />
			<Route path= '/RequestSponsor' component={RequestVoter} />
			<Route path= '/VerifySponsor' component={VerifyVoter} />
			<Route path= '/Bid' component={Vote} />
			<Route path= '/Result' component={Result} />
			<Route path= '/Admin' component={Admin} />
		</Switch>
	</Router>,
	document.getElementById('root')
);