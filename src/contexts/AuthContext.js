import React, {useState, useContext, useEffect} from 'react'
import {auth} from  '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    function signup(emial, password){
        return auth.createUserWithEmailAndPassword(emial, password)
    }

    function login(emial, password){
        return auth.signInWithEmailAndPassword(emial, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    function getUID(){
        auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return currentUser.uid
    }

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe

      }, [])

    const value ={
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updatePassword,
        getUID
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
