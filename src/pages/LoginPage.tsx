import AuthForm from "components/AuthForm";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <>
      <AuthForm />
    </>
  );
};

export default LoginPage;
