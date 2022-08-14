import React from 'react';
// import UserContext from '../context/UserContext';
import GoogleButton from 'react-google-button';

const Login = () => {

  const redirectToGoogle = () => {
    window.open('/auth/auth/google', '_self');
  };

  return (
    <div align='center'>
      <br></br>
      <h3>
   Please Login to Use Our App
      </h3>
      <form action="/auth/google">
        <GoogleButton onClick={ redirectToGoogle }/>
      </form>
    </div>
  );
};

export default Login;
