import React, { useContext, useState} from "react";
import ErrorMessage from "./ErrorMessage";
import { AdminContext } from "../context/AdminContext";


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [, setToken] = useContext(AdminContext);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": 'application/x-www-form-urlencoded'},
      body: JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`)
    }
    const response = await fetch ("http://3.8.159.233:8000/token/", requestOptions)
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.details)
    } else {
      setToken(data.access_token)
    }
  }

const handleSubmit = (e) => {
  e.preventDefault()
  submitLogin()
}
return(
  <div className="auth-box">
    <form action="" className="box" onSubmit={ handleSubmit }>
      <h1 className="title">Login</h1>
      <div className="field">
          <label className="label">Email:</label>
          <div className="control">
              <input 
              type="email" 
              placeholder="Enter email" 
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

          { errorMessage }
      <br />
      <button className="auth-btn" type='submit' >
          Login
      </button>
    </ form>
  </div>
)
}
export default Login



