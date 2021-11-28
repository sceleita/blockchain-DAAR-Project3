import React, { Component } from "react";
import SCeleitaContract from "../contracts/SCeleitaContract.json";
import getWeb3 from "./getWeb3";

import { FormGroup, FormControl,Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class AddProject extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SCeleitaInstance: undefined,
      account: null,
      web3: null,
      name:'',
      enterprise:'',
      description:'',
      enterprisenumber:'',
      projects: null,
      isOwner:false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updateEnterprise = event => {
    this.setState({enterprise : event.target.value});
  }

  updateDescription = event => {
    this.setState({description : event.target.value});
  }

  updateEnterprisenumber = event => {
    this.setState({enterprisenumber : event.target.value});
  }

  addProject = async () => {
    await this.state.SCeleitaInstance.methods.addProject(this.state.name, this.state.enterprise, this.state.description, this.state.enterprisenumber).send({from : this.state.account , gas: 1000000});
    // Reload
    window.location.reload(false);
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

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
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
    return (
      <div className="App">

        <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
              ADD NEW PROJECT
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
          <FormGroup>
            <div className="form-label">Enter New Project Name</div>
            <div className="form-input">
              <FormControl
                input = 'text'
                value = {this.state.name}
                onChange={this.updateName}
              />
            </div>
          </FormGroup>

          <FormGroup>
              <div className="form-label">Enter Enterprise of the Project</div>
              <div className="form-input">
                <FormControl
                    input = 'textArea'
                    value = {this.state.enterprise}
                    onChange={this.updateEnterprise}
                />
              </div>
          </FormGroup>

          <FormGroup>
              <div className="form-label">Enter Project Description</div>
              <div className="form-input">
                <FormControl
                    input = 'text'
                    value = {this.state.description}
                    onChange={this.updateDescription}
                />
              </div>
          </FormGroup>

          <FormGroup>
              <div className="form-label">Enter Enterprise ID Number</div>
              <div className="form-input">
                <FormControl
                    input = 'text'
                    value = {this.state.enterprisenumber}
                    onChange={this.updateEnterprisenumber}
                />
              </div>
          </FormGroup>

          <Button onClick={this.addProject} className="button-bid">
            Add Project
          </Button>
        </div>

      </div>
    );
  }
}

export default AddProject;