import React from "react"
import { useState, useEffect } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const nevigate = useNavigate();
    useEffect(() => {
  const checkAuth = async () => {
    try {
        const token = localStorage.getItem("Authorization");
        if (!token) return;

        const { data } = await axios.get(
            import.meta.env.VITE_BACKEND_URL + "/api/v1/user/me",
            {
            headers: {
                Authorization: token
            }
            }
        );

        if (data.authenticated) {
            setIsAuthenticated(true);
            nevigate("/dashboard");
        }
        } catch (err) {
            // user not logged in / token invalid
            console.log("Not authenticated");
        }
    };
    console.log(import.meta.env.VITE_BACKEND_URL);
    checkAuth();
    }, []);
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="xyz@gmail.com" label={"Email"} onChange={(e) => {
            setUsername(e.target.value);
        }} />
        <InputBox placeholder="*******" label={"Password"}  onChange={(e) => {
            setPassword(e.target.value);
        }} />
        <div className="pt-4">
          <Button label={"Sign in"} onClick={async ()=>{
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/signin",{
                username,
                password
            });
            console.log(response);
            if(response.status === 200){
                localStorage.setItem("Authorization", "Bearer " + response.data.token);
                setIsAuthenticated(true);
                nevigate('/dashboard');
            }
          }} />
        </div>
        <div className="mt-4">
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  </div>
}