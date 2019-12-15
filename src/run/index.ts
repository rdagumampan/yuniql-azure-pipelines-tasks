import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';

async function run() {
  tl.setResourcePath(path.join(__dirname, 'task.json'));
  try {
    console.log("Run is executed");
  }
  catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
