import {useState,useEffect} from 'react'
import {Form, Modal} from 'react-bootstrap'
import { useNotification } from "../../contexts/NotificationContext"
import { database } from '../../firebase'
import { useAuth } from "../../contexts/AuthContext"
import bigInt from "big-integer"

import {DecryptData, EncryptSum} from './Encryption'
import './ResultOfVote.scss'

export default function ResultOfVote({props, roomId, publicKey, questionId}) {

    const { setError, setSuccess} = useNotification()
    const [loading, setLoading] = useState(false)
    const [privateKey, setPrivateKey] = useState('')
    const [votedUsers, setVotedUsers] = useState(undefined)
    const [isAdmin, setIsAdmin] = useState(false)
    const [voteSorce, setVoteSorce] = useState(0)

    const { currentUser } = useAuth()
    const [choises] = useState(props.choises)


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

    //Voted users
    useEffect(() => {

        database.ref(`rooms/${roomId}/public/online`).on("value", (onlineSnapShot) => {
            if(props.answers !== undefined){
                let answerUsers = []
                Object.keys(props.answers).map(key => {
                    answerUsers = [...answerUsers, atob(onlineSnapShot.val()[key].nickName)]
                })
                setVotedUsers(answerUsers)
            }
        })

    }, [roomId])

    const calculateVoting = async () => { 

        await database.ref(`rooms/${roomId}/public/vote/${questionId}/answers`).get().then((answersSnapShot) =>{
            if(answersSnapShot.exists()){
                let score = bigInt()
                Object.values(answersSnapShot.val()).map((val, index) => {
                    if(!index){
                        score = bigInt(val.answer)
                    }
                    else{
                        score =  EncryptSum(score, val.answer, privateKey)
                    }
                    return score
                })

                const scoreString = '00'.concat(DecryptData(score, privateKey).toString())
                let scoreStringTemp = scoreString
                
                var scoreJson = []
                let id = 0;

                for( let j = 0; j < (choises.length*3 - scoreString.length)/3; j++){
                    scoreStringTemp = '000'.concat(scoreStringTemp)
                }

                for (let i = choises.length*3; i >0; i = i-3){
                    id++
                    scoreJson.push([id,scoreStringTemp.slice(i-3, i)])
                }

                database.ref(`rooms/${roomId}/public/vote/${questionId}/score`).set(JSON.parse(JSON.stringify(scoreJson)))
                database.ref(`rooms/${roomId}/public/vote/${questionId}`).update({status:'Completed'})

            }
            else{
                throw new Error('No responses sent');
            }
        }).catch((err) => {setError(err.message)})

    }

    async function handleFinishVote(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            await calculateVoting()
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            setError(err.message)
        }

    }


    return (
        props.status === 'Completed' 
        ? <span>OKOK</span>
        : isAdmin ?
            <div className="result-adminPanel">
                {votedUsers === undefined 
                ? <h4 className="text-center">No users have cast a vote.</h4> 
                : <div className="adminPanel-users">  
                    <h4 className="m-3">Users who have voted.</h4>
                    <ul>
                        {votedUsers.map((key) => <li key={key}><h5>{key}</h5></li>)}
                    </ul>
                </div>}
                <button className="adminPanel-button" disabled={loading} onClick={handleFinishVote} ype="submit">Finish and recount the votes</button>
            </div>
        : <div className="result-notCompleted">
            <h4>Voting is still <span className="font-weight-bold">{props.status}</span>.</h4>
            <h6>Wait for the voting to end.</h6>
        </div>

    )
}
