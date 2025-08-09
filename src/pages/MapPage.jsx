import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import AnimalMap from "../components/AnimalMap";


function MapPage() {

  return (
    <>
    <Header />
    <AnimalMap />
  </>
  );
}

export default MapPage;