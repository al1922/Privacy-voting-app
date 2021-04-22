import {useState} from 'react'
import {Form, Modal} from 'react-bootstrap'
import { useNotification } from "../../contexts/NotificationContext"

import {EncryptData} from './Encryption'

import './Question.scss'

export default function Question({props, publicKey}) {

    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()
    const [loading, setLoading] = useState(false)

    const [choises] = useState(props.choises)

    const [choisesValue, setChoisesValue] = useState('0')
    const changeChoise = (key) => setChoisesValue(key)


    function handleSendReply(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            console.log(EncryptData(choisesValue,publicKey))
            setSuccess("Work")
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
                    <Form.Label className="voteForm-title">Choises</Form.Label>
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
