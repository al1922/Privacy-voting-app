import {useState, useEffect, useRef} from 'react'
import { useNotification } from "../../contexts/NotificationContext"
import { database }  from '../../firebase'
import { Modal, Form} from 'react-bootstrap'
import Button from "../form_components/Button"

import './AddVote.scss'


export default function AddVote() {

    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()
    const [loading, setLoading] = useState(false)

    //Display Modal
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleHide = () => setShow(false)

    const questionRef = useRef('')

    const [voteType, setVoteType] = useState(true)
    const changeVoteType = () => voteType ? setVoteType(false) : setVoteType(true)  
    
    const [questionType, setQuestionType] = useState('singleChoice')
    const changeQuestionType = (val) => setQuestionType(val) 

    

    function handleAddVote(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            //sendInvation(invitationEmialRef.current.value)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            setError(err.message)
        }
    }


    return (
        <>
            <DisplaySuccess/>
            <DisplayError/>

            <div className="invitation-link" >
                {/* <HiSearch className="invitation-icon" onClick={handleShow} /> */}
                <button className="invitation-text" onClick={handleShow} >Invitation</button>
            </div>

            {/* <Button name="Send" disabled={loading} type="submit"></Button> */}

            <Modal className="voteModal" show={show} onHide={handleHide} animation={false} >
                <Modal.Header closeButton>
                <Modal.Title className="voteModal-title">Create New Vote</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleAddVote} className="voteForm">

                        <Form.Group className="voteForm-group voteForm-question">
                            <Form.Label className="voteForm-title">Question</Form.Label>
                            <Form.Control type="text" className="question-input" placeholder="Add your question" ref={questionRef} required /> 
                        </Form.Group>

                        <Form.Group className="voteForm-group voteForm-checkbox">
                            <Form.Label className="voteForm-title">Voting Type</Form.Label>
                            <label className="checkbox">
                                <input type="checkbox" className="checkbox-input" checked={voteType ? "checked": "" } onChange={changeVoteType} />
                                <span className="checkbox-box"></span>
                                <span className="checkbox-text">Anonymous voting</span>
                            </label>
                            <span className="checkbox-tip">After voting, see who voted for what or leave anonymous.</span>
                        </Form.Group>

                        <Form.Group className="voteForm-group voteForm-radio">
                            <Form.Label className="voteForm-title">Question Type</Form.Label>
                            <label className="radio" >
                                <input className="radio-input" type="radio" name="type" value="singleChoice"   checked={questionType === 'singleChoice' ? "checked": "" }  onChange={event => changeQuestionType(event.target.value)}/>
                                <span className="radio-box"></span>
                                <span className="radio-text">Single choice</span>
                            </label>
                            <label className="radio" >
                                <input className="radio-input" type="radio" name="type" value="multipleChoice" checked={questionType === 'multipleChoice' ? "checked": "" }  onChange={event => changeQuestionType(event.target.value)}/>
                                <span className="radio-box"></span>
                                <span className="radio-text">Multiple choice</span>
                            </label>
                            <span className="radio-tip">Select a question type for voting.</span>
                        </Form.Group>
                        
                        <p>Please select your gender:</p>

                    </Form>

                </Modal.Body>
            </Modal>

        </>
    )
}
