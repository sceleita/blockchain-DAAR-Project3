import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import SCeleitaContract from "../contracts/SCeleitaContract.json";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import "./App.css";

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
        SCeleitaInstance: undefined,
        account: null,
        balance: null,
        web3: null,
        isOwner: false
    }
  }

  componentDidMount = async () => {
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
      this.setState({SCeleitaInstance: instance, web3: web3, account: accounts[0]});
      const _balance = await web3.eth.getBalance(this.state.account);
      this.setState({balance : (_balance)/1000000000000000000});

      const owner = await this.state.SCeleitaInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }
      let start=await this.state.SCeleitaInstance.methods.getStart().call();
      let end=await this.state.SCeleitaInstance.methods.getEnd().call();

      this.setState({start : start, end : end});

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
    return (
      <div className='App'>
        <div className="ProjectDetails">
            <div className="ProjectDetails-title">
                {this.state.isOwner ?
                <h1>PROJECT SPONSORSHIP ADMIN PORTAL</h1>:
                <h1>PROJECT SPONSORSHIP USER PORTAL</h1>
                }
            </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="HOME">
            <h2>Smart Contracts for Project Sponsorships environment is working fine.</h2>
            <div>Made By Sebastian Celeita - Student Number 28716405</div>
            <h3>WALLET INFORMATION</h3>
            <div> Your user address is {this.state.account} </div>
            <div> Your user balance is {this.state.balance} ETH</div>
            {this.state.isOwner ?
            <div> Yes, you are the owner </div>:
            <div> No, you are not the ADMIN </div>
            }
        </div>
      </div>
    );
  }
}

export default Home;
