import React from 'react';
import Dash from './components/Dashboard.jsx';
import Welcome from './components/Welcome.jsx';
import { useContext } from "react"
import { AdminContext } from "./context/AdminContext.jsx"



function AdminApp() {
  const [token] = useContext(AdminContext)
  console.log(token)
  return (
    <div className="App">
                {
            !token ?(
              <div>
                <Welcome /> 
              </div>
            ) : (
              <div>
                <Dash />
              </div>
            )
          }
    </div>
  )
}

export default AdminApp
