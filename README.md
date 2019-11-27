## Console command to help you publish your public ssh keys to remote servers to be able to ssh into them.

[![NPM](https://nodei.co/npm/syncssh.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/syncssh/)<br/>

## Installation

Install **syncssh** with [npm](https://www.npmjs.com/): npm install -g syncssh

## Usage 
    syncssh -o push 
        - to push the public ssh keys into the cloud
    syncssh -o pull
        - on the remote server to add the public ssh key to the authorised_keys

## Use custom google cloud function
    - Install firebase-tools using: "sudo npm install -g firebase-tools"
    - Edit .firebaserc to add your project
    - Login using firebase-console
    - "firebase deploy --only functions" to deploy the function to google cloud
