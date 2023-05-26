// import { Link } from "react-router-dom"
// import React, { useContext } from "react"
// import { AdminContext } from "../context/AdminContext"


// export default function Navbar() {
//     const path = window.location.pathname

//     const [token, setToken] = useContext(AdminContext)

//     const handleLogout = () => {
//         setToken(null);
//     }
//     return(
//         <nav className="nav">
//             <a href="/" className="site-title">PENZI ADMINISTRATION</a>
//             <ul className="navigation">
//                 <button className="nav-btn" onClick={handleLogout}> Users</button>
//                 <button className="nav-btn" onClick={handleLogout}> Messages</button>
//                 <button className="nav-btn" onClick={handleLogout}> Settings</button>
//                 {{ token }&& (<button className="nav-btn" onClick={handleLogout}> Logout</button>)}
//             </ul>
//         </nav>
//     )
// }


// function CustomLink({ href, children, ...props}) {
//     const path = window.location.pathname

//     return(
//         <li className={path === href ? "active" : ""}>
//             <a href={href}>{children}</a>
//         </li>
//     )
// }




// {/* <nav className="nav">
// <a href="/" className="site-title">PENZI ADMINISTRATION</a>
// <ul className="navigation">
//     <CustomLink href="/users">Users</CustomLink>
//     <CustomLink href="/messages">Messages</CustomLink>
//     <CustomLink href="/settings">Settings</CustomLink>
//     {{ token }&& (<button className="nav-btn" onClick={handleLogout}> Logout</button>)}
// </ul>
// </nav> */}