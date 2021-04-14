import React, { useEffect, useState } from 'react';
import { getExample, uploadTextToServer } from "../utils/requestHandlers";
import { ToolParams }  from "./toolParams";
import Dropdown from 'react-dropdown';
import Popup from 'reactjs-popup';
import 'react-dropdown/style.css';
import './uploader.css';


export function Uploader(props) {

    const [tools, setTools] = useState([]);

    const [inputData, setInputData] = useState('');

    const [selectedTool, setSelectedTool] = useState('')
    const [selectedExample, setSelectedExample] = useState('')

    const [toolParams, setToolParams] = useState({})

    const [alertError, setAlertError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect(function() {
        var tmpTools = []
        for (var e in props.configs) {
            if (e == 'default') {
                console.log(props.configs[props.configs[e]])
                setSelectedTool(props.configs[e])
                setToolParams(props.configs[props.configs[e]].parameters)
            } else {
                tmpTools.push(e)
            }
        }
        setTools(tmpTools)
    }, [props.configs])


    const changeTool = function(selection) {
        setSelectedTool(selection.value);
        setToolParams(props.configs[selection.value].parameters)
        setInputData('')
        setSelectedExample('')
    }

    const changeExample = function(selection) {
        setSelectedExample(selection.value)
        getExample(selectedTool, selection.value, setInputData);
    }

    const renderInputBox = function(type) {
        return (
            <textarea className={'inputBox'} value={inputData} onChange={e => setInputData(e.target.value)}></textarea>
        )
    }

    const gatherParams = function(tool) {
        var params = {}

        for (var p in props.configs[tool].parameters.required) {
            console.log(document.getElementById(p))
            var e = document.getElementsByName(p)
            console.log(e)
            if (e.length) {
                if (!e[0].value) {
                    setErrorMessage('Required parameter ' + props.configs[tool].parameters.required[p].label + ' is not set')
                    setAlertError(true)
                    return null
                }
                params[p] = e[0].value
            }
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


    const onExecute = function() {
        var params = gatherParams(selectedTool)

        if (params === null) return

        uploadTextToServer(selectedTool, inputData, params, props.setData)
    }


    return (
        <div className={'Uploader'}>
            <Dropdown options={tools} onChange={changeTool} value={props.configs.default}/>
            <ToolParams toolParams={toolParams}></ToolParams>
            <button className={'UploadButton'} onClick={onExecute}>Execute</button>
            <Dropdown 
                options={props.configs[selectedTool]? props.configs[selectedTool].exampleFiles : []} 
                value={selectedExample} 
                onChange={changeExample} 
                placeholder='select an example'
            />
            {renderInputBox()}
            <Popup open={alertError} closeOnDocumentClick onClose={e => setAlertError(false)}>
                        <div className="modal">
                        <a className="close" onClick={e => setAlertError(false)}>
                        </a>
                        {errorMessage}
                        </div>
            </Popup>
        </div>
    );
}

export default Uploader;