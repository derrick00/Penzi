import  React, {useState, useContext} from "react"

import { AdminContext } from "../context/AdminContext"
import ErrorMessage from "./ErrorMessage";


const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmationPassword, setConfirmationPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [, setToken] = useContext(AdminContext);

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email: email, hashed_password: password })
        }
        const response = await fetch("http://0.0.0.0:8000/admin/", requestOptions)
        const data =  await response.json();
        console.log(data)
        
        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === confirmationPassword && password.length > 5) {
            submitRegistration();
        } else {
            setErrorMessage(
                "Ensure that the passwords match and grater than 5 characters"
            )
        }
    }

    return(
        <div className="auth-box">
            <form className="box" onSubmit={ handleSubmit }>
                <h1 className="title">Register</h1>
                <div className="field">
                    <label className="label">Email:</label>
                    <div className="control">
                        <input 
                        type="email" 
                        placeholder="Enter email:" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="input"
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password:</label>
                    <div className="control">
                        <input 
                        type="password" 
                        placeholder="Enter Password:" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input"
                    />
                    </div>
                </div>
                <div className="field">
                    <label  className="label">Confirm Password:</label>
                    <div className="control">
                        <input 
                        type="password" 
                        placeholder="Confirm Password:" 
                        value={confirmationPassword} 
                        onChange={(e) => setConfirmationPassword(e.target.value)} 
                        className="input"
                    />
                    </div>
                </div>
                  <p className="error-message"> { errorMessage } </p>  
                <br />
                <button className="auth-btn" type='submit' >
                    Register
                </button>
            </ form>
        </div>
    ) ;
}
export default Register