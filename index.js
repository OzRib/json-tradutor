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
  let result;
  const json = getJson();
  let countToTranslate = 0;
  let translatedStrings = 0;

  function logger(){
    console.clear();
    console.log(`${countToTranslate} ${countToTranslate < 2? 'string': 'strings'} to translate`);
    console.log(`Done: ${translatedStrings}/${countToTranslate}`);
  }

  const possiblesActions = {
    string: async () => {
      return await translateString(json);
    },
    object: async () => {
      async function performInObject(object, callback){
        for(let key in object){
          const toTranslate = object[key];

          if(typeof(toTranslate) === 'object')
            await performInObject(toTranslate, callback);

          else if(typeof(toTranslate) === 'string')
            object[key] = await callback(toTranslate);
        }

        return object;
      }

      await performInObject(Object.assign(json), function(toTranslate){
        countToTranslate++;
        return toTranslate;
      });

      const translatedJson = await performInObject(Object.assign(json), async function(toTranslate){
        logger();
        const translatedString = await translateString(toTranslate);
        translatedStrings++;
        return translatedString;
      });

      return translatedJson;
    }
  }

  const typeofJson = typeof(json);
  const action = possiblesActions[typeofJson];

  result = action? await action(): json;

  logger();
  console.log(JSON.stringify(result, null, '  '));
}
main();
