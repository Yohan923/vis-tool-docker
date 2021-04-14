import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Collapsible from 'react-collapsible';
import CreatableSelect from 'react-select/creatable';
import Popup from 'reactjs-popup';
import _uniqueId from 'lodash/uniqueId';
import Select from 'react-select';

import { ParamSelection } from './paramSelection'

import './toolParams.css'


const parsePresets = function(presets) {
    if (!presets) return null

    return presets.map((d) => {
        return {'value': d, 'label': d}
    })
}

export function ToolParams(props) {

    const renderSelections = function(key, param) {
    
        return <ParamSelection 
                    key={key}
                    pName={key}
                    defaultValue={parsePresets([param.default])} 
                    options={parsePresets(param.presets)} 
                    allowUserInput={param.allowUserInput}
                />
    }

    const renderParams = function(params) {
        if (!params) return []
        return Object.keys(params).map((p) => {
            return (
                <div className={'Param'}>
                    <label className={'ParamLabel'}>
                        {params[p].label}
                    </label>
                    {renderSelections(p, params[p])}
                </div>
            )
        })
    }
  
    return (
        <div className={'ToolParams'}>
            {renderParams(props.toolParams.required)}
            <Collapsible overflowWhenOpen={'visible'} trigger={'Optional Parameters'}>
                {renderParams(props.toolParams.optional)}
            </Collapsible>
        </div>
    );
  }