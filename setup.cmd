SETX AGENT_TEMPDIRECTORY "C:\temp\azagent"
SETX AGENT_TOOLSDIRECTORY "C:\temp\aztools"

SETX INPUT_VERSION "latest"

SETX INPUT_TARGETPLATFORM "sqlserver"
SETX INPUT_TARGET_VERSION "latest"
SETX INPUT_WORKSPACEPATH "C:\play\yuniql\samples\sqlserver-all-features-sample"
SETX INPUT_CONNECTIONSTRING "Server=.\;Database=YUNIQLDB;Trusted_Connection=True;"
SETX INPUT_AUTOCREATEDATABASE "1"
SETX INPUT_TOKENKEYVALUEPAIR "VwColumnPrefix1=Vw1,VwColumnPrefix2=Vw2,VwColumnPrefix3=Vw3,VwColumnPrefix4=Vw4"
SETX INPUT_ADDITIONALARGUMENTS "--environment development --debug"
