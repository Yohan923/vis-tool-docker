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
import { Col, Container, Row, Table } from 'react-bootstrap';

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

    const [showEdgeLabel, setShowEdgeLabel] = useState(false);
    const [showNodeLabel, setShowNodeLabel] = useState(false);
    const [graphDrawn, setGraphDrawn] = useState();

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
        .zoomScaleExtent([0.1, 1000])
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
            if (d3.event.shiftKey) {
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

        return (
            <Table responsive>
                <tbody>
                    {componentDataArray.map((d) => {
                        return (
                            <tr >
                                <td>{d[0]}</td>
                                <td>{typeof d[1] === 'string'? d[1].replaceAll('\\n', '\n') : d[1]}</td>
                            </tr>
                        );
                        })
                    }
                </tbody>
            </Table>
        )
    }
    

    return(
            <Container fluid>
                <Row>
                    <Col id={'graph'} xs={8}>
                        <div className={'Graph'}>
                            <div >
                                {sourceNode && dstNode? <button onClick={e => handleFindAllPathBetween(graph, sourceNode, dstNode)}>Find All Path</button> : ''}
                            </div>
                            <div className={'Canvas'} id={id}/>
                        </div>
                    </Col>
                    <Col id={'graphInfo'}>
                        <div className={'InfoTableContainer'}>
                            <div style={{paddingLeft:10, fontWeight: 'bold'}}>
                                Component info:
                            </div>
                            {selectedComponent? renderComponentData(selectedComponent) : (<div style={{paddingLeft:10}}>Left click on a node or edge to display its info</div>)}
                        </div>
                        <div className={'GraphOptions'}>
                            <button onClick={e => setShowEdgeLabel(!showEdgeLabel)}> { !showEdgeLabel? 'Show Edge Label':'Hide Edge Label'}</button>
                            <button onClick={e => setShowNodeLabel(!showNodeLabel)}> { !showNodeLabel? 'Show Node Label':'Hide Node Label'}</button>
                        </div>
                        <div className={'PathsListContainer'}>
                            <PathsList graphId={id} paths={pathBetweenNodes}></PathsList>
                        </div>
                    </Col>
                </Row>
            </Container>
    )
}