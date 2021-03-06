# Yuniql Azure Pipelines Tasks

Run database migrations and schema versioning with Yuniql. Supports SqlServer, PostgreSql, MySql and others. For samples and developer guide, walk through our [documentation](https://yuniql.io/docs) and bookmark [https://yuniql.io](https://yuniql.io).

### Pre-requisites
* Verified with test pipelines on Windows-based and Ubuntu-based Hosted Agents.
* Requires a yuniql compliant directory structure. To create this structure, [install yuniql-cli](https://yuniql.io/docs/install-yuniql), issue `yuniql init`, and commit to a git repository. Use the repository as input artifact to the pipelines. You may also copy our [project samples](https://github.com/rdagumampan/yuniql/tree/master/samples) for your target database platform and commit to your own repo.

  ![](images/yuniql-init.png)

### Azure DevOps YAML Pipelines

``` yaml
trigger:
- master

pool:
  vmImage: 'windows-latest'

steps:
- task: UseYuniqlCLI@0
  inputs:
    version: 'latest'

- task: RunYuniqlCLI@0
  inputs:
    version: 'latest'
    connectionString: 'Server=tcp:<AZ-SQLSERVER>,1433;Initial Catalog=<AZ-SQLDB>;User ID=<USERID>;Password=<PASSWORD>;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
    workspacePath: '$(Build.SourcesDirectory)\samples\basic-sqlserver-sample'
    targetPlatform: 'SqlServer'
    additionalArguments: '--debug'
```

This runs database migration with yuniql-cli.
* `version`: The version of Yuniql CLI. If omitted, the latest version of yuniql-cli is installed. [Visit releases](https://github.com/rdagumampan/yuniql/releases) to get an appropriate version. 
* `connectionString`: The connection string to your target database server.
* `workspacePath`: The location of your version directories to run.
* `targetPlatform`: The target database platform. Default is SqlServer.
* `autoCreateDatabase`: When true, creates and configure the database in the target server for yuniql migrations.
* `targetVersion`: The maximum target database schema version to run to.
* `tokenKeyValuePair`: Token key/value pairs for token replacement.
* `delimiter`: The delimeter to use other than default comma when parsing CSV file.
* `additionalArguments`: Additional CLI arguments such as `--debug` to enable trace message.

### Use YUNIQL CLI Task
Downloads `Yuniql CLI` and make the CLI available for later tasks.

  ![](images/yuniql-install.png)

### Run YUNIQL CLI Task
Runs the database migration based of defined execution parameters.

  ![](images/yuniql-run.png)

## Verify YUNIQL CLI Task
Runs an uncommitted migration run. This performs a dry-run migration to verify if all works good should the versions be decided to be applied. Requires at least one successful run was made in the target database.

## Erase YUNIQL CLI Task
Erases the target database objects (tables, procedures, functions, and others) using user defined clean-up scripts placed in `_erase` directory. Yuniql doesn't have automated erasure so user have to prepare the scope of erasure. 

>WARNING: This is helpful in Dev and Test. Be very careful and remove this task when cloning pipelines for Production!

### License
Copyright (C) 2019 Rodel E. Dagumampan

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

### Found bugs?

Help us improve further please [create an issue](https://github.com/rdagumampan/yuniql/issues/new).