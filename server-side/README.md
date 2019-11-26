## Google function implementation for ssync-cli

## Use custom google cloud function
    - Install firebase-tools using: "sudo npm install -g firebase-tools"
    - Edit .firebaserc to add your project
    - Login using firebase-console
    - "firebase deploy --only functions" to deploy the function to google cloud
    - call ssync with your custom URL (https://us-central1-<your project name here>.cloudfunctions.net/sshKey)  param to use your deplyed google function