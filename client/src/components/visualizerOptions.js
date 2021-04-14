import { Graphviz } from 'graphviz-react';
import { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import * as d3Graphviz from 'd3-graphviz';


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


export function VisualizerOptions(props) {

    const [showEdgeLabel, setShowEdgeLabel] = useState(true);
    const [showNodeLabel, setShowNodeLabel] = useState(true);

    useEffect(function() {
        d3.selectAll("title")
        .remove()

        d3.selectAll(".edge")
        .selectAll("text")
        .text(function(d){
            //console.log(d)
            return showEdgeLabel? d.children[0].text : '';
        })


        d3.selectAll(".node")
        .selectAll("text")
        .text(function(d){
            //console.log(d)
            return showNodeLabel? d.children[0].text : '';
        })

        
        //show node name (not label)
        d3.selectAll(".node")
        .append('text')
        .attr('x', function(d) {
            var nodeText = findNodeByProperty(d.children, 'tag', 'text')
            return showNodeLabel ? String(parseFloat(nodeText.center.x) - 12) : nodeText.center.x
        }) 
        .attr('y', function(d) {
            var nodeText = findNodeByProperty(d.children, 'tag', 'text')
            return showNodeLabel ? String(parseFloat(nodeText.center.y) - 12) : nodeText.center.y
        }) 
        .attr('font-size', function(d) {
            var nodeText = findNodeByProperty(d.children, 'tag', 'text')
            return nodeText['font-size']
        })
        .text(function(d){
            //console.log(d);
            return d.key
        })

    })


    return(
        <div>
            <button onClick={e => setShowEdgeLabel(!showEdgeLabel)}> Show Edge Label</button>
            <button onClick={e => setShowNodeLabel(!showNodeLabel)}> Show Node Label</button>
        </div>

    )
}