import React from "react"
import { useNavigate,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export const Appbar = () => {
    const [userDetails,setUserDetails] = useState({
        firstName: "Loading...",
        lastName: "Loading..."
    });
    useEffect(() => {
        (async () => {
            const {data} = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/profile",{
                headers: {
                    Authorization: localStorage.getItem('Authorization')
                }
            });
            setUserDetails(data);
        })();
    },[])
    const nevigate = useNavigate();
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <div>
                <ul className="flex font-medium p-4 border rounded-lg space-x-8 rtl:space-x-reverse md:flex-row mt-0 border-0 bg-white">
                    <li className="block  rounded hover:bg-transparent hover:text-blue-700">
                        <Link to={"/dashboard"}>Dashboard </Link>
                    </li>
                    <li className="block  rounded hover:bg-transparent hover:text-blue-700">
                        <Link to={'/transactions'}> Transactions </Link>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col justify-center h-full mr-4">
                {userDetails.firstName}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {userDetails.firstName[0] + userDetails.lastName[0]}
                </div>
            </div>
            <div>
            <button type="button" onClick={
                ()=>{
                    localStorage.removeItem('Authorization');
                    nevigate('/signin');
                }
            } className="text-white mt-2 bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Logout</button>
            </div>
        </div>
    </div>
}