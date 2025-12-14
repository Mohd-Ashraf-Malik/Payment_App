import React from "react"
import { useEffect, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate} from 'react-router-dom'

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const nevigate = useNavigate();
    useEffect(() => {
        (async ()=>{
            const {data} = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/me",{
                headers: {
                    Authorization: localStorage.getItem("Authorization")
                }
            })
            if(data.authenticated){
                setIsAuthenticated(true);
                nevigate('/dashboard');
            }
        })();
    },[])
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox placeholder="John" label={"First Name"} onChange={e => {
            setFirstName(e.target.value);
        }} />
        <InputBox placeholder="Doe" label={"Last Name"} onChange={ e => {
            setLastName(e.target.value);
        }}/>
        <InputBox placeholder="xyz@gmail.com" label={"Email"} onChange={ e => {
            setUsername(e.target.value);
        }} />
        <InputBox placeholder="*******" label={"Password"} onChange={ e => {
            setPassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button onClick={
            async ()=>{
                const response = await axios.post(
                    import.meta.env.VITE_BACKEND_URL + "/api/v1/user/signup",
                    {
                        username,
                        password,
                        firstName,
                        lastName
                    }
                );
                if(response.status === 200) {
                    localStorage.setItem("Authorization", "Bearer " + response.data.token);
                    nevigate('/dashboard');
                }
                console.log(response.data.message);
            }
          } label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}