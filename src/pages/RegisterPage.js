import React from 'react'
import axios from 'axios';
import makeToast from '../Toaster';
import { useNavigate } from "react-router-dom";


export default function ResigterPage(props){
  const redirect = useNavigate();

  const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    const registerUser = () => {
  const name = nameRef.current.value;
  const email = emailRef.current.value;
  const password = passwordRef.current.value;

  axios.post("http://localhost:8000/user/register", {
    name,
    email,
    password
  })
  .then((response) => {
    makeToast("success", response.data.message);
    redirect("/login") // redirect to login
  })
  .catch(err => {
    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.message
    )
      makeToast("error", err.response.data.message);
  });
};


  return (
    

    <div className='card'>
    <div className='cardHeader'>Register</div>
    <div className='cardBody'>
        <div className='inputGroup'>
            <label htmlFor='name'>Name</label>
            <input type='text' 
                name='name' 
                id='name'
                placeholder='Your Name'
                ref={nameRef}
            ></input>
        </div>
    </div>
    <div className='cardBody'>
        <div className='inputGroup'>
            <label htmlFor='email'>Email</label>
            <input type='email' 
                name='email' 
                id='email'
                placeholder='abc@example.com'
                ref={emailRef}
            ></input>
        </div>
    </div>
    <div className='cardBody'>
        <div className='inputGroup'>
            <label htmlFor='password'>Password</label>
            <input type='password' 
                name='password' 
                id='password'
                placeholder='Your Password'
                ref={passwordRef}
            ></input>
        </div>
        <button onClick={registerUser}>Register</button>
    </div>
  </div>
  )
}