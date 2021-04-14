var validator = require('validator');
const TOOLS_CONFIG = require('../config')


function validateData(data, config) {
    if (!config) {
        return false
    }

    switch (config.dataType) {
        case 'integer':
            var options = {}
            if (config['max']) options['max'] = config['max']
            if (config['min']) options['min'] = config['min']
            return validator.isInt(data, options)
        case 'float':
            var options = {}
            if (config['max']) options['max'] = config['max']
            if (config['min']) options['min'] = config['min']
            return validator.isFloat(data, options)
        case 'string':
            var result = true
            if (config.regex) result = result && validator.matches(data, config.regex)
            if (config.blackList) {
                for (var s of config.blackList) {
                    result = result && !validator.contains(data, s)
                }
            }
            return result
        case 'boolean':
            return validator.isBoolean(data)
        default:
            return false;
    }
}


function parseFlagged(data, config, argList) {

    if (config.type == 'flag'){
        var setFlag = Boolean(data)
        if (setFlag) argList.push(config.flag)
    } else if (config.type == 'flaggedInput') {
        argList.push(config.flag)
        argList.push(data)
    }
}


const parseOptions = function(toolName, inputPath, outputPath, options) {
    
    var argumentList = []

    var flaggedArgs = []
    var positionalArgs = []

    var params = TOOLS_CONFIG[toolName].parameters

    console.log(params)

    for (var p in params) {

        if (p == 'input') {
            if (params.input.type == 'positional') {
                positionalArgs.push({
                    'value': inputPath,
                    'position': params.input.position
                })
            } else {
                parseFlagged(inputPath, params.input, flaggedArgs)
            }
        } else if (p == 'output') {
            if (params.output.type == 'positional') {
                positionalArgs.push({
                    'value': outputPath,
                    'position': params.output.position
                })
            } else {
                parseFlagged(outputPath, params.output, flaggedArgs)
            }
        } else {

            var data = (p in options)? options[p]: params[p].default
            if (!data && data != 0) {
                continue
            }
            
            data = validator.trim(data)
            var valid = validateData(data, params[p])
            console.log('i was here' + data)
            console.log('valid' + valid)
            if (valid) {
                if (params[p].type == 'positional') {
                    positionalArgs.push({
                        'value': data,
                        'position': params[p].position
                    })
                } else {
                    parseFlagged(data, params[p], flaggedArgs)
                }
            }
        }
    }

    positionalArgs.sort(function(a, b){
        return a.position - b.position;
    })

    argumentList = argumentList.concat(flaggedArgs)

    for (var e of positionalArgs) {
        if (e.position < 0) {
            argumentList.push(e.value)
        } else {
            argumentList.splice(e.position, 0, e.value)
        }
    }

    return argumentList
}

module.exports = parseOptions