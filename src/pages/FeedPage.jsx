import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import Feed from "../components/FeedComponent";


function ProfilePage() {

  return (
    <>
    <Header />
    <Feed />
  </>
  );
}

export default ProfilePage;