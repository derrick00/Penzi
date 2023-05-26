import React, { useEffect, useState } from "react";
import '../index.css'
import axios from 'axios';

function Conversation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.post('http://0.0.0.0:8000/usermessage/', { phone_number: '25411'});
      setData(result.data);
      console.log(result.data)
    }
    fetchData();
  }, []);
  return (
    <div>
      {data.map(request => (
          <div className="chatThreadItem">
            <div className="chatRequest">
            {request.user_message}
            </div>
            <div className="chatResponse">
            {request.sys_message}
            </div>
          </div>
      ))}
    </div>
  );
}
export default Conversation;




// const Conversation = () => {
//   const [formData, setFormData] = useState({ phone_number: '', message: '' });
//   const [dataList, setDataList] = useState([]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const response = await axios.post('http://localhost:8000/request', formData);
//     setFormData({ data: '' });
//     setDataList([...dataList, response.data]);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await axios.get('http://localhost:8000/request');
//       setDataList(response.data);
//       console.log(response.data)
//     };
//     fetchData();
//   }, []);

//   return (
//     <div>
//       <form className="request-form" onSubmit={handleSubmit}>
//         <input className="input" type='text' value={formData.phone_number} placeholder='Enter Phone Number' onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })}/>
//         <input className="input" type='text' value={formData.message} placeholder='Enter the message' onChange={(event) => setFormData({ ...formData, message: event.target.value })}/>
//         <button className="submit" type='submit'>Submit</button>
//       </form>
//       <div className="window">
//             <h3>Response</h3>
//       </div>
//       <ul>
//         {dataList.map((request) => (
//           <li> {request.id}, {request.phone_number},</li>
//       ))}
//       </ul>
//     </div>
//   );
// }

// export default Conversation;





//  export default function Conversation() {
//     const [requests, setRequests] = useState([])
//     const fetchRequests = async () => {
//       const response = await fetch("http://localhost:8000/message/")
//       const requests = await response.json()
//       setRequests(requests)
//     }
//     return (
//         <div>
//           <button onClick={fetchRequests}>Fetch Requests</button>
//           <ul>
//             {requests.map(message=> (
//             <li> key={message.id}, {message.phone_number=254790934765}, {message.user_message}, {message.sys_message}</li> ))}
//           </ul>
//         </div>
//       );
//   }





// async function Convesation(props){
//     const  [previousData, setPreviousData] = useState({request:"", apiResponse:""})

//     let response = await fetch('http://localhost:8000/usermessages',{
//         method:'POST',
//         headers:{
//         'Content-Type':'application/json'
//         },
//         body: JSON.stringify(
//         {
//         "phone_number": props.phone,
//         })
//     })
//     if (response.status === 200){
//         let data = await response.json()
//         setPreviousData(data)
//     } else{
//         console.log(data)
//     }
// }
// export default Convesation