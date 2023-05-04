var treeData = [pubs];

var circle_size = 18;
var reach_out = 100;
  
  // ************** Generate the tree diagram	 *****************
  var margin = {top: 60, right: 30, bottom: 60, left: 30}
  var width = 600 - margin.right - margin.left
  var height = 1000 - margin.top - margin.bottom;
  var duration = 2000;
  var nextId = 0;
  
  var svg = d3.select("#tree").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var tree = d3.layout.tree().size([width, height]);
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return proj(d); });
  
  var root = $.extend(treeData[0], {x0:width/2, y0:0});
  var nodes = tree.nodes(root)
  var maxDepth = d3.max(nodes, function(d) { return d.depth; })
  var spacing = height / maxDepth;
  
  update(root);
  
  function update(source) {
    // Compute positions of tree node and links
    var nodes = tree.nodes(root)
    var links = tree.links(nodes);
    
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * reach_out; });
    
    // Label nodes and links
    var allNodes = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = nextId++); });
    var allLinks = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
    
    // Add graphics to nodes and links
    addNodes(allNodes, prevPos(source));
    addLinks(allLinks, prevPos(source));
    
    // open nodes and links transition
    openNodes(allNodes);
    openLinks(allLinks);
    
    // colapse nodes and links transition
    closeNodes(allNodes, currPos(source));
    closeLinks(allLinks, currPos(source));
  
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      p = currPos(d);
      d.x0 = p.x;
      d.y0 = p.y;
    });
  }
  
  function addNodes(nodes, source) {
    // Enter any new nodes from the parent's previous position.
    var newNodes = nodes.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
        return translate(source); })
        .on("click", click);
  
    // Append circle into the node, starting radius=0
    newNodes.append("circle")
        .attr("r", 0)
        .style("fill", function(d) { 
        return d._children ? "lightsteelblue" : "#fff"; });
  
    // Append text into the node, starting opacity=0
    newNodes.append("text")
        .attr("y", function(d) {
            return d.children || d._children ? -36 : 36; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 0);
  }
  
  function addLinks(links, source) {
    // Enter any new links at the parent's previous position.
    links.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          return diagonal({source: source, target: source});
        });
  }
  
  function openNodes(nodes) {
    // Define node transition
    var nodeUpdate = nodes.transition().duration(duration);
      
    // Transition allNodes to new position
    nodeUpdate.attr("transform", function(d) { 
        return translate(currPos(d)); });
    
    // Fill circle if children are hidden
    nodeUpdate.select("circle")
      .style("fill", function(d) { 
        return d._children ? "lightsteelblue" : "#fff"; })
    
    // Transition node circles to radius=10
    nodeUpdate.select("circle")
        .attr("r",  circle_size);
  
    // Transition text to opacity=1
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
  }
  
  function openLinks(links) {
    // Transition links to their new position.
    links.transition()
        .duration(duration)
        .attr("d", diagonal);
  }
  
  function closeNodes(nodes, source) {
    // Define exiting node transitions
    var nodeExit = nodes.exit().transition().duration(duration);
    
    // Transition exiting nodes to the clicked source's position.
      nodeExit.attr("transform", function(d) { return translate(source); })
        .remove();
  
    // Transition exiting nodes radius to 0
    nodeExit.select("circle")
        .attr("r", 0);
  
    // Transition exiting nodes to text opacity to 0
    nodeExit.select("text")
        .style("fill-opacity", 0);
  }
  
  function closeLinks(links, source) {
    // Transition exiting nodes to the parent's new position.
    links.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
        return diagonal({source: source, target: source});
        })
        .remove();
  }
  
  function proj(d) {
    return [d.x, d.y];
  }
  
  function translate(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }
  
  function currPos(d) {
    return {x: d.x, y: d.y};
  }
  
  function prevPos(d) {
    return {x: d.x0, y: d.y0};
  }
  
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }