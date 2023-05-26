import { useState, useEffect } from "react";


function Users() {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch("http://3.8.159.233:8000/")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (gender) => {
    setGenderFilter(gender);
  };

  const filteredUsers = genderFilter
    ? users.filter((user) => user.gender === genderFilter)
    : users;

  return (
    <>

    <div className="users">
      <div className="sidebar">
        <h3>Filter</h3>
        <button onClick={() => handleFilterClick("")}>All Users</button>
        <button onClick={() => handleFilterClick("Female")}>Females </button>
        <button onClick={() => handleFilterClick("Male")}>Males </button>
      </div>
      <div className="main">
        <div className="users-header">
          <h2>Users list</h2>

        </div>
        <div className="userlist-head">
          <div className="one" style={{flex: "1"}}>
            <p>ID</p>
          </div>
          <div className="one" style={{flex: "3"}}>
            <p>First Name</p>
          </div>
          <div className="one" style={{flex: "3"}}>
            <p>Last Name</p>
          </div>
          <div style={{flex: "3"}}>
            <p>Phone</p>
          </div>
          <div style={{flex: "1"}}>
            <p>Age</p>
          </div>
          <div className="one" style={{flex: "2"}}>
          <p>Gender</p>
          </div>
          <div style={{flex: "3"}}>
          <p>County</p>
          </div>
          <div className="one" style={{flex: "2"}}>
          <p>Town</p>
          </div>
        </div>
        <div>
            {filteredUsers.map((request) => (

              <div className="userlist">
                <div className="two" style={{flex: "1"}}>
                  {request.id}
                </div>
                <div style={{flex: "3"}}>
                  {request.first_name}
                </div>
                <div style={{flex: "3"}}>
                  {request.last_name}
                </div>
                <div style={{flex: "3"}}>
                  {request.phone_number}
                </div>
                <div style={{flex: "1"}}>
                {request.age}
                </div>
                <div className="one" style={{flex: "2"}}>
                {request.gender}
                </div>
                <div style={{flex: "3"}}>
                {request.county}
                </div>
                <div className="one" style={{flex: "2"}}>
                {request.town}
                </div>
              </div>

            ))}

        </div>
      </div>
    </div>
    </>

  );
}
export default Users;













































// import React, { useEffect, useState } from "react";
// import '../index.css'
// import axios from 'axios';
// import Usa from "./Usa"

// function Users() {
//   const [users, setUsers] = useState([])
//   const [showAll, setShowAll] = useState(true);
//   const [showFemale, setShowFemale] = useState(false);
//   const [showMale, setShowMale] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch("http://localhost:8000/")
//       const requests = await response.json()
//       setUsers(requests)
//       console.log(requests)
//       console.log(users)
//     }
//     fetchUsers()
//   }, []);

//   const handleShowAll = () => {
//     setShowAll(true);
//     setShowFemale(false);
//     setShowMale(false);
//   };

//   const handleShowFemale = () => {
//     setShowAll(false);
//     setShowFemale(true);
//     setShowMale(false);
//   };

//   const handleShowMale = () => {
//     setShowAll(false);
//     setShowFemale(false);
//     setShowMale(true);
//   };

//   const userList = showAll
//   ? users
//   : showFemale
//   ? users.filter((user) => user.gender === 'female')
//   : users.filter((user) => user.gender === 'male');


//   return (
//     <div className="users">
//       <div className="sidebar">
//         <h3>Users</h3>
//         <button onClick={handleShowAll}>All Users</button>
//         <button onClick={handleShowFemale}>Female Users</button>
//         <button onClick={handleShowMale}>Male Users</button>
//       </div>
//       <div className="main">
//         <div className="userlist-head">
//           <div className="one" style={{flex: "1"}}>
//             <p>ID</p>
//           </div>
//           <div style={{flex: "3"}}>
//             <p>Phone</p>
//           </div>
//           <div className="one" style={{flex: "4"}}>
//             <p>Full Names</p>
//           </div>
//           <div style={{flex: "1"}}>
//             <p>Age</p>
//           </div>
//           <div className="one" style={{flex: "2"}}>
//           <p>Gender</p>
//           </div>
//           <div style={{flex: "3"}}>
//           <p>County</p>
//           </div>
//           <div className="one" style={{flex: "2"}}>
//           <p>Town</p>
//           </div>
//         </div>
//         <div>
//         {users.map((request)=> {
          // <div className="userlist">
          //   <div className="two" style={{flex: "1"}}>
          //     {request.id}
          //   </div>
          //   <div style={{flex: "3"}}>
          //     {request.phone_number}
          //   </div>
          //   <div className="one" style={{flex: "4"}}>
          //     {request.first_name} {request.first_name}
          //   </div>
          //   <div style={{flex: "1"}}>
          //   {request.age}
          //   </div>
          //   <div className="one" style={{flex: "2"}}>
          //   {request.gender}
          //   </div>
          //   <div style={{flex: "3"}}>
          //   {request.county}
          //   </div>
          //   <div className="one" style={{flex: "2"}}>
          //   {request.town}
          //   </div>
          // </div>
//         })}
//         </div>

//         <Usa  />
//       </div>
//     </div>
//   )
// }
// export default Users





















































// import React, { useEffect, useState } from "react";
// import '../index.css'
// import axios from 'axios';

// function Users() {
//   const [users, setUsers] = useState([])
//   const [requests, setRequests] = useState([])

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch("http://localhost:8000/")
//       const requests = await response.json()
//       setUsers(requests)
//     }
//     fetchUsers()
//   }, []);


//   const allUsers = users.map((request)=> {
//     return(
//       <div>
//         <div className="userlist">
//           <div className="two" style={{flex: "1"}}>
//             {request.id}
//           </div>
//           <div style={{flex: "3"}}>
//             {request.phone_number}
//           </div>
//           <div className="one" style={{flex: "4"}}>
//             {request.first_name} {request.first_name}
//           </div>
//           <div style={{flex: "1"}}>
//           {request.age}
//           </div>
//           <div className="one" style={{flex: "2"}}>
//           {request.gender}
//           </div>
//           <div style={{flex: "3"}}>
//           {request.county}
//           </div>
//           <div className="one" style={{flex: "2"}}>
//           {request.town}
//           </div>
//         </div>
//       </div>
//     )})
//   return (
//     <div className="users">
//       <div className="sidebar">
//         <h3>Users</h3>
//         <ul>
//           <li>All Users</li>
//         </ul>
//       </div>
//       <div className="main">
//         <div className="userlist-head">
//           <div className="one" style={{flex: "1"}}>
//             <p>ID</p>
//           </div>
//           <div style={{flex: "3"}}>
//             <p>Phone</p>
//           </div>
//           <div className="one" style={{flex: "4"}}>
//             <p>Full Names</p>
//           </div>
//           <div style={{flex: "1"}}>
//             <p>Age</p>
//           </div>
//           <div className="one" style={{flex: "2"}}>
//           <p>Gender</p>
//           </div>
//           <div style={{flex: "3"}}>
//           <p>County</p>
//           </div>
//           <div className="one" style={{flex: "2"}}>
//           <p>Town</p>
//           </div>
//         </div>
//         { allUsers }
//       </div>
//     </div>
//   )
// }export default Users






// // return (
// //   <div>
// //     <div className="userlist-head">
// //       <div className="one" style={{flex: "1"}}>
// //         <p>ID</p>
// //       </div>
// //       <div style={{flex: "3"}}>
// //         <p>Phone</p>
// //       </div>
// //       <div className="one" style={{flex: "4"}}>
// //         <p>Full Names</p>
// //       </div>
// //       <div style={{flex: "1"}}>
// //         <p>Age</p>
// //       </div>
// //       <div className="one" style={{flex: "2"}}>
// //       <p>Gender</p>
// //       </div>
// //       <div style={{flex: "3"}}>
// //       <p>County</p>
// //       </div>
// //       <div className="one" style={{flex: "2"}}>
// //       <p>Town</p>
// //       </div>
// //     </div>
// //     { allUsers }
// //   </div>
// // );
// // }
// // export default Users
