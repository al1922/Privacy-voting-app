import {useState, useEffect} from 'react'
import { database } from '../../firebase'
import { useAuth } from "../../contexts/AuthContext"

export default function Voting({roomId}) {

    const [votingQuestions, setVotingQuestions] = useState(null)


    useEffect(() => {
        
        database.ref(`rooms/${roomId}/public/vote`).on("value", (voteSnapShot) => {
            setVotingQuestions(voteSnapShot.val())
        })
        

        return () => {
            database.ref(`rooms/${roomId}/vote`).off()
        }

    }, [roomId])


    return (
        <div className="Voting">
            <ul className="userList" >
                {votingQuestions !== null && Object.keys(votingQuestions).map(key =>
                    <div className="userList-current" key={key}>
                        <li className="userList-name"  >{votingQuestions[key].question}</li>
                    </div>
            
                )}
            </ul>   
        </div>
    )
}
