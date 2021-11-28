import React, { Component } from "react";
import SCeleitaContract from "../contracts/SCeleitaContract.json";
import getWeb3 from "./getWeb3";

import { Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import '../index.css';

class VerifySponsor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SCeleitaInstance: undefined,
      account: null,
      web3: null,
      sponsorsList: null,
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

      this.setState({ SCeleitaInstance: instance, web3: web3, account: accounts[0] });

      let sponsorCount = await this.state.SCeleitaInstance.methods.getSponsorCount().call();

      let sponsorsList = [];
      for(let i=0;i<sponsorCount;i++){
          let sponsorAddress = await this.state.SCeleitaInstance.methods.sponsors(i).call();
          let sponsorDetails = await this.state.SCeleitaInstance.methods.sponsorDetails(sponsorAddress).call();
          if(!sponsorDetails.hasBid){
          }
          sponsorsList.push(sponsorDetails);
      }
      this.setState({sponsorsList : sponsorsList});

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

  verifySponsor = async event => {
    await this.state.SCeleitaInstance.methods.verifySponsor(event.target.value).send({from : this.state.account , gas: 100000});
    window.location.reload(false);
  }

  render() {
    let sponsorsList;
    if(this.state.sponsorsList){
        sponsorsList = this.state.sponsorsList.map((sponsor) => {
        return (
          <div className="project">
            <div className="projectName">{sponsor.name}</div>
            <div className="projectDetails">
              <div>ID : {sponsor.ID}</div>
              <div>Enterprise : {sponsor.enterprisenumber}</div>
              <div>Sponsor Address : {sponsor.sponsorAddress}</div>
            </div>

            {sponsor.isVerified ? <Button className="button-verified">Verified</Button> : <Button onClick={this.verifySponsor} value={sponsor.sponsorAddress} className="button-verify">Verify</Button>}
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
      <div>
        <div className="ProjectDetails">
          <div className="ProjectDetails-title">
            <h1>
              VERIFY SPONSORS
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div>
          {sponsorsList}
        </div>
      </div>
    );
  }
}

export default VerifySponsor;