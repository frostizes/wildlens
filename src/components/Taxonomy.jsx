import { useState, useEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';

let currentDepth = 0;
let currentlySelectedNode = "Mammals";
let currentParentHierarchy = [];
let parentHierarchy = ["orderName","familyName","genusName"];
let data = [];

function Taxonomy() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const response = await axios.get("https://localhost:54125/Catalog/GetTaxonomyTreeSummary");
        data = response.data;
        const formattedTree = buildHierarchy();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTaxonomy();
  }, []); // Runs only once when the component mounts

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  const handleNodeClick = (clickedNode) => {
    // Rebuild the hierarchy with the clicked node as the root
    const newTree = buildHierarchy(data, clickedNode.name);
  };

  return (
    <div className="container text-center mt-4">
      <TreeVisualization data={data} onNodeClick={handleNodeClick}/>
    </div>
  );
}

function buildHierarchy(selectedNode = "Mammals") {
  if(selectedNode == currentlySelectedNode && currentlySelectedNode != "Mammals"){
    currentDepth--;
    currentParentHierarchy.pop(currentlySelectedNode); // Navigating deeper into the hierarchy

  }
  else if(selectedNode != "Mammals"){
    currentDepth++;
    currentParentHierarchy.push(currentlySelectedNode); // Navigating deeper into the hierarchy

  }
  currentlySelectedNode = selectedNode
  const tree = { name: selectedNode, children: [] };

  // Add only the first level of children (direct children of "Life")
  data.forEach(({ orderName, englishName, speciesName }) => {
    // Create an order node (only if not already created)
    let orderNode = tree.children.find(o => o.name === parentHierarchy[currentDepth]);
    if (!orderNode) {
      orderNode = { name: orderName, children: [] };
      tree.children.push(orderNode);
    }

    // Add species as children of the order (no deeper nesting)
    //orderNode.children.push({ name: `${englishName} (${speciesName})` });
  });

  return tree;
}

function TreeVisualization({ data }) {
  useEffect(() => {
    const width = 1000, height = 1000;
    const svg = d3.select("#taxonomyTree").attr("width", width).attr("height", height);

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([2 * Math.PI, 300]);
    treeLayout(root);

    const g = svg.append('g').attr('transform', 'translate(400,400)');

    g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkRadial().angle(d => d.x).radius(d => d.y))
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', '2px');

    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

    nodes.append('circle')
      .attr('r', 50)
      .style('fill', d => (d.children ? '#1f77b4' : '#ff7f0e'))
      .style('stroke', '#fff')
      .style('stroke-width', '3px')
      .style('cursor', 'pointer')
      .on('click', (event, d) => buildHierarchy(d.data.name));

    nodes.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .attr('transform', d => {
        // Calculate the angle in degrees (convert radians to degrees)
        const angle = (d.x * 180 / Math.PI) - 90; // d.x is in radians, so convert to degrees
        if(angle < 0){ // Add 180 degrees to the angle if it's negative (for the opposite direction)^
          return `rotate(${Math.abs(angle)})`;
        }
        else{
          return `rotate(-${angle})`; // Apply the inverse of the angle to rotate text correctly for the user
        }
      })
      .text(d => d.data.name);
  }, [data]);

  return <svg id="taxonomyTree"></svg>;
}

export default Taxonomy;
