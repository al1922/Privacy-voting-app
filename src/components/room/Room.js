import {useRef, useState, useEffect} from 'react'
import { database } from '../../firebase'
import { useHistory, Link } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import {HiChevronDoubleLeft} from  "react-icons/hi"

import DisplayUsers from './DisplayUsers'
import Invitation from './Invitation'
import AddVote from './AddVote'
import Voting from './Voting'

import bigInt from "big-integer"
import {Form} from 'react-bootstrap'
import Button from "../form_components/Button"

import './Room.scss'
import Logo from "../img/LogoSVG.svg"


export default function Room({match}) {

    const [existId, setExistId] = useState(false)
    const history = useHistory()

    const { currentUser } = useAuth()
    const valueRef = useRef(null)
    const roomId = match.params.id  

    useEffect(() => {
        database.ref(`rooms/${roomId}/public/access/${currentUser.uid}`).on("value" ,snapshot => {
            snapshot.exists() ? setExistId(true): setExistId(false)
        })
        
        return () => {
            setExistId(false)
            database.ref('rooms').off()
        }
    }, [roomId,currentUser.uid])

    const [publicKey, setPublicKey] = useState(null)


    async function EncryptData(number){

        let g = bigInt()
        let n = bigInt()

        await database.ref(`rooms/${roomId}/public/publicKey`).get().then(function(keySnapShot){
            g =  bigInt(keySnapShot.val().g)
            n =  bigInt(keySnapShot.val().n)
        })

        let n2 = n.pow(2)
        let r = bigInt.randBetween(1, n-1)

        return g.modPow(number, n2).multiply(r.modPow(n, n2)).mod(n2)
    }

    async function DecryptData(number){

        let alpha = bigInt()
        let mu = bigInt()
        let n = bigInt()

        await database.ref(`rooms/${roomId}/private/privateKey`).get().then(function(keySnapShot){
            alpha =  bigInt(keySnapShot.val().alpha)
            mu =  bigInt(keySnapShot.val().mu)
            n =  bigInt(keySnapShot.val().n)
        })

        let n2 = n.pow(2)


        return  number.modPow(alpha, n2).minus(1).divide(n).multiply(mu).mod(n)
    }

    async function EncryptSum(fisrtEncryptedNumer, secondEncryptedNumer){


        let n = bigInt()

        await database.ref(`rooms/${roomId}/public/publicKey`).get().then(function(keySnapShot){
            n =  bigInt(keySnapShot.val().n)
        })

        let n2 = n.pow(2)

        return bigInt(fisrtEncryptedNumer).multiply(secondEncryptedNumer).mod(n2)
    }

    async function handleEncrypt(e){
        e.preventDefault()
        try{
            const num = bigInt(valueRef.current.value)
            const encryptedNumber1 = await EncryptData(num)
            const encryptedNumber2 = await EncryptData(num)
            const sumEncryp = await EncryptSum(encryptedNumber1, encryptedNumber2)
            const decryptNumber = await DecryptData(sumEncryp)
            console.log(decryptNumber)
        }
        catch(err){console.log(err.message)}
    }

    function handleBackToDashboard(){
        history.push("/")
    }

    return (
        <>
        {existId 

            ?<div className="Room">
                 <div className="NavigationBar-Room">
                    <nav className="navigation">
                        <div className="navigation-box">
                            <Invitation roomId={roomId}/>
                            <AddVote roomId={roomId}/>
                            <DisplayUsers roomId={roomId}/> 
                            <div className="navigation-link" onClick={handleBackToDashboard} >
                                <HiChevronDoubleLeft className="logo"/>
                                <span className="link-text" >Back to dashboard</span>
                            </div>
                        </div>
                    </nav>

                    <div className="main">
                        <div className="logo">
                            <img className="logoImage" alt="" src={Logo} />
                            <p className="logoName">Fox Vote</p>
                        </div>
                                     
                        <div className="noneRooms">Vote on your issues while maintaining your privacy. Rauuu!</div>
                        
                        <Voting roomId={roomId}/>
                    </div> 
                    
                </div>

                {/* <Form onSubmit={handleEncrypt}>
                        <Form.Group className="mt-4" id="text">
                            <Form.Control type="number" placeholder="number" ref={valueRef} required /> 
                        </Form.Group>
                        <Button name="Send" disabled={loading} type="submit"></Button>
                </Form> */}

            </div>
        
            :<div className="RoomNoExist">
                <div className="logo">
                    <img className="logoImage" alt="" src={Logo} />
                    <p className="logoName">Fox Vote</p>
                </div>
                <span className="room-text">The room with the given ID {roomId} does not exist. Rauuuu! </span>
                <Link to="/" className="room-link">Back to dashboard.</Link>
            </div>
        }
        </>
    )

 
} 
