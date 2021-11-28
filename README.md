# Ethereum Blockchain for Sponsoring Projects - DAAR Sorbonne Université 2021
Student Name: Sebastian Celeita Rodríguez

Student Number: 28716405

Master Informatique 2 - DIGIT


## Feature
* Register an Admin Account as a Contract owner for the environment
* Register sponsors Accounts who will bid for any project
* The Admin can add new projects, verify sponsors registration, start/end bidings and see results

## Requirement
Please have the requirement all set before start.
* Java 11+
* Truffle v5.4.22
* Ganache-2.5.4-linux-x86_64.AppImage
* MetaMask 10.6.2

## Running the project

* Clone the project and compile it:
```
$ ./node_modules/.bin/truffle compile --all
Compiling your contracts...
===========================
> Compiling ./contracts/Migrations.sol
> Compiling ./contracts/SCeleitaContract.sol
> Artifacts written to /home/ion/Downloads/DAAR3/V3.3/client/src/contracts
> Compiled successfully using:
   - solc: 0.4.17+commit.bdeb9e52.Emscripten.clang

```
* Migrate the contracts:
```
$ ./node_modules/.bin/truffle migrate --reset
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x43bd3cc01d52b60e98825400170eca0b142cb290346414e9c7c642f5fd10cc59
   > Blocks: 0            Seconds: 0
   > contract address:    0x83cB6fD8E403352e30F3a65Ec47e205911311134
   > block number:        1
   > block timestamp:     1638107834
   > account:             0xB85A98735Ca655cd7B2AD8AF63cAa3002bc39a0f
   > balance:             99.99665952
   > gas used:            167024 (0x28c70)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00334048 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00334048 ETH


2_deploy_contracts.js
=====================

   Replacing 'SCeleitaContract'
   ----------------------------
   > transaction hash:    0x94055b6d878ce62458348fc40554b2f74eef600fee7406e565de98fb2f2adb7a
   > Blocks: 0            Seconds: 0
   > contract address:    0x51f9Cd22865390d35090bD34aDe270AF5b08A6A4
   > block number:        3
   > block timestamp:     1638107835
   > account:             0xB85A98735Ca655cd7B2AD8AF63cAa3002bc39a0f
   > balance:             99.9743906
   > gas used:            1071168 (0x105840)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02142336 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.02142336 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.02476384 ETH

```
* Note that the account used in the migration is going to be your ADMIN ACCOUNT and owner of the contract.
* Move to the client folder and run npm. If you find an error ERR_OSSL_EVP_UNSUPPORTED ṕlease run the export command an run again npm: 
```
/client$ npm run start
...
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}

Node.js v17.0.1

/client$ export NODE_OPTIONS=--openssl-legacy-provider
/client$ npm run start

> client@0.1.0 start
> react-scripts start

ℹ ｢wds｣: Project is running at http://192.168.43.31/
ℹ ｢wds｣: webpack output is served from 
ℹ ｢wds｣: Content not from webpack is served from /DAAR3/V3.3/client/public
ℹ ｢wds｣: 404s will fallback to /
Starting the development server...
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.43.31:3000

Note that the development build is not optimized.
To create a production build, use yarn build.
```

* With an Admin Account in MetaMask we will do a connection with http://localhost:3000/#loaded:

![Test Image 1](Readme%20Resources/Connect.png)
![Test Image 1](Readme%20Resources/Connect2.png)
![Test Image 1](Readme%20Resources/Connect3.png)

* You're good to go.
![Test Image 1](Readme%20Resources/ConnectF.png)
## Create New Projects as an admin:
* Go to ADD NEW PROJECT in the Navigation Bar and complete the form:
  ![Test Image 1](Readme%20Resources/AddProject.png)
* Make more than 2 projects at least for the same enterprise.
  ![Test Image 1](Readme%20Resources/Projects.png)
## Change to a Sponsor Account and Register as an Sponsor:
* In MetaMask change to an sponsor account, you will see that the navigation bar changes. Select REGISTER AS A SPONSOR and complete the form. Make sure to select the same Enterprise ID Number since a Sponsor only will bid for their own internal enterprises projects.
  ![Test Image 1](Readme%20Resources/Sponsor.png)
  ![Test Image 1](Readme%20Resources/SponsorForm.png)
  ![Test Image 1](Readme%20Resources/SponsorFormWait.png)
* Do it for at least 3 different sponsors.
* In MetaMask change to the admin account, got to VERIFY SPONSORS and you will see the new registration pending to be verified.
  ![Test Image 1](Readme%20Resources/Pending.png)
  ![Test Image 1](Readme%20Resources/Verify.png)
## Start Biding:
* Once you have enough sponsors and projects registered, as an admin you can start the biding:
  ![Test Image 1](Readme%20Resources/StarBiding.png)
* In MetaMask change to an sponsor account and try to bid.
  ![Test Image 1](Readme%20Resources/Bid.png)
  ![Test Image 1](Readme%20Resources/Bid2.png)

## Stop Biding and check results:
* In MetaMask change to the admin account. Stop Biding and click in SPONSORSHIP RESULTS:
* You will see the Projects leading and each of the Sponsorship bids Received per Project
  ![Test Image 1](Readme%20Resources/Results.png)