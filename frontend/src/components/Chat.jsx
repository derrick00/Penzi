import React, { useEffect, useState, useRef } from "react";
import '../index.css'
import axios from 'axios';
import blankPic from "../assets/blank.jpeg"
import { RiSendPlaneFill } from "react-icons/ri"
import Conversation from "./Conversation";


function Chat(props){
  const [chats, setChats] = useState([])
  const [replies, setReplies] = useState([])
  const  [inputData, setInputData] = useState({request:"", apiResponse:""})
  const  [inputData1, setInputData1] = useState({req:"", apiResp:""})
  const  [inputResponse, setInputResponse] = useState([])
  const [data, setData] = useState([]);
  const refResponse = useRef(new Array())


  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.post('http://3.8.159.233:8000/usermessage/', { phone_number: props.phone});
      setData(result.data);
    }
    fetchData();
  }, []);


  const convo = data.map((item)=>{
    return(
      <div className="chatThreadItem">
        <div className="chatRequest">
          { item.user_message }
        </div>
        <div className="chatResponse">
          { item.sys_message }
        </div>
      </div>
    )
  })
console.log("resp",inputResponse)
  const rep = inputResponse
  const chatThread = chats.map((item, index)=>{
    return(
      <div className="chatThreadItem">
        <div className="chatRequest">
          { item.request }
        </div>
        <div className="chatResponse">
        {/* {replies.map((reply) => {
          {reply.apiResp}
        })} */}
          {/* {inputResponse} */}
          { refResponse.current[index] }
        </div>
      </div>
    )
  })
  async function sendRequest(){
    let response = await fetch('http://3.8.159.233:8000/request',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(
        {
        "phone_number": props.phone,
        "message": inputData.request
      })
    })
    if (response.status === 200){
      let data = await response.json()
      console.log(data)
      refResponse.current.push( data )
      setInputResponse(data)
      console.log("inputRes" ,inputResponse)
      setInputData1({req: "", apiResp: inputResponse})
      setInputData({request: inputData.request, apiResponse: refResponse.current})
      setChats(prev => {return([...prev, inputData])})
    } else{
      console.log(data)
      // alert("Something went wrong!")
    }
  }
  function handleInput(event) {
    const value = event.target.value
    setInputData( ( prev ) => {return({...prev, [event.target.name]: value})}  )
  }
  return(
    <div className="chat">
      <div className="chatHeader">
        <div className="chatHeaderProfile">
          <div className="chatHeaderProfilePic">
            <img src={ blankPic } />
          </div>
          <div className="chatHeaderProfileName">
            <span>{props.phone}</span>
          </div>
        </div>
          {/* <div className="allchats">
            <span onClick={convo}>All Chats</span>
          </div> */}
        {/* <div className="chatHeaderStatus">
          <span>typing ....</span>
        </div> */}
      </div>
      <div className="chatThread">
        <div className="chatThreadItem">
        <Hello />
        { convo }
        { chatThread }
        </div>
      </div>
      <div className="chatSend">
        <input className="chatSendInput" type="text" placeholder=" send message" onChange={handleInput} name="request" value={inputData.request}/>
        <div className="chatSendButton" onClick={ sendRequest }>< RiSendPlaneFill /></div>
      </div>
    </div>
  )
}
export default Chat

const Hello = () => {
  return(
    <div className="chatThreadItem">
      <div className="chatRequest2">
        {/* <p>New Here</p> */}
      </div>
      <div className="chatResponse2">
        <p>Hello and welcome to PENZI.To begin registration reply with the word PENZI.</p>
      </div>
    </div>
  )
}