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

async function translateString(toTranslate){
  const escapedString = shellescape([toTranslate]);
  const request = `python translate.py ${escapedString}`;

  const response = await execShellCommand(request);

  return response;
}

async function main(){
}
main();
