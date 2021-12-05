import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { exec } = require('child_process');

const shellescape = require('shell-escape');

function execShellCommand(cmd){
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if(stdout)
        return resolve(stdout);
      else
        return reject('Failed with exec command');
    });
  });
}

async function main(){
}
main();
