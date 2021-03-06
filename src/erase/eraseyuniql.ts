import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';
import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as tr from 'azure-pipelines-task-lib/toolrunner';
import * as os from 'os';

const osPlat: string = os.platform();
const osArch: string = (os.arch() === 'ia32') ? 'x86' : os.arch();

async function run() {
    tl.setResourcePath(path.join(__dirname, 'task.json'));
    try {
        const versionSpec = taskLib.getInput('version', false);
        const connectionString = taskLib.getInput('connectionString', true);
        const workspacePath = taskLib.getInput('workspacePath', true);
        const targetPlatform = taskLib.getInput('targetPlatform', false);
        const tokenKeyValuePair = taskLib.getInput('tokenKeyValuePair', false);
        const additionalArguments = taskLib.getInput('additionalArguments', false);

        console.log('yuniql/input_version: ' + versionSpec);
        console.log('yuniql/input_connectionString: ' + connectionString);
        console.log('yuniql/input_workspacePath: ' + workspacePath);
        console.log('yuniql/input_targetPlatform: ' + targetPlatform);
        console.log('yuniql/input_tokenKeyValuePair: ' + tokenKeyValuePair);
        console.log('yuniql/input_additionalArguments: ' + additionalArguments);

        console.log('yuniql/var_osPlat: ' + osPlat);
        console.log('yuniql/var_osArch: ' + osArch);

        //picksup the version downloaded from install task
        let versionLocation: string = '';
        if (toolLib.isExplicitVersion(versionSpec)) {
            versionLocation = versionSpec;
        } else {
            //use v0.0.0 as placeholder for latest version
            versionLocation = 'v0.0.0'
        }

        var yuniqlBasePath = path.join(toolLib.findLocalTool('yuniql', versionLocation));
        console.log('yuniql/var_yuniqlBasePath: ' + yuniqlBasePath);

        //use exe file when in windows, else use linux native file
        let yuniqlExecFilePath: string = '';
        if (osPlat == 'win32') {
            yuniqlExecFilePath = path.join(yuniqlBasePath, 'yuniql.exe');
            console.log('yuniql/var_yuniqlExecFilePath: ' + yuniqlExecFilePath);
        } else {
            yuniqlExecFilePath = path.join(yuniqlBasePath, 'yuniql');
            console.log('yuniql/var_yuniqlExecFilePath: ' + yuniqlExecFilePath);
        }

        //builds up the arguments structure
        let yuniql = new tr.ToolRunner(yuniqlExecFilePath);
        yuniql.arg('erase');

        yuniql.arg('-p');
        yuniql.arg(workspacePath);

        yuniql.arg('-c');
        yuniql.arg(connectionString);

        if (targetPlatform && targetPlatform.toLowerCase() != 'sqlserver') {
            yuniql.arg('--platform');
            yuniql.arg(targetPlatform);
        }

        if (tokenKeyValuePair) {
            yuniql.arg('-k');
            yuniql.arg(tokenKeyValuePair);
        }

        if (additionalArguments) {
          var additionalArgumentsArray = argStringToArray(additionalArguments);
          yuniql.arg(additionalArgumentsArray);

          console.log("yuniql/additionalArguments array is");
          for(var i = 0 ; i < additionalArgumentsArray.length ; i++ ) {
              console.log("arg#" + i + ": " + additionalArgumentsArray[i]);
          }
        }

      //execute migrations with cli arguments
        let yuniqlExecOptions = {} as tr.IExecOptions;
        await yuniql.exec(yuniqlExecOptions);
    }
    catch (error) {
        console.log('yuniql/error: ' + error.message);
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

function argStringToArray(argString): string[] {
    var args = [];
    var inQuotes = false;
    var escaped = false;
    var arg = '';
    var append = function (c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    };
    for (var i = 0; i < argString.length; i++) {
        var c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === "\\" && inQuotes) {
            if(escaped) {
                append(c);
            }
            else {
                escaped = true;
            }

            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}

run();
