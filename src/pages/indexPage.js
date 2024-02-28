import React from 'react'
import { useNavigate } from "react-router-dom";

export default function IndexPage(props) {
    const redirect = useNavigate();
    React.useEffect(()=>{
        const token = localStorage.getItem("CC_Token");
        console.log(token);
        if(!token){
            redirect("/login");
        }
        else{
            redirect("/dashboard")
        }
        //eslint-disable-next-line
    }, []);
  return (
    <div></div>
  )
}
