import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import Taxonomy from "../components/Taxonomy";
import AnimalDetails from "../components/AnimalDetails";


function ProfilePage() {

  return (
    <>
    <Header />
    <AnimalDetails />
  </>
  );
}

export default ProfilePage;