import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import DisplaySearchOutput from "../components/SearchOutput";
import ProfileCommonComponent from "../components/ProfileCommonComponent";
import UserPictureComponent from "../components/UserPictureComponent";



function ProfilePage() {

  return (
    <>
    <Header/>
    <ProfileCommonComponent />
    <UserPictureComponent />
    </>
  );
}

export default ProfilePage;