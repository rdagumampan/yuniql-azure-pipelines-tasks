# param(
#     [string]$version
# )

Invoke-WebRequest -Uri https://ci.appveyor.com/api/projects/rdagumampan/yuniql/artifacts/yuniql-nightly.zip -OutFile  "c:\temp\yuniql\yuniql-nightly.zip"
Expand-Archive "c:\temp\yuniql\yuniql-nightly.zip" -DestinationPath "c:\temp\yuniql\sqlserver-samples\visitph-db"
