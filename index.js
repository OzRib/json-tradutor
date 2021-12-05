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

function getJson(){
  function getArgsProperties(){
    const args = process.argv.slice(2);
    const jsonFilePath = args[0];
    const exportName = args[1];

    function formatJsonFilePath(){
      let hasAIndex = false;
      const possiblesInitialFileIndexes = ['./', '~/'];

      possiblesInitialFileIndexes.forEach(fileIndex => {
        if(jsonFilePath.indexOf(fileIndex) === 0)
          hasAIndex = true;
      });

      if(hasAIndex)
        return jsonFilePath
      else
        return './' + jsonFilePath;
    }

    if(jsonFilePath === undefined)
      throw new Error('No json file provided');

    return {
      jsonFilePath: formatJsonFilePath(),
      exportName
    }
  }

  let result;
  const {
    jsonFilePath,
    exportName
  } = getArgsProperties();

  if(exportName === undefined)
    result = require(jsonFilePath);
  else
    result = require(jsonFilePath)[exportName];

  return result;
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
