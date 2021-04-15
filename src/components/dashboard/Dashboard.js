import { useEffect, useState } from 'react'
import NavigationBar from './NavigationBar'
import DisplayRooms from  "./DisplayRooms"

import Logo from "../img/LogoSVG.svg"
import './Dashboard.scss'

export default function Dashboard() {

    const [windowWidth, setWindowWidth] = useState(null)

    useEffect(() => {

        const widthUpdate = () => { setWindowWidth(window.innerWidth) }
        window.addEventListener("resize", widthUpdate)

        return(()=> {
            window.removeEventListener("resize", widthUpdate)
        })
        
    }, [])



    return (
        <div className="Dashboard">
            <NavigationBar/>
            <div className="main">
                <div className="logo">
                    <img className="logoImage" alt="" src={Logo} />
                    <p className="logoName">Fox Vote</p>
                </div>
                {windowWidth >= 600                 
                    ? <div className="noneRooms">Create a new room in the tab on the left. Rauuu!</div>
                    : <div className="noneRooms">Create a new room in the lower tab. Rauuu!</div>
                }
                <DisplayRooms/>
            </div> 
        </div>
    )
}
