import { useContext, useState, useEffect } from "react"
import { AdminContext } from "../context/AdminContext"
import React from 'react';
import Settings from './Settings.jsx';
import Users from './Users.jsx'
import Messages from './Messages.jsx'
import UserPic from '../assets/icon2.jpg'
import TextPic from '../assets/sms4.jpg'

function Dash() {
  const [activePage, setActivePage] = useState('dashboard');
  const [token, setToken] = useContext(AdminContext)

  const handleLogout = () => {
    setToken(null);
  }
  const handleDashboardClick = () => {
    setActivePage('dashboard');
  };

  const handleUsersClick = () => {
    setActivePage('users');
  };

  const handleMessagesClick = () => {
    setActivePage('messages');
  };

  const handleSettingsClick = () => {
    setActivePage('settings');
  };

  return (
    <div className="dash2">
      <nav className="nav">
      <button className="site-title" onClick={handleDashboardClick}>PENZI ADMINISTRATION</button>
        <ul className="navigation">
        <button onClick={handleUsersClick}>Users</button>
        <button onClick={handleMessagesClick}>Messages</button>
        <button onClick={handleSettingsClick}>Settings</button>
          
        </ul>
      </nav>

      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'users' && <UsersPage />}
      {activePage === 'messages' && <MessagesPage />}
      {activePage === 'settings' && <SettingsPage />}
    </div>
  );
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getusers = () => {
      fetch("http://3.8.159.233:8000/")
      .then((response) => response.json())
      .then((data) => setUsers(data));
    }
    getusers()
    const getMessages = () => {
      fetch('http://3.8.159.233:8000/message')
      .then(response1 => response1.json())
      .then(data1 => setMessages(data1))
      .catch(error => console.error(error));
    }
    getMessages()
  }, []);

  const females = users.filter((user) => user.gender === 'Female')
  const males = users.filter((user) => user.gender === 'Male')
  const userMessages = messages.filter((mess) => mess.user_message != "")

  return (
    <div className="dash-container">
      <h2>Dashboard</h2>
      <div className="container1">
        <div className="container2">
          <div className="card">
            <div className="slide slide1">
              <div className="content2">
                <div className="icons">
                <img src={UserPic} alt="Users" className="image" />
                </div>
              </div>
            </div> 
            <div className="slide slide2">
              <div className="content2">
              <h3>User Stats</h3>
            <p>Total Users: { users.length}</p>  
            <p>Total Male Users: { males.length}</p>  
            <p>Total Female Users: { females.length}</p>  
              </div>
            </div>
          </div>
        </div>

        <div className="container2">
          <div className="card">
            <div className="slide slide1">
              <div className="content2">
                <div className="icons">
                <img src={TextPic} alt="Users" className="image" />
                </div>
              </div>
            </div> 
            <div className="slide slide2">
              <div className="content2">
              <h3>Message Stats</h3>
            <p>Total Messgaes: { messages.length}</p>  
            <p>Total System Messages: { messages.length}</p>  
            <p>Total User Messages: { userMessages.length}</p>  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersPage() {
  return( <Users />)
  }
function MessagesPage() {
  return ( <Messages />)
}

function SettingsPage() {
  return( <Settings />)
}

export default Dash




