import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';
import AnimalModal from "./AnimalDetails";
import Button from 'react-bootstrap/Button';



//parent, count, name, isleaf
// Global variable
let allData = [];
let currentParentNode = [];

function Taxonomy() {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Initialize navigation
  // const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);


  // useEffect(() => {
  //   async function fetchTaxonomy() {
  //     try {
  //       const response = await axios.get(API_BASE_URL + "/Catalog/GetTaxonomyTreeSummary");
  //       allData = response.data;
  //       currentParentNode = ["Mammals"];
  //       const formattedTree = buildHierarchy(navigate);
  //       setData(formattedTree);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchTaxonomy();
  // }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;


  // const handleNodeClick = (clickedNode) => {
  //   // Modify global variable
  //   const newTree = buildHierarchy(navigate, clickedNode.name);
  //   setData(newTree);
  // };

  // return (
  //   <div className="container text-center mt-4">
  //     <TreeVisualization data={data} onNodeClick={handleNodeClick}/>
  //     <CustomModal show={showModal} onClose={handleCloseModal} />
  //   </div>
  // );
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View Animal Details
      </Button>

      <AnimalModal 
        show={show} 
        handleClose={handleClose} 
      />
    </>
  );
} 

function buildHierarchy(navigate,selectedNode = "Mammals") {
  //zoom out 
  if(selectedNode === currentParentNode[currentParentNode.length - 1] && selectedNode !== "Mammals"){
    currentParentNode.pop();
    selectedNode = currentParentNode[currentParentNode.length - 1];
  }
  else if(selectedNode !== "Mammals"){
    if(currentParentNode.length === 4){
      const tree = { name: "Mammals", children: [] };
      currentParentNode = ["Mammals"];
      handleShowModal(); // Trigger modal display when the condition is met
      return tree;
    }
    else{
      currentParentNode.push(selectedNode);
    }
  }
  const tree = { name: selectedNode, children: [] };
  allData.forEach(({ name, parent }) => {
    if(parent == selectedNode){
      let orderNode = tree.children.find(o => o.name === name);
      if (!orderNode) {
        orderNode = { name: name, children: [] };
        tree.children.push(orderNode);
      } 
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
