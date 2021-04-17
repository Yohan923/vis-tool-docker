var toolsConfig = require('../toolsConfig.json')
const fs = require('fs');
var path = require('path');


function getExampleFileNames(toolName, exampleFiles) {
    fileNames = []

    if (exampleFiles.length) {
        for (var fn of exampleFiles) {
            fileNames.push(fn)
        }
    } else {
        fs.readdirSync(path.join(process.cwd(), './tools/', toolName, 'examples')).forEach(file => {
            fileNames.push(file)
        })
    }

    return fileNames
}


function getTutorial(toolName, tutorial) {
    if (!tutorial){
        return 'No extra info'
    }

    if (typeof tutorial == 'boolean') {
        const data = fs.readFileSync(path.join(process.cwd(), './tools/', toolName, 'tutorial.md'), {encoding:'utf8', flag:'r'})
        return data
    } else if (typeof tutorial == 'string'){
        return tutorial
    }

    return 'No extra info'
}


function getUIConfigs() {
    var uiConfigs = {}
    uiConfigs['default'] = toolsConfig.default

    for (var tool of toolsConfig.tools) {
        uiConfigs[tool.name] = {}
        uiConfigs[tool.name]['exampleFiles'] = getExampleFileNames(tool.name, tool.exampleFiles)
        uiConfigs[tool.name]['parameters'] = {}
        uiConfigs[tool.name]['parameters']['required'] = {}
        uiConfigs[tool.name]['parameters']['optional'] = {}
        uiConfigs[tool.name]['tutorial'] = getTutorial(tool.name, tool.tutorial)
        uiConfigs[tool.name]['homepage'] = tool.homepage || ''

        if (tool.parameters.public) {
            for (var param of tool.parameters.public) {
                var tmp = {}
                tmp['label'] = param.label? param.label : param.name
                tmp['presets'] = param.presets? param.presets : []

                if ('default' in param) {
                    tmp['default'] = param.default
                    if (!tmp['presets'].includes(param.default)) {
                        tmp['presets'].splice(0, 0, param.default)
                    }
                }

                if (param.info) tmp['info'] = param.info;

                tmp['allowUserInput'] = Boolean(param.allowUserInput)

                if (param.required) {
                    uiConfigs[tool.name]['parameters']['required'][param.name] = tmp
                } else {
                    uiConfigs[tool.name]['parameters']['optional'][param.name] = tmp
                }
            }
        }

    }
    return uiConfigs
}


function getServerConfigs() {
    var serverConfigs = {}

    for (var tool of toolsConfig.tools) {
        serverConfigs[tool.name] = {}
        serverConfigs[tool.name]['executablePath'] = tool.executablePath
        serverConfigs[tool.name]['parameters'] = {}

        serverConfigs[tool.name]['parameters']['input'] = {
            'type': tool.parameters.input.type,
            'position': tool.parameters.input.position,
            'flag': tool.parameters.input.flag
        }

        serverConfigs[tool.name]['parameters']['output'] = {
            'type': tool.parameters.output.type,
            'position': tool.parameters.output.position,
            'flag': tool.parameters.output.flag
        }

        if (tool.parameters.public) {
            for (var param of tool.parameters.public) {
                var tmp = {}
                tmp['allowUserInput'] = param.allowUserInput
                tmp['dataType'] = param.dataType
                tmp['position'] = param.position
                tmp['flag'] = param.flag
                tmp['type'] = param.type
                tmp['regex'] = param.regex
                tmp['max'] = param.max
                tmp['min'] = param.min
                tmp['blackList'] = param.blackList

                if ('default' in param) {
                    tmp['default'] = param.default
                }

                serverConfigs[tool.name]['parameters'][param.name] = tmp
            }
        }


        if (tool.parameters.private) {
            for (var param of tool.parameters.private) {
                var tmp = {}
                tmp['allowUserInput'] = param.allowUserInput
                tmp['dataType'] = param.dataType
                tmp['position'] = param.position
                tmp['flag'] = param.flag
                tmp['type'] = param.type
                tmp['regex'] = param.regex
                tmp['max'] = param.max
                tmp['min'] = param.min
                tmp['blackList'] = param.blackList

                if ('default' in param) {
                    tmp['default'] = param.default
                }

                serverConfigs[tool.name]['parameters'][param.name] = tmp
            }
        }
    }
    return serverConfigs

}

module.exports.getUIConfigs = getUIConfigs;
module.exports.getServerConfigs = getServerConfigs;