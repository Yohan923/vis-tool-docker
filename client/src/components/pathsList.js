import { useEffect, useState } from 'react';
import { changePathColour } from '../utils/utils';
import { Subgraph } from './subgraph'
import Collapsible from 'react-collapsible';
import './pathsList.css'


function PathCheckBox(props) {
    const [checked, setChecked] = useState(false)
    var pathId = props.pathId

    useEffect(() => {
        setChecked(false)
    }, [props.pathId])


    return (
        <input className={'PathCheckBox'} checked={checked} type="checkbox" onChange={e => {
            if(e.target.checked){
                props.selectedPaths[pathId] = pathId
            } else {
                changePathColour(props.graphId, props.paths[pathId], 'black')
                if (props.selectedPaths[pathId]) delete props.selectedPaths[pathId]
            }
            setChecked(e.target.checked)
            props.setCheckBoxClicked(Math.random())
        }}>
            
        </input>
    )
}


export function PathsList(props) {

    const [selectedPaths, setSelectedPaths] = useState({});
    const [checkBoxClicked, setCheckBoxClicked] = useState()

    var paths = props.paths

    useEffect(() => {
        setSelectedPaths({})
    }, [props.paths])


    useEffect(() => {
        for (var pId in selectedPaths) {
            changePathColour(props.graphId, paths[pId], 'green')
        }
    }, [checkBoxClicked])


    return Object.keys(paths).map((id) => {
        return (
            <div className={'PathsListItem'}>
                <Collapsible lazyRender={true} trigger={paths[id].map((e) => {
                    if (!e.fromId) {
                        return '(' + e.id + ')'
                    } else {
                        return '->'
                    }
                })}>
                    <Subgraph path={paths[id]}></Subgraph>
                </Collapsible>
                <PathCheckBox 
                    graphId={props.graphId} 
                    paths={paths} pathId={id} 
                    selectedPaths={selectedPaths} 
                    setCheckBoxClicked={setCheckBoxClicked}
                />
            </div>
        )
    })
}