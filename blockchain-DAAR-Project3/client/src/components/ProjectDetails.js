import React, { Component } from "react";
import SCeleitaContract from "../contracts/SCeleitaContract.json";
import getWeb3 from "./getWeb3";

import '../index.css';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class ProjectDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SCeleitaInstance: undefined,
      account: null,
      web3: null,
      projectCount: 0,
      projectList: null,
      loaded:false,
      isOwner:false
    }
  }

  componentDidMount = async () => {

    // FOR REFRESHING PAGE ONLY ONCE -
    if(!window.location.hash){
      window.location = window.location + '#loaded';
      window.location.reload();
    }

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SCeleitaContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SCeleitaContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ SCeleitaInstance: instance, web3: web3, account: accounts[0] });

      let projectCount = await this.state.SCeleitaInstance.methods.getProjectNumber().call();
      this.setState({ projectCount : projectCount });

      let projectList = [];
      for(let i=0;i<projectCount;i++){
        let project = await this.state.SCeleitaInstance.methods.projectDetails(i).call();

        projectList.push(project);
      }

      this.setState({projectList : projectList});

      const owner = await this.state.SCeleitaInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    let projectList;
    if(this.state.projectList){
      projectList = this.state.projectList.map((project) => {
        return (
        <div className="project">
          <div className="projectName">{project.name}</div>
          <div className="projectDetails">
            <div>Enterprise : {project.enterprise}</div>
            <div>Description : {project.description}</div>
            <div>Enterprise ID Number : {project.enterprisenumber}</div>
            <div>Project ID : {project.projectId}</div>
          </div>
        </div>
        );
      });
    }

    if (!this.state.web3) {
      return (
        <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
            Loading Web3, accounts, and contract..
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    return (
      <div className="ProjectDetails">
        <div className="ProjectDetails-title">
          <h1>
            PROJECT LIST
          </h1>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="ProjectDetails-sub-title">
          Total Number of Projects - {this.state.projectCount}
        </div>
        <div>
          {projectList}
        </div>
      </div>
    );
  }
}

export default ProjectDetails;