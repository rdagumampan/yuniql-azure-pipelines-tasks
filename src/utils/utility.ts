import task = require('azure-pipelines-task-lib/task');
export class Utility {    
    public static argStringToArray(argString): string[] {
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
}