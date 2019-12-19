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

        const workspacePath = taskLib.getInput('workspacePath', true);
        const connectionString = taskLib.getInput('connectionString', true);

        const targetPlatform = taskLib.getInput('targetPlatform', false);
        const autoCreateDatabase = taskLib.getInput('autoCreateDatabase', false);
        const targetVersion = taskLib.getInput('targetVersion', false);
        const tokenKeyValuePair = taskLib.getInput('tokenKeyValuePair', false);
        const additionalArguments = taskLib.getInput('additionalArguments', false);

        console.log("Run is executed");

        //picksup the version downloaded from install task
        let version: string = '';
        console.log('versionSpec: ' + versionSpec);
        if (toolLib.isExplicitVersion(versionSpec)) {
            version = versionSpec;
        } else {
            //use v0.0.0 as placeholder for latest version
            version = '0.0.0'
        }

        //check the agent os, we use EXE in windows
        //TODO: Support linux agents
        let dataFileName: string = '';
        switch (osPlat) {
            case 'win32': dataFileName = 'yuniql.exe'; break;
            default: throw new Error(`Unsupported Agent OS '${osPlat}'`);
        }

        if (osPlat == 'win32') {
            var yuniqlPath = path.join(toolLib.findLocalTool('yuniql', version), 'yuniql.exe');

            //builds up the arguments structure
            let yuniql = new tr.ToolRunner(yuniqlPath);
            yuniql.arg('run');

            yuniql.arg('-p');
            yuniql.arg(workspacePath);

            yuniql.arg('-c');
            yuniql.arg(connectionString);

            if (targetPlatform && targetPlatform.toUpperCase() != 'SQLSERVER') {
                yuniql.arg('--platform');
                yuniql.arg(targetPlatform);
            }

            if (autoCreateDatabase) {
                yuniql.arg('-a');
                yuniql.arg(autoCreateDatabase);
            }

            if (targetVersion && targetVersion.toUpperCase() != 'LATEST') {
                yuniql.arg('-t');
                yuniql.arg(targetVersion);
            }

            if (tokenKeyValuePair) {
                yuniql.arg('-k');
                yuniql.arg(tokenKeyValuePair);
            }

            if (additionalArguments) {
                yuniql.arg(additionalArguments);
            }

            yuniql.on('stdout', (buffer: Buffer) => {
                process.stdout.write(buffer);
            });
            yuniql.on('stderr', (buffer: Buffer) => {
                process.stderr.write(buffer);
            });

            //execute migrations with cli arguments
            let execOptions = {} as tr.IExecOptions;
            await yuniql.exec(execOptions);
        } else {
            throw new Error(`Unsupported Agent OS '${osPlat}'`);
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
