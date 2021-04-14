import * as d3 from "d3";


export function changeStrokeWidth(component, width) {
    d3.select(component)
    .attr('stroke-width', function(d){
        return width
    })
}

export function changePathColour(graphId, p, colour) {
    var graph = d3.select('#' + graphId)
    for (var e of p) {
        var id = e.data.id
        graph.selectAll('#' + id)
        .selectAll('ellipse, polygon, path')
        .attr('stroke', function(d) {
            d.attributes.stroke = colour
            return colour
        })
    }
}

export function fillNode(node, colour){
    d3.select(node)
    .select('ellipse')
    .attr('fill', function(d){
        d.attributes.fill = colour
        return colour
    })
}