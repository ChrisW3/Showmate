import React from 'react';
import { signInWithGoogle } from '../googleAuth';
import { useNavigate } from "react-router-dom";

function SignInButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => signInWithGoogle(navigate)}>Sign In with Google</button>
  );
}

export default SignInButton;
