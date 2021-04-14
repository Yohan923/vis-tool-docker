import CreatableSelect from 'react-select/creatable';
import Popup from 'reactjs-popup';
import _uniqueId from 'lodash/uniqueId';
import Select from 'react-select';
import { useEffect, useState } from 'react';


const parsePresets = function(presets) {
    if (!presets) return null

    return presets.map((d) => {
        return {'value': d, 'label': d}
    })
}


export function ParamSelection(props) {

    const [pName, setPName] = useState(props.pName);
    const [defaultValue, setDefaultValue] = useState(props.defaultValue);
    const [options, setOptions] = useState(props.options)
    const [allowUserInput, setAllowUserInput] = useState(props.allowUserInput)



    const renderSelections = function() {

        if (allowUserInput) {
            return (
                <CreatableSelect
                    className="ParamInput"
                    name={pName}
                    defaultValue={defaultValue}
                    isClearable
                    options={options}
                />
            )
        } else {
            return (
                <Select
                    className="ParamInput"
                    name={pName}
                    defaultValue={defaultValue}
                    isClearable={true}
                    options={options}
                />
            )
        }
    }

    return (
        renderSelections()
    )
}