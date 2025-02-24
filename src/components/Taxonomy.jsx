import { useState, useEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';

// Global variable
let allData = [];
let currentDepth = 0;
let currentlySelectedNode = "Mammals";
let currentParentHierarchy = [];
let parentHierarchy = ["orderName","familyName","genusName"];

function Taxonomy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  currentParentHierarchy.push("Mammals");
  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const response = await axios.get("https://localhost:54125/Catalog/GetTaxonomyTreeSummary");
        allData = response.data;
        const formattedTree = buildHierarchy();
        setData(formattedTree);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTaxonomy();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  const handleNodeClick = (clickedNode) => {
    // Modify global variable
    console.log("clicked node:", clickedNode);
    const newTree = buildHierarchy(clickedNode.name);
    setData(newTree);
  };

  return (
    <div className="container text-center mt-4">
      <TreeVisualization data={data} onNodeClick={handleNodeClick}/>
    </div>
  );
}

function buildHierarchy(selectedNode = "Mammals") {
  const tree = { name: selectedNode, children: [] };
  if(selectedNode == currentlySelectedNode && currentlySelectedNode != "Mammals"){
    currentDepth--;
    tree.name = currentParentHierarchy.pop(currentlySelectedNode);

  }
  else if(selectedNode != "Mammals"){
    currentDepth++;
    currentParentHierarchy.push(currentlySelectedNode); // Navigating deeper into the hierarchy

  }
  currentlySelectedNode = selectedNode
  allData.forEach(({ orderName, familyName, genusName }) => {
    if(currentDepth == 1 && orderName != selectedNode){
      return;
    }
    if(currentDepth == 2 && familyName != selectedNode){
      return;
    }
    if(currentDepth == 3 && genusName != selectedNode){
      return;
    }
    var hierarchyLevels = [orderName, familyName, genusName];
    var currentHierarchy = hierarchyLevels[currentDepth];
    let orderNode = tree.children.find(o => o.name === currentHierarchy);
    if (!orderNode) {
      orderNode = { name: currentHierarchy, children: [] };
      tree.children.push(orderNode);
    }
  });
  return tree;
}

function TreeVisualization({ data, onNodeClick }) {
  useEffect(() => {
    const width = 1000, height = 1000;
    const svg = d3.select("#taxonomyTree").attr("width", width).attr("height", height);
    d3.select("#taxonomyTree").selectAll("*").remove();
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
      .on('click', (event, d) => onNodeClick(d.data));

    nodes.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .attr('transform', d => {
        const angle = (d.x * 180 / Math.PI) - 90;
        return angle < 0 ? `rotate(${Math.abs(angle)})` : `rotate(-${angle})`;
      })
      .text(d => d.data.name);
  }, [data, onNodeClick]);

  return <svg id="taxonomyTree"></svg>;
}

export default Taxonomy;
