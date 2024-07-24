import { login, register } from "API";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      handleLogin(event);
    } else {
      handleRegister(event);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);

    const email: FormDataEntryValue | undefined = data.get("email")?.toString();
    const password: FormDataEntryValue | undefined = data
      .get("password")
      ?.toString();

    const loginRes = await login({ email, password });

    if (loginRes.httpCode !== 200) {
      setErrorMsg(loginRes.apiMsg);
    } else {
      setErrorMsg("");
      setMsg("Login successful! Welcome back.");
      localStorage.setItem("_t", loginRes.accessToken);
      localStorage.setItem("_u", loginRes.userId);
      localStorage.setItem("_un", loginRes.userName);
      navigate("/chat");
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);

    const email: FormDataEntryValue | undefined = data.get("email")?.toString();
    const password: FormDataEntryValue | undefined = data
      .get("password")
      ?.toString();
    const userName: FormDataEntryValue | undefined = data
      .get("userName")
      ?.toString();
    const registerRes = await register({ email, password, userName });

    if (registerRes.httpCode !== 201) {
      setErrorMsg(registerRes.apiMsg);
    } else {
      setIsLogin(true);
      setErrorMsg("");
      setMsg("Register Successfully!!! Please Login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="flex mb-4">
          <FaQuestionCircle className="w-7 h-7 text-gray-500" />
          {isLogin ? (
            <span className="mb-2 w-max px-2 py-0">
              First time here? Register on the page to set up your account
            </span>
          ) : (
            <span className="mb-2 w-max px-2 py-0">
              To create your account, please enter a username, password, and
              your email address.
            </span>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button
            className={`px-4 py-2 font-medium ${
              isLogin
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={toggleAuthMode}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              !isLogin
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={toggleAuthMode}
          >
            Register
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label
                htmlFor="userName"
                className="block text-gray-700 font-bold mb-2"
              >
                User Name
              </label>
              <input
                type="userName"
                name="userName"
                id="userName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your User Name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          <div>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {msg && <p className="text-blue-300">{msg}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
