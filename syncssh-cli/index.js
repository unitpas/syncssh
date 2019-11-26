const program = require('commander');
const inquirer = require('inquirer');
const glob = require("glob");
const os = require('os');
const sshFolder = os.homedir() + '/.ssh/';
const fs = require('fs');
const request = require('request');

const url = process.env.URL || 'https://us-central1-ssync-d7c0a.cloudfunctions.net/sshKey';

program
  .requiredOption('-o, --option <pull | push>', 'pull or push ssh key');

program.parse(process.argv);

if (program.debug) console.log(program.opts());

if (program.option !== 'push' && program.option !== 'pull'){
  console.error('Invalid option');
  console.error('Usage: syncssh -o push | syncssh -o pull');
  process.exit();
}

var prompt = inquirer.createPromptModule();

if (program.option == 'push') {

  var pubKeys = glob.sync(sshFolder + "/*.pub");

  if(!pubKeys || pubKeys.length === 0){
    console.log('Could not find any public keys into directory: ', sshFolder);
    console.log('Please create a ssh key pair using ssh-keygen');
    process.exit();
  }

  prompt({
    name: 'Select the ssh key you want to use',
    type: 'list',
    choices: pubKeys
  })
  .then(optSelected => {
    var keyPath = optSelected['Select the ssh key you want to use'];
    
    try {
      var keyContent = fs.readFileSync(keyPath, 'utf8');
    } catch (err) {
      console.log('Cannot read the key file');
      console.log(err);
      return;
    }
    var postBody = {
      keyContent: keyContent
    };

    var options = {
      method: 'post',
      body: postBody,
      json: true,
      url: url
    }
    
    request(options, function (err, res, body) {
      if (err) {
        console.log('Error :', err)
        return
      }

      if(body && body.id) {
        console.log('Pull id : ', body.id);
        console.log('Use this id on remote server to enable access');
      }
    });

  });

} else {
  prompt({
    name: 'Please enter the sync key',
    type: 'input',
  })
  .then(answers => {
    
    var id = answers['Please enter the sync key'];

    if (!id) {
      console.log('Invalid answer ');
      return;
    }

    var options = {
      method: 'get',
      json: true,
      url: url + '?id=' + id
    }
    
    request(options, function (err, res, body) {
      if (err) {
        console.log('Error :', err);
        return;
      }

      if(body && body.data && body.data !== 'alive') {
        try {
          fs.appendFileSync(sshFolder + 'authorized_keys', body.data);
          console.log('authorized_keys file updated, try to ssh into this machine');
        } catch (err) {
          console.log(err);
          console.log('Cannot append to authorised_keys file make sure is writable by $USER ');
          console.log('sudo chmod 640 ~/.ssh/authorized_keys');
            
        }
      } else {
        console.log('Inexistent key or expired.');
      }
    });
    
  });
}
