# yuniql-azdevops-extensions

Run database migrations and schema versioning with Yuniql CLI. For developer guides and samples, visit [Yuniql on GitHub](https://github.com/rdagumampan/yuniql/wiki).

## Tasks

### 1. Install YUNIQL CLI
This download and installs the yuniql-cli.
* `Version`: The version of Yuniql CLI. If omitted, the latest version of yuniql-cli is installed. Visit the [releases](https://github.com/rdagumampan/yuniql/releases) to get an appropriate version. 

### 2. Run YUNIQL CLI

* `Database connectrion string`: The connection string to your target database server.
* `Workspace path`: The location of your version directories to run.
* `Target platform`: The target database platform. Default is SqlServer.
* `Auto-create database`: When true, creates and configure the database in the target server for yuniql migrations.
* `Target version`: The maximum target database schema version to run to.
* `Token key/value pairs`: Token key/value pairs for token replacement.

### Found bugs?

Help us improve further please [create an issue](https://github.com/rdagumampan/yuniql/issues/new).