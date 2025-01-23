import axios from "axios";
import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/Images/login.png";
import config from "../config/config";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const baseUrl = config.baseUrl;

  const handleLogin = async () => {
    setLoading(true);
    const { userName, password } = formData;
    if (userName !== "" && password !== "") {
      try {
        const response = await axios({
          url: `${baseUrl}/login?userName=${userName}&password=${password}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response.data;

        setLoading(false);
        if (data == "User not found ") {
          toast.error("User not found");
          return;
        } else {
          const userData = localStorage.setItem("userId", data.userId);
          localStorage.setItem("us_st_d", JSON.stringify(data));
          navigate("/home");
        }
      } catch (error) {
        setLoading(false);
        const errorMsg = error.response?.data?.message || error.message;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } else {
      setLoading(false);
      toast.error("Email and Password is required ...!");
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleButton = () => {
    setShowPass(!showPass);
  };

  return (
    <section
      className="p-0"
      style={{
        background: "#f2f2f2",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="container">
        <ToastContainer />
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-8 d-flex align-items-center bg-white custom-box">
            <div className="col-lg-6 col-md-12 p-4">
              <h3 className="text-center mb-4">Sign In</h3>
              <div className="formlayout">
                <div className="form-group mb-3">
                  <label>
                    Enter Your Email{" "}
                    <span className="text-danger fw-bold">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.userName}
                    name="userName"
                    onChange={inputHandler}
                    placeholder="Enter Email"
                  />
                </div>
                <div className="form-group mb-3 position-relative">
                  <label>
                    Enter Your Password{" "}
                    <span className="text-danger fw-bold">*</span>
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={inputHandler}
                    placeholder="Enter Password"
                  />
                  <div
                    className="position-absolute"
                    onClick={toggleButton}
                    style={{ top: "42%", right: "10px" }}
                  >
                    <span style={{ fontSize: "20px", cursor: "pointer" }}>
                      {showPass ? <IoEye /> : <IoEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <Link to="/forgot-password" className="hover text-muted">
                    Forgot Password?
                  </Link>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3 mb-3"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Sign In"}
                </button>

                <div className="d-flex justify-content-center hover">
                  <Link to="signup" className="text-muted text-center">
                    Click here if you want to create account
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="imgWidth">
                <img src={logo} alt="Illustration" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
