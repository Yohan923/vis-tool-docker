var fromDot = require('ngraph.fromdot')
var toDot =require('./todot')

function processDot(dot) {
    console.log(dot)
    var graph = fromDot(dot)

    var nodeId = 1;
    var edgeId = 1;

    graph.forEachNode(function (node){
        if (!node.data){
            node.data = {}
        } else if (typeof node.data !== 'object'){
            node.data = {'attr': node.data}
        }

        node.data['id'] = 'node' + nodeId

        nodeId +=1
    })

    graph.forEachLink(function (link){
        if (!link.data){
            link.data = {}
        } else if (typeof link.data !== 'object'){
            link.data = {'attr': link.data}
        }

        link.data['id'] = 'edge' + edgeId

        edgeId +=1
    })

    console.log(toDot(graph))

    return toDot(graph)
}

module.exports = processDot;