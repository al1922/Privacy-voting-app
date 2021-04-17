import {useState, useRef, useReducer } from 'react'
import { useNotification } from "../../contexts/NotificationContext"
import { database }  from '../../firebase'
import { Modal, Form} from 'react-bootstrap'
import Button from "../form_components/Button"
import { HiX } from "react-icons/hi"

import './AddVote.scss'

const choicesActionTypes = {
    createChoice : "CREATE_CHOICE",
    updateChoice : "UPDATE_CHOICE",
    deleteChoice : "DELETE_CHOICE"
}

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

    const [choices, dispatch] = useReducer(choicesReducer, [])

    function choicesReducer(allChoices, action){
        switch(action.type) {
            case choicesActionTypes.createChoice:
                return [...allChoices, {id: Date.now(), value: ""}]
            case choicesActionTypes.deleteChoice:
                return allChoices.filter(deleteChoice => deleteChoice.id !== action.payload.index)
            case choicesActionTypes.updateChoice:
                return allChoices.map(getChoice => {
                    if( getChoice.id === action.payload.index){
                        return {...getChoice, value: action.payload.value }
                    }
                    return getChoice
                })

        } 
    
    }

    function handleCreateChoice(e){
        e.preventDefault()
        dispatch({type: choicesActionTypes.createChoice})
    }
   
    console.log(choices)
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
                        
                        <Form.Group className="voteForm-group voteForm-choices">
                            <Form.Label className="voteForm-title"  >Options/Choices</Form.Label>
                            <span className="choices-addNew" onClick={handleCreateChoice} >Add New</span>

                            {choices && choices.map(choice => 
                                <div className="choices-option"  key={choice.id}>
                                    <Form.Control type="text"  className="option-input" value={choice.value} placeholder="Add your options/choices" onChange={(event) => dispatch({type: choicesActionTypes.updateChoice, payload: { index: choice.id, value: event.target.value }})}  required />
                                    <HiX className="option-delete"  onClick={() => dispatch({type: choicesActionTypes.deleteChoice, payload: { index: choice.id}})} />

                                </div>
                            )}

                        </Form.Group>
                    </Form>

                </Modal.Body>
            </Modal>


        </>
    )
}
