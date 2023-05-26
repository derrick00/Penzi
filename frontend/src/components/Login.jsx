import {AiFillPhone} from "react-icons/ai"
import {useState} from "react"

function Login(props){
  const [phoneNumber, setPhoneNumber] = useState("")
  function loginUser(){
    
    if (phoneNumber.startsWith("254")) {
      props.changeLoggedIn(true, phoneNumber)
    } 
  }
  function handleInput(event){
    const value = event.target.value
    setPhoneNumber(value)
  }
  return(
    <div className="login">
      <div className="loginInput">
        <div className="loginInputLogo"><AiFillPhone /></div>
        <div className="loginInputName">Phone Number</div>
        <input 
          className="loginInputBox"
          type="text"
          placeholder="Enter Phone number (2547...)"
          onChange={handleInput}
        />
      </div>
      <div className="loginSubmit">
        <span onClick={loginUser}>JOIN PENZI</span>
      </div>
    </div>
  )
}
export default Login
