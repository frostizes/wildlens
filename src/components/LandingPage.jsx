import { useState } from 'react'
import background from '../assets/background.jpg'
import apple_store from '../assets/Download_on_the_App_Store_Badge.png'
import play_store from '../assets/Download_on_GooglePlay_Badge.png'
import viteLogo from '/vite.svg'
import reactLogo from '../assets/react.svg'

function LandingPage() {
    const [count, setCount] = useState(0)
    return (

        <>
            <div id="background-container">
                <img src={background} alt="background image" id="background-image" />
                <div id="floating-section-bg-picture">
                    <h2>Download it now !</h2>
                    <div class="store">
                        <a>
                            <img src={apple_store} className="logo" alt="Vite logo" />
                        </a>
                    </div>
                    <div class="store">
                        <a>
                            <img src={play_store} className="logo" alt="Vite logo" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage;
