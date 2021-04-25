import {useState} from 'react'
import {Form, Modal} from 'react-bootstrap'
import { database } from '../../firebase'
import { useNotification } from "../../contexts/NotificationContext"
import { useAuth } from "../../contexts/AuthContext"

import {EncryptData} from './Encryption'

import './Question.scss'

export default function Question({props, questionId, roomId, publicKey}) {

    const { setError, setSuccess} = useNotification()
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()

    const [choises] = useState(props.choises)

    const [choisesValue, setChoisesValue] = useState('0')
    const changeChoise = (key) => setChoisesValue(key)


    async function voteOn(){

        await database.ref(`rooms/${roomId}/public/vote/${questionId}/answers`).get().then(async function(accesSnapShot){
            if(!accesSnapShot.hasChild(currentUser.uid)){
                const encryptedResult = await EncryptData(choisesValue, publicKey)
                await database.ref(`rooms/${roomId}/public/vote/${questionId}/answers/${currentUser.uid}`).set({
                    answer: encryptedResult.value.toString()
                })
                setSuccess("The vote was successful")
            }
            else{
                setError('The vote has already been cast')
            }

        }).catch((err) => {
            setError(err)
        })


    }

    async function handleSendReply(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            await voteOn()
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            setError(err.message)
        }
    }

    return (
        <>
            <Form onSubmit={handleSendReply} className="questionForm">

                <Form.Group className="questionForm-group questionForm-radio">
                    <Form.Label className="voteForm-title">Options/Choices</Form.Label>
                    { choises !== null && Object.keys(choises).map(key=> 
                        <label className="radio" key={key}>
                            <input className="radio-input" type="radio" name="type"  value={key} checked={key === choisesValue}  onChange={event => changeChoise(event.target.value)} />
                            <span className="radio-box"></span>
                            <span className="radio-text">{choises[key].value}</span>
                        </label>
                    )}
                    <span className="radio-tip">Select one of the options above.</span>

                </Form.Group>
                
                <Modal.Footer>
                    <button className="questionForm-button" disabled={loading} type="submit">Vote</button>
                </Modal.Footer>

            </Form>

        </>
    )
}
