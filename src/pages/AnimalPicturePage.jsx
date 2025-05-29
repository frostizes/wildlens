import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import Taxonomy from "../components/Taxonomy";
import AnimalPictures from "../components/AnimalPictures";


function ProfilePage() {

  return (
    <>
    <Header />
    <AnimalPictures />
  </>
  );
}

export default ProfilePage;