import {useState,useEffect} from 'react'
import {Form, Modal} from 'react-bootstrap'
import { useNotification } from "../../contexts/NotificationContext"
import { database } from '../../firebase'
import { useAuth } from "../../contexts/AuthContext"


import {EncryptData} from './Encryption'
import './ResultOfVote.scss'

export default function ResultOfVote({props, roomId, publicKey, questionId}) {

    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()
    const [loading, setLoading] = useState(false)
    const [privateKey, setPrivateKey] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const { currentUser } = useAuth()
    const [choises] = useState(props.choises)

    const [choisesValue, setChoisesValue] = useState('0')
    const changeChoise = (key) => setChoisesValue(key)

    useEffect(() => {
        database.ref(`rooms/${roomId}/private/read/admin`).get().then(() => {
            database.ref(`rooms/${roomId}/private/privateKey`).get().then(function(keySnapShot){
                setPrivateKey(keySnapShot.val())
                setIsAdmin(true)
            }).catch(() => {
                setPrivateKey('')
            })
        }).catch(() => {
            setIsAdmin(false)
            setPrivateKey('')
        })

        return(()=>{
            setPrivateKey('')
            setIsAdmin(false)
        })
        
    }, [roomId])


    return (
        props.status === 'Completed' 
        ? <span>OKOK</span>
        : isAdmin ?
            <div className="result-adminPanel">
                <button className="adminPanel-button" disabled={loading} type="submit">Finish and recount the votes</button>
            </div>
        : <div className="result-notCompleted">
            <h4>Voting is still <span className="font-weight-bold">{props.status}</span>.</h4>
            <h6>Wait for the voting to end.</h6>
        </div>

    )
}
