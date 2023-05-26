import Info from './components/Info.jsx'
import Login from './components/Login.jsx'
import Chat from './components/Chat.jsx'
import Conversation from './components/Conversation.jsx'
import {useState} from 'react'

function App() {
  const [loggedIn,setLoggedIn] = useState(false)
  const [phone, setPhone] = useState("")
  const changeLoggedIn = (newVar, phoneNumber) => {
    setLoggedIn(newVar)
    setPhone(phoneNumber)
  }

  return (
    // <div className="App">
    //   <Conversation phone={phone}/>
    // </div>
      <div className="App">
        <Info />
        {!loggedIn ?
          <Login changeLoggedIn={changeLoggedIn} /> : <Chat phone={phone} />}
      </div>
  )
}

export default App
