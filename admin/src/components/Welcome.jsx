import  React, {useState, useContext} from "react"
import Login from "./Login"
import Register from "./Register";
import { AdminContext } from "../context/AdminContext"
import ErrorMessage from "./ErrorMessage";


const Welcome = () => {
    const [activePage, setActivePage] = useState('login');
    const [token, setToken] = useContext(AdminContext)

    const handleRegisterClick = () => {
        setActivePage('register');
    };
    
    const handleLoginClick = () => {
        setActivePage('login');
    };
    return (
        <div className="welcome-page">
            <button className="site-title-welcome">PENZI ADMINISTRATION</button>
            <div className="welcome-container">
                <div className="welcome">
                    {activePage === 'login' && <LoginPage />}
                </div>
            </div>
        </div>
    )
}


function LoginPage() {
    return (<Login />)
  }
export default Welcome