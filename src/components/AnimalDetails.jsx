import { useState } from 'react'
import background from '../assets/background.jpg'
import apple_store from '../assets/Download_on_the_App_Store_Badge.png'
import panda from '../assets/panda.jpg'
import viteLogo from '/vite.svg'

function AnimalDetails() {
  return (
    <div id="background-container">
      <img src={panda} alt="background image" id="background-image"/>
    </div>
  )
}

export default AnimalDetails;
