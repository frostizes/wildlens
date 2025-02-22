import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";


function LoginPage() {

  return (
    <>
    <Header />
    <LoginForm />
  </>
  );
}

export default LoginPage;