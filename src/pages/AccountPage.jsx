import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import Taxonomy from "../components/Taxonomy";


function AccountPage() {

  return (
    <>
    <Header />
    <Body />
    </>
  );
}

export default AccountPage;