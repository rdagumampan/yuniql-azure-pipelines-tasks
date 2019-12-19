import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import * as os from 'os';

const osPlat: string = os.platform();
const osArch: string = (os.arch() === 'ia32') ? 'x86' : os.arch();

export async function getYuniql(versionSpec: string, checkLatest: boolean) {
    try {
        let version: string = '';
        console.log('versionSpec: ' + versionSpec);

        // when version is explicit, we dont check the latest
        if (toolLib.isExplicitVersion(versionSpec)) {
            checkLatest = false;
            console.log('isExplicitVersion = true');
            console.log('checkLatest = false');
        }

        // when version is explicit, check the cache
        let toolPath: string = '';
        if (!checkLatest) {
            toolPath = toolLib.findLocalTool('yuniql', versionSpec);
        }

        // when cached version doesnt exists, we download a fresh copy
        if (!toolPath) {
            //when version is explicit, use the version specified, else acquire latest version
            if (toolLib.isExplicitVersion(versionSpec)) {
                version = versionSpec;
            } else {
                //query latest match
                //TODO: Create release manifiest file
                version = "latest";
            }

            //download
            let dataFileName: string = '';
            switch (osPlat) {
                case 'win32': dataFileName = 'yuniql-' + version + '-win-' + osArch + '.zip'; break;
                //case 'linux': dataFileName = 'yuniql-' + version + '-linux-' + osArch + '.tar'; break;
                default: throw new Error(`Unsupported Agent OS '${osPlat}'`);
            }

            const downloadUrl = 'https://ci.appveyor.com/api/projects/rdagumampan/yuniql/artifacts/' + dataFileName;
            console.log('downloadUrl: ' + downloadUrl);

            const temp: string = await toolLib.downloadTool(downloadUrl);
            console.log('temp: ' + temp);

            //extract
            const extractRoot: string = await toolLib.extractZip(temp);
            console.log('extractRoot: ' + extractRoot);

            //cache
            if (version != 'latest') {
                toolLib.cacheDir(extractRoot, "yuniql", version);
            } else {
                //use v0.0.0 as placeholder for latest version
                toolLib.cleanVersion('0.0.0');
                toolLib.cacheDir(extractRoot, "yuniql", '0.0.0');
            }

            //append PATH
            toolLib.prependPath(extractRoot);
            console.log(extractRoot);
        }
    }
    catch (err) {
        taskLib.setResult(taskLib.TaskResult.Failed, err.message);
    }
}