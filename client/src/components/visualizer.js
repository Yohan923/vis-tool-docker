import { useEffect, useRef, useState } from 'react';
import { Graphviz } from 'graphviz-react';
import * as d3 from "d3";
import * as d3Graphviz from 'd3-graphviz';
import Popup from 'reactjs-popup';
import _uniqueId from 'lodash/uniqueId';
import { v4 as uuidv4 } from 'uuid';
import { changeStrokeWidth, changePathColour, fillNode } from '../utils/utils';
import { PathsList } from "./pathsList";
import './visualizer.css'

var fromDot = require('ngraph.fromdot');


function findNodeByProperty(nodes, prop, val) {
    for (const element of nodes) {
        if (element[prop] === val){
            return element
        } else{
            var result = findNodeByProperty(element.children, prop, val)
            if (result != null) {
                return result
            }
        }
    };
    
    return null
}


function findAllPathBetween(g, a, b, visited, prevPath, paths) {
    var node = g.getNode(a)

    if (!visited[node.id]) visited[node.id] = 1
    else if (visited[node.id] > 1) return
    else visited[node.id] += 1

    g.forEachLinkedNode(a, function(linkedNode, link) {
        var curPath = [...prevPath]
        curPath.push(node)

        if (linkedNode.id == b) {
            curPath.push(link)
            curPath.push(linkedNode)
            paths[uuidv4()] = curPath
        } else{
            curPath.push(link)
            findAllPathBetween(g, linkedNode.id, b, {...visited}, curPath, paths)
        }
    },
    true
    )
}


export function Visualizer(props) {
    const id = _uniqueId('graph')
    const [nodeNotSelectedMessage, setNodeNotSelectedMessage] = useState('');

    const [showEdgeLabel, setShowEdgeLabel] = useState(false);
    const [showNodeLabel, setShowNodeLabel] = useState(false);
    const [graphDrawn, setGraphDrawn] = useState();
    const [alertNodeNotSelected, setAlertNodeNotSelected] = useState(false);

    const [graph, setGraph] = useState();

    const [selectedComponent, setSelectedComponent] = useState(null);
    const [sourceNode, setSourceNode] = useState(null);
    const [dstNode, setDstNode] = useState(null);
    const [pathBetweenNodes, setPath] = useState({});


    function initStates() {
        setShowEdgeLabel(false)
        setShowNodeLabel(false)
        setSelectedComponent(null)
        setSourceNode(null)
        setDstNode(null)
        setPath({})
    }


    function handleFindAllPathBetween(g, sourceNode, dstNode) {

        if (!sourceNode) {
            setNodeNotSelectedMessage('source node not selected, left click on a node to select source node')
            setAlertNodeNotSelected(true)
            return
        }else if (!dstNode) {
            setNodeNotSelectedMessage('destination node not selected, ctrl+left click on a node to select destination node')
            setAlertNodeNotSelected(true)
            return
        }

        var paths = {}
        findAllPathBetween(g, sourceNode.__data__.key, dstNode.__data__.key, {}, [], paths)
        
        for (var p in pathBetweenNodes) {
            changePathColour(id, pathBetweenNodes[p], 'black')
        }

        setPath(paths)
        return paths
    }

    useEffect(function() {
        d3.select("#" + id)
        .select('.graph')
        .remove()

        initStates()

        var data = props.graphData

        var g = fromDot(data)
        setGraph(g)

        d3.select("#" + id)
        .graphviz()
        .zoom(true)
        .transition(() => d3.transition().duration(1000))
        .attributer(function(d) {
            if (d.tag == "ellipse") {
                d.attributes.fill = "transparent";
            }
        })
        .on('end', function(){
            setGraphDrawn(Math.random())
        })
        .renderDot(data);
        
    }, [props.graphData])


    useEffect(function(){

        var graph = d3.select('#' + id)

        graph.selectAll(".edge")
        .on('click', function(d){
            changeStrokeWidth(selectedComponent, 1)
            setSelectedComponent(this)
            changeStrokeWidth(this, 2)
        })
        .on('mouseover', function(d){
            if (this != selectedComponent) { 
                changeStrokeWidth(this, 3)
            }
        })
        .on('mouseleave', function(d){
            if (this != selectedComponent) { 
                changeStrokeWidth(this, 1)
            }
        })
        .selectAll("text")
        .text(function(d){
            //console.log(d)
            return showEdgeLabel? d.children[0].text : '';
        })


        graph.selectAll(".node")
        .on('click', function(d){
            if (d3.event.ctrlKey) {
                fillNode(dstNode, 'transparent')
                setDstNode(this == dstNode? null : this)
            } else {
                fillNode(sourceNode, 'transparent')
                setSourceNode(this == sourceNode? null : this)
            }
            
            changeStrokeWidth(selectedComponent, 1)
            setSelectedComponent(this)
            changeStrokeWidth(this, 2)

            console.log(dstNode ? dstNode.__data__.key : null)
            console.log(sourceNode ? sourceNode.__data__.key : null)
            console.log(selectedComponent ? selectedComponent.__data__.key : null)
        })
        .on('mouseover', function(d){
            if (this != selectedComponent) { 
                changeStrokeWidth(this, 3)
            }
        })
        .on('mouseleave', function(d){
            if (this != selectedComponent) { 
                changeStrokeWidth(this, 1)
            }
        })
        .selectAll("text")
        .attr('pointer-events', 'none')
        .text(function(d){
            return d.tag == 'text' && showNodeLabel?  d.children[0].text : '';
        })

        
        //show node name (not label)
        graph.selectAll('.node')
        .each(function(d){
            var text = d.key
            d3.select(this)
            .selectWithoutDataPropagation('text')
            .text(function(d){
                return showNodeLabel? d.children[0].text : text
            })

        })

        fillNode(sourceNode, 'yellow')
        fillNode(dstNode, 'red')

    }, [graphDrawn, showEdgeLabel, showNodeLabel, selectedComponent, sourceNode, dstNode, pathBetweenNodes])

    const renderComponentData = (data) => {

        var selectedComponentData = {};
        
        if (data && data.__data__.attributes.class == 'node') {
            selectedComponentData = graph.getNode(data.__data__.key).data
        } else if (data && data.__data__.attributes.class == 'edge') {
            console.log(data.__data__)
            console.log(data.__data__.key.split('->')[0])
            var potentialLinks = graph.getLinks(data.__data__.key.split('->')[0])
            for (var l of potentialLinks) {
                console.log(l)
                if (l.data['id'] === data.__data__.attributes.id) {
                    console.log(l)
                    selectedComponentData = l.data
                }
            }
        }

        console.log(selectedComponentData)

        var componentDataArray = Object.keys(selectedComponentData).map((key) => [key, selectedComponentData[key]]);

        return componentDataArray.map((d) => {
            return (
                <tr >
                    <td>{d[0]}</td>
                    <td>{typeof d[1] === 'string'? d[1].replaceAll('\\n', '\n') : d[1]}</td>
                </tr>
            );
            })
    }
    

    return(
        <div className={'Visualizer'}>
            <div className={'Graph'}>
                <div className={'InfoTableContainer'}>
                    <table className={'InfoTable'}>
                        {renderComponentData(selectedComponent)}
                    </table>
                </div>
                <div className={'GraphOptions'}>
                    <button onClick={e => handleFindAllPathBetween(graph, sourceNode, dstNode)}>Find All Path</button>
                    <button onClick={e => setShowEdgeLabel(!showEdgeLabel)}> Show Edge Label</button>
                    <button onClick={e => setShowNodeLabel(!showNodeLabel)}> Show Node Label</button>
                    <Popup open={alertNodeNotSelected} closeOnDocumentClick onClose={e => setAlertNodeNotSelected(false)}>
                        <div className="modal">
                        <a className="close" onClick={e => setAlertNodeNotSelected(false)}>
                        </a>
                        {nodeNotSelectedMessage}
                        </div>
                    </Popup>
                </div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                    <text>{'Source node: ' + (sourceNode? sourceNode.__data__.key : '')}</text>
                    <text>{'Destination node: ' + (dstNode? dstNode.__data__.key : '')}</text>
                </div>
                <div className={'Canvas'} id={id}/>
            </div>
            <div className={'PathsListContainer'}>
                <PathsList graphId={id} paths={pathBetweenNodes}></PathsList>
            </div>
        </div>
    )
}