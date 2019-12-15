import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import * as os from 'os';

const osPlat: string = os.platform();
// Don't use `os.arch()` to construct download URLs,
// Node.js uses a different set of arch identifiers for those.
const osArch: string = (os.arch() === 'ia32') ? 'x86' : os.arch();

export async function getYuniql(versionSpec: string, checkLatest: boolean) {
    try {
        let version: string = '';
        if (toolLib.isExplicitVersion(versionSpec)) {
            checkLatest = false; // check latest doesn't make sense when explicit version
        }
    
        // check cache
        let toolPath: string = '';
        if (!checkLatest) {
            toolPath = toolLib.findLocalTool('yuniql', versionSpec);
        }

        if (!toolPath) {
            if (toolLib.isExplicitVersion(versionSpec)) {
                // version to download
                version = versionSpec;
            }        
        }

        if (!toolPath) {
            // download, extract, cache
            const downloadUrl = 'https://ci.appveyor.com/api/buildjobs/wpm3hgcxbsflni06/artifacts/yuniql-nightly.zip';

            const temp: string = await toolLib.downloadTool(downloadUrl);
            console.log(temp);
    
            const extractRoot: string = await toolLib.extractZip(temp);
            console.log(extractRoot);
    
            toolLib.cacheDir(extractRoot, "yuniql", version);
            toolLib.prependPath(extractRoot);
            console.log(extractRoot);
            }
    }
    catch (err) {
        taskLib.setResult(taskLib.TaskResult.Failed, err.message);
    }
}