import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const AppContext =  createContext()

const AppContextProvider = (props)=>{
    const [user, setUser] = useState( localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
    const [token, setToken] = useState(localStorage.getItem('token') || "")

    const navigate = useNavigate()
    const backend_url = import.meta.env.VITE_BACKEND_URL

    useEffect(()=>{
        if(token){
            localStorage.setItem('token', token)
        }
        else{
            localStorage.removeItem('token')
        }
    },[token])

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return(
        <AppContext.Provider value={{user, setUser, token, setToken, backend_url}}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider