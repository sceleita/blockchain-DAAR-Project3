import React, { Component } from "react";
import SCeleitaContract from "../contracts/SCeleitaContract.json";
import getWeb3 from "./getWeb3";

import { FormGroup, FormControl,Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class Bid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SCeleitaInstance: undefined,
      account: null,
      web3: null,
      projectList: null,
      projectId:'',
      toggle:false,
      myAccount:null,
      projectEnterprisenumberList:null,
      start:false,
      end:false,
      isOwner:false
    }
  }

  updateProjectId = event => {
    this.setState({projectId : event.target.value});
  }

  bid = async () => {
    let project = await this.state.SCeleitaInstance.methods.projectDetails(this.state.projectId).call();

    if(this.state.myAccount.enterprisenumber !== project.enterprisenumber){
      this.setState({toggle : true});
    }else{
      await this.state.SCeleitaInstance.methods.bid(this.state.projectId).send({from : this.state.account , gas: 1000000});
      this.setState({toggle : false});
      // Reload
    window.location.reload(false);
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

      this.setState({ SCeleitaInstance: instance, web3: web3, account: accounts[0] });
      const owner = await this.state.SCeleitaInstance.methods.getOwner().call();

      let myAccount = await this.state.SCeleitaInstance.methods.sponsorDetails(this.state.account).call();
      this.setState({myAccount : myAccount});


      let projectCount = await this.state.SCeleitaInstance.methods.getProjectNumber().call();

      let projectList = [];
      for(let i=0;i<projectCount;i++){
        let project = await this.state.SCeleitaInstance.methods.projectDetails(i).call();
        if(myAccount.enterprisenumber === project.enterprisenumber){
          projectList.push(project);
        }
      }
      this.setState({projectEnterprisenumberList : projectList});

      let start = await this.state.SCeleitaInstance.methods.getStart().call();
      let end = await this.state.SCeleitaInstance.methods.getEnd().call();

      this.setState({start : start, end : end });

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
    if(this.state.projectEnterprisenumberList){
      projectList = this.state.projectEnterprisenumberList.map((project) => {
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

    if(this.state.end){
      return(
        <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
              BIDDING HAS ENDED
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(!this.state.start){
      return(
        <div className="ProjectDetails">
        <div className="ProjectDetails-title">
          <h1>
          BIDDING HAS NOT STARTED YET.
          </h1>
        </div>

        <div className="ProjectDetails-sub-title">
        Please Wait.....While bidding starts !
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(this.state.myAccount){
      if(!this.state.myAccount.isVerified){
        return(
          <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
            You need to verified first for bidding.
            </h1>
          </div>

          <div className="ProjectDetails-sub-title">
          Please wait....the verification can take time by the admin
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
      }
    }

    if(this.state.myAccount){
      if(this.state.myAccount.hasBid){
        return(
          <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
              YOU HAVE SUCCESSFULLY DONE YOUR SPONSORSHIP BID
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
        );
      }
    }

    return (
      <div className="App">
        <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
              BID
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
          <FormGroup>
            <div className="form-label">Enter Project ID you want to sponsor - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.projectId}
                  onChange={this.updateProjectId}
              />
            </div>

            <Button onClick={this.bid} className="button-bid">
              Make a Bid
            </Button>
          </FormGroup>
        </div>

        {this.state.toggle ? <div>You can only bid to your own Enterprise Projects</div> : ''}

        <div className="ProjectDetails-mid-sub-title">
          Projects from your Enterprise
        </div>

        <div>
          {projectList}
        </div>

      </div>
    );
  }
}

export default Bid;