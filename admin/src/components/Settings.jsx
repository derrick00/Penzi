import { useContext, useState } from "react"
import { AdminContext } from "../context/AdminContext"


function Settings() {
  const [token, setToken] = useContext(AdminContext)


  const handleLogout = () => {
    setToken(null);
  }

  return (
      <div className="settings">
        <h2>Settings</h2>
        <h3 className="admin-settings">Admin Settings</h3>
        {{ token }&& (<button className="logout-btn" onClick={handleLogout}> Logout</button>)}
      </div>
  )
}

export default Settings