import { auth, database }  from '../../firebase'

export default function UploadUserData(nickName, catchError) {

    try {
        auth.onAuthStateChanged(user => {
            //Add emial, uid, nick to private user root
            database.ref(`users/${user.uid}/private`).set({ 
                email: btoa(user.email),
                nickName: btoa(nickName)
            })

            //Add emial, uid, nick to public root
            database.ref(`public/${btoa(user.email)}`).set({ 
                uid: user.uid,
                nickName: btoa(nickName)
            })
        })
    }
    catch(err){
        catchError(err)
    } 
}