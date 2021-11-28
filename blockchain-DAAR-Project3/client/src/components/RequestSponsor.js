import React, { Component } from "react";
import SCeleitaContract from "../contracts/SCeleitaContract.json";
import getWeb3 from "./getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class RequestSponsor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SCeleitaInstance: undefined,
      account: null,
      web3: null,
      name:'',
      IDnumber:'',
      enterprisenumber:'',
      projects: null,
      registered: false,
      isOwner:false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updateIDnumber = event => {
    this.setState({IDnumber : event.target.value});
  }

  updateEnterprisenumber = event => {
    this.setState({enterprisenumber : event.target.value});
  }

  addSponsor = async () => {
    await this.state.SCeleitaInstance.methods.requestSponsor(this.state.name, this.state.IDnumber, this.state.enterprisenumber).send({from : this.state.account , gas: 1000000});
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

      let sponsorCount = await this.state.SCeleitaInstance.methods.getSponsorCount().call();

      let registered;
      for(let i=0;i<sponsorCount;i++){
          let sponsorAddress = await this.state.SCeleitaInstance.methods.sponsors(i).call();
          if(sponsorAddress === this.state.account){
            registered = true;
            break;
          }
      }

      this.setState({ registered : registered});

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

    if(this.state.registered){
      return(
        <div className="ProjectDetails">
        <div className="ProjectDetails-title">
          <h1>
          SPONSOR ALREADY REGISTERED
          </h1>
          Please wait until Admin verify your registration
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
              SPONSOR REGISTRATION FORM
            </h1>
          </div>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
        <FormGroup>
            <div className="form-label">Enter Name</div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.name}
                  onChange={this.updateName}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter ID Number</div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.IDnumber}
                  onChange={this.updateIDnumber}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter Enterprise Number</div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.enterprisenumber}
                  onChange={this.updateEnterprisenumber}
              />
            </div>
        </FormGroup>
        <Button onClick={this.addSponsor}  className="button-bid">
          Request to Add Sponsor
        </Button>
        </div>


      </div>
    );
  }
}

export default RequestSponsor;