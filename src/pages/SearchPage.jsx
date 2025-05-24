import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import DisplaySearchOutput from "../components/SearchOutput";


function SearchPage() {

  return (
    <>
    <Header />
    <DisplaySearchOutput />
    </>
  );
}

export default SearchPage;