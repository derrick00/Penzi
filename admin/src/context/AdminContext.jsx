import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext()

export const AdminProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("adminToken",));

    useEffect(() => {
        const fetchAdmin = async () => {
            const requestOptions = {
                method: "GET",
                Headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response = await fetch("http://3.8.159.233:8000/admin/me/", requestOptions);

            if (!response.ok) {
                setToken(null);
            }
            localStorage.setItem("adminToken", token);
        };
        fetchAdmin()
        console.log(token)
    }, []);
    return(
        <AdminContext.Provider value={[token, setToken]}>
            {props.children}
        </AdminContext.Provider>
    )
}