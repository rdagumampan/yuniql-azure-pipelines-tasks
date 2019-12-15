import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';
import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as tr from 'azure-pipelines-task-lib/toolrunner';
import * as os from 'os';

async function run() {
  tl.setResourcePath(path.join(__dirname, 'task.json'));
  try {
    const version = taskLib.getInput('version', false);

    const workspacePath = taskLib.getInput('workspacePath', true);
    const connectionString = taskLib.getInput('connectionString', true);

    const targetPlatform = taskLib.getInput('targetPlatform', false);
    const autoCreateDatabase = taskLib.getInput('autoCreateDatabase', false);
    const targetVersion = taskLib.getInput('targetVersion', false);
    const tokenKeyValuePair = taskLib.getInput('tokenKeyValuePair', false);
    const additionalArguments = taskLib.getInput('additionalArguments', false);

    console.log("Run is executed");

    var yuniqlPath = path.join(toolLib.findLocalTool('yuniql', version),'yuniql.exe');

    let yuniql = new tr.ToolRunner(yuniqlPath);
    yuniql.arg('run');

    yuniql.arg('-p');
    yuniql.arg(workspacePath);

    yuniql.arg('-c');
    yuniql.arg(connectionString);

    if(targetPlatform){
      yuniql.arg('--platform');
      yuniql.arg(targetPlatform);  
    }

    if(autoCreateDatabase){
      yuniql.arg('-a');
      yuniql.arg(autoCreateDatabase);  
    }

    if(targetVersion){
      yuniql.arg('-t');
      yuniql.arg(targetVersion);  
    }

    if(tokenKeyValuePair){
      yuniql.arg('-k');
      yuniql.arg(tokenKeyValuePair);  
    }

    if(additionalArguments){
      yuniql.arg(additionalArguments);
    }

    yuniql.on('stdout', (buffer: Buffer) => {
        process.stdout.write(buffer);
    });
    yuniql.on('stderr', (buffer: Buffer) => {
        process.stderr.write(buffer);
    });

    let execOptions = { } as tr.IExecOptions;
    await yuniql.exec(execOptions);

  }
  catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
