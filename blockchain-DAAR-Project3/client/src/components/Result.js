import React, { Component } from "react";
import SCeleitaContract from "../contracts/SCeleitaContract.json";
import getWeb3 from "./getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class Result extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SCeleitaInstance: undefined,
      account: null,
      web3: null,
      toggle:false,
      result:null,
      isOwner:false,
      projectList:null,
      start:false,
      end:false
    }
  }

  updateEnterprisenumber = event => {
    this.setState({enterprisenumber : event.target.value});
  }

  result = async () => {

    let result = [];
    let max=0;
    let projectList=[];

    let projectCount = await this.state.SCeleitaInstance.methods.getProjectNumber().call();
    for(let i=0;i<projectCount;i++){
        let project = await this.state.SCeleitaInstance.methods.projectDetails(i).call();

        if(this.state.enterprisenumber === project.enterprisenumber){
          projectList.push(project);
            if(project.sponsorCount === max){
                result.push(project);
            }else if(project.bidCount > max){
                result = [];
                result.push(project);
                max = project.bidCount;
            }
        }
    }

    this.setState({result : result});
    this.setState({toggle : true})
    this.setState({projectList : projectList});

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

      this.setState({ SCeleitaInstance: instance, web3: web3, account: accounts[0] });

      const owner = await this.state.SCeleitaInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }

      let start = await this.state.SCeleitaInstance.methods.getStart().call();
      let end = await this.state.SCeleitaInstance.methods.getEnd().call();

      this.setState({start : start, end : end });

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
    if(this.state.result){
        if(this.state.result){
          projectList = this.state.result.map((project) => {
            return (
              <div className="project">
                <div className="projectName">{project.name} : {project.bidCount} Bids received</div>
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
    }

    let projectList2;
    if(this.state.projectList){
        if(this.state.projectList){
          projectList2 = this.state.projectList.map((project) => {
            return (
              <div className="project">
                <div className="projectName">{project.name} : {project.bidCount} Bids received</div>
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

    if(!this.state.isOwner){
        return(
          <div className="ProjectDetails">
            <div className="ProjectDetails-title">
              <h1>
                ONLY ADMIN CAN ACCESS
              </h1>
            </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
    }

    if(!this.state.end){
      return(
        <div className="ProjectDetails">
        <div className="ProjectDetails-title">
          <h1>
          END THE BIDING....TO SEE SPONSORSHIP RESULTS
          </h1>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
      );
    }

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
              RESULTS
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


        <div className="form">
          <FormGroup>
            <div className="form-label">Enter Enterprise Number for results - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.enterprisenumber}
                  onChange={this.updateEnterprisenumber}
              />
            </div>
            <Button onClick={this.result} className="button-bid">
              RESULTS
            </Button>
          </FormGroup>
        </div>


        <br></br>

        {this.state.toggle ?
          <div>
            <div className="ProjectDetails-mid-sub-title">
              PROJECTS
            </div>
            {projectList}
            <div className="ProjectDetails-mid-sub-title">
              SPONSORSHIP BIDS RECEIVED
            </div>
            {projectList2}
          </div>
          : ''}
      </div>
    );
  }
}

export default Result;