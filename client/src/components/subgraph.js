import { Graphviz } from 'graphviz-react';
import { useEffect, useState } from "react"
import _uniqueId from 'lodash/uniqueId';
import * as d3 from "d3";
import * as d3Graphviz from 'd3-graphviz';

var createGraph = require('ngraph.graph');
var toDot = require('./todot')

function renderDot(dot, id) {
    d3.select('#' + id)
    .graphviz()
    .transition(() => d3.transition().duration(100))
    .renderDot(dot)
}


export function Subgraph(props) {
    var path = props.path
    const id = _uniqueId('subgraph')
    const [dot, setDot] = useState('digraph{}')

    useEffect(() => {
        var g = createGraph({'multigraph': true});

        for (var e of path) {
            if (e.fromId){
                g.addLink(e.fromId, e.toId, e.data)
            } else {
                g.addNode(e.id, e.data)
            }
        }
        console.log('dot=' + toDot(g))
        setDot(toDot(g))
        renderDot(dot, id)
    })


    return(
        <div id={id}></div>
    )
}