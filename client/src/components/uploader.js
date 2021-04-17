import React, { useEffect, useState } from 'react';
import { getExample, uploadTextToServer } from "../utils/requestHandlers";
import { ToolParams }  from "./toolParams";
import Dropdown from 'react-dropdown';
import Popup from 'reactjs-popup';
import 'react-dropdown/style.css';
import './uploader.css';
import { Button, Alert } from 'react-bootstrap';


export function Uploader(props) {

    const [tools, setTools] = useState([]);

    const [inputData, setInputData] = useState('');

    const [selectedExample, setSelectedExample] = useState('')

    const [toolParams, setToolParams] = useState({})

    const [alertError, setAlertError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect(function() {
        var tmpTools = []
        for (var e in props.configs) {
            if (e == 'default') {
                console.log(props.configs[props.configs[e]])
                setToolParams(props.configs[props.configs[e]].parameters)
            } else {
                tmpTools.push(e)
            }
        }
        setTools(tmpTools)
    }, [props.configs])

    useEffect(function(){
        setToolParams(props.configs[props.selectedTool].parameters)
        setInputData('')
        setSelectedExample('')
    }, [props.selectedTool])


    const changeExample = function(selection) {
        setSelectedExample(selection.value)
        getExample(props.selectedTool, selection.value, setInputData);
    }

    const renderInputBox = function(type) {
        return (
            <textarea className={'inputBox'} value={inputData} onChange={e => setInputData(e.target.value)}></textarea>
        )
    }

    const gatherParams = function(tool) {
        var params = {}

        var unsetRequiredParams = []
        for (var p in props.configs[tool].parameters.required) {
            console.log(document.getElementById(p))
            var e = document.getElementsByName(p)
            console.log(e)
            if (e.length) {
                if (!e[0].value) {
                    unsetRequiredParams.push('- ' + props.configs[tool].parameters.required[p].label)
                }
                params[p] = e[0].value
            }
        }

        if (unsetRequiredParams.length > 0) {
            setErrorMessage('Required parameter \n' + unsetRequiredParams.join('\n') + '\nis not set')
            setAlertError(true)
        }

        for (var p in props.configs[tool].parameters.optional) {
            var e = document.getElementsByName(p)
            if (e.length) {
                if (e[0].value) {
                    params[p] = e[0].value
                }
            }
        }
        return params
    }


    const hasErrors = function() {
        if (!inputData) {
            setAlertError(true)
            setErrorMessage('Please input some source or select from examples')
        }

    }


    const onExecute = function() {

        if (hasErrors()) return

        var params = gatherParams(props.selectedTool)

        if (params === null) return

        uploadTextToServer(props.selectedTool, inputData, params, props.setData)
    }

    const renderExecuteButton = () => {

        if (alertError) {
            return (
              <Alert variant="warning" onClose={() => setAlertError(false)} dismissible>
                <Alert.Heading>Oops</Alert.Heading>
                <p style={{"white-space":"pre"}}>
                    {errorMessage}
                </p>
              </Alert>
            );
          }

        return <Button variant="outline-dark" onClick={onExecute}>Execute</Button>
    }


    return (
        <div className={'Uploader'}>
            <ToolParams toolParams={toolParams}></ToolParams>
            {renderExecuteButton()}
            <Dropdown 
                options={props.configs[props.selectedTool]? props.configs[props.selectedTool].exampleFiles : []} 
                value={selectedExample} 
                onChange={changeExample} 
                placeholder='select an example'
            />
            {renderInputBox()}
        </div>
    );
}

export default Uploader;