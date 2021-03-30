import React, {useState, useContext, useEffect} from 'react'
import './NotificationContext.scss'

const NotificationContext = React.createContext()

export function useNotification() {
    return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [message, setMessage] = useState('')
 
    function DisplayError(){
        
        return(
            <>
                {error && <div className="error"> {error} </div>}
            </>
        )
    }

    function DisplaySuccess(){
        
        return(
            <>
                {success && <div className="success"> {success} </div>}
            </>
        )
    }

    function DisplayMessage(){
        
        return(
            <>
                {message && <div className="message"> {message} </div>}
            </>
        )
    }

    useEffect(() => {
        if(error)setTimeout(function(){ setError('')}, 3000)
    }, [error])

    useEffect(() => {
        if(success)setTimeout(function(){ setSuccess('')}, 3000)
    }, [success])

    useEffect(() => {
        if(message)setTimeout(function(){ setMessage('')}, 3000)
    }, [message])

    const value ={
        DisplayError,
        DisplaySuccess,
        DisplayMessage,
        setError,
        setSuccess,
        setMessage
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}
