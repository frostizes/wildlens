import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";


function RegisterPage() {

  return (
    <>
    <Header />
    <RegisterForm />
  </>
  );
}

export default RegisterPage;