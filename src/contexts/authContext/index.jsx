import { useContext, useEffect, useState, createContext } from "react";
import { auth } from "../../keys/FirebaseAuth";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();
export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
const unsubscribe = onAuthStateChanged(auth, initializeuser);
return unsubscribe;
    }, [])

    async function initializeuser(user) {
        if (user){
            setCurrentUser({...user});
            setUserLoggedIn(true)
        }else{
            setCurrentUser(null)
            setUserLoggedIn(false)
        }
        setLoading(false)
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}