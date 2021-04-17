import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Collapsible from 'react-collapsible';
import Popup from 'reactjs-popup';
import _uniqueId from 'lodash/uniqueId';
import { isEmptyObject } from '../utils/utils';

import { ParamSelection } from './paramSelection'

import './toolParams.css'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


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

    const renderParams = function(params, trigger) {
        if (!params) return []
        console.log(params)
        return (
            <Collapsible overflowWhenOpen={'visible'} trigger={trigger}>
                {Object.keys(params).map((p) => {
                    return (
                        <div className={'Param'}>
                            <OverlayTrigger
                                placement={'bottom'}
                                overlay={
                                    <Tooltip>
                                        {params[p].info}
                                    </Tooltip>
                                }
                            >
                                <label className={'ParamLabel'}>{params[p].label}</label>
                            </OverlayTrigger>
                            {renderSelections(p, params[p])}
                        </div>
                    )})
                }
            </Collapsible>
        )

    }
  
    return (
        <div className={'ToolParams'}>
            {props.toolParams.required && !isEmptyObject(props.toolParams.required)? renderParams(props.toolParams.required, 'Required Parameters') : ''}
            {props.toolParams.optional && !isEmptyObject(props.toolParams.optional)? renderParams(props.toolParams.optional, 'Optional Parameters') : ''}
        </div>
    );
  }