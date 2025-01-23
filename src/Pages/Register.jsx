import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Images/ss.png';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from 'axios';
import Config from "../config/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();
    const baseUrl = Config.baseUrl;
    const [error, setError] = useState(null);
    const [file, setFile] = useState("");
    const [showPass, setShowPass] = useState({ password: false, cnfPassword: false });
    const [formData, setFormData] = useState({
        userId: 0,
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        password: "",
        cnfPassword: "",
        code: "",
        profileImagePath: "",
        status: "",
        lastLogin: new Date().toISOString()
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    const firstNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const lastNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    const validateForm = () => {
        if (!firstNameRegex.test(formData.firstName)) {
            toast.error("First Name must contain only letters and spaces.");
            return false;
        }

        if (!lastNameRegex.test(formData.lastName)) {
            toast.error("Last Name must contain only letters and spaces.");
            return false;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return false;
        }

        if (!passwordRegex.test(formData.password)) {
            toast.error("Password must be at least 6 characters long and contain at least one letter and one number one special character.");
            return false;
        }

        if (formData.password !== formData.cnfPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        return true;
    };

    const formHandler = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const submitHandler = async () => {
        setError(null);
        if (!validateForm()) {
            return;
        }

        try {
            let imageUrl = "";
            if (file) {
                const formDataFile = new FormData();
                formDataFile.append("file", file);
                const uploadResponse = await axios.post(`${baseUrl}/api/files/upload`, formDataFile, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imageUrl = uploadResponse.data?.url || "";
                console.log("Registration imageUrl", imageUrl);
            }

            const { data } = await axios.post(`${baseUrl}/saveUser`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success("Registration successful!");
            navigate("/"); 
        } catch (error) {
            setError(error.message);
            toast.error(`Error during registration: ${error.message}`);
            console.error("Error during registration:", error);
        }
    };

    const toggleButton = (name) => {
        setShowPass((prev) => {
            return { ...prev, [name]: !prev[name] }
        });
    };

    return (
        <>
            <section className='p-0' style={{ background: "", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className='container'>
                    <div className='row d-flex justify-content-center align-items-center' style={{ marginTop: "50px" }}>
                        <div className='col-lg-10 d-flex align-items-center bg-white SignUp__box gap-5 shadow border'>
                            <div className='col-lg-6 col-md-12 p-0'>
                                <h3 className='text-center mb-4' style={{ fontSize: "22px" }}>Create an Account</h3>
                                <div className='formlayout'>
                                    {error && <p className='text-danger text-center'>{error}</p>}
                                    <div className='d-flex mb-2' style={{ gap: '15px' }}>
                                        <div className='form-group m-0 w-50'>
                                            <label>First Name<span className='text-danger fw-bold'>*</span></label>
                                            <input type='text' className='form-control' name='firstName' value={formData.firstName} onChange={formHandler} placeholder='Enter first Name' />
                                        </div>
                                        <div className='form-group m-0 w-50'>
                                            <label>Last Name<span className='text-danger fw-bold'>*</span></label>
                                            <input type='text' className='form-control' name='lastName' value={formData.lastName} onChange={formHandler} placeholder='Enter last Name' />
                                        </div>
                                    </div>
                                    <div className='d-flex mb-2' style={{ gap: '15px' }}>
                                        <div className='form-group m-0 w-50'>
                                            <label>Company Name<span className='text-danger fw-bold'>*</span></label>
                                            <input type='text' className='form-control' name='companyName' value={formData.companyName} onChange={formHandler} placeholder='Enter Company Name' />
                                        </div>

                                        <div className='form-group m-0 w-50'>
                                            <label>Email<span className='text-danger fw-bold'>*</span></label>
                                            <input type='text' className='form-control' name='email' value={formData.email} onChange={formHandler} placeholder='Enter Email' />
                                        </div>
                                    </div>
                                    <div className='d-flex mb-0' style={{ gap: '15px' }}>
                                        <div className='form-group mb-2 w-50'>
                                            <label>Phone Number<span className='text-danger fw-bold'>*</span></label>
                                            <input type='text' className='form-control' name='phone' value={formData.phone} onChange={formHandler} placeholder='Mobile Number' />
                                        </div>
                                        <div className='form-group mb-2 w-50'>
                                            <label>Upload Image<span className='text-danger fw-bold'>*</span></label>
                                            <input type='file' className='form-control' name='profileImagePath' accept="image/*" onChange={handleFileChange} />
                                        </div>
                                    </div>
                                    <div className='form-group mb-2 position-relative'>
                                        <label>Password <span className='text-danger fw-bold'>*</span></label>
                                        <input type={showPass.password ? 'text' : 'password'} name='password' value={formData.password} onChange={formHandler} className='form-control' placeholder='Enter Password' />
                                        <div className='position-absolute' onClick={() => toggleButton("password")} style={{ top: '54%', right: "10px", lineHeight: "0" }}>
                                            <span style={{ fontSize: "20px", cursor: "pointer" }}>{showPass.password ? <IoEye /> : < IoEyeOff />}</span>
                                        </div>
                                    </div>
                                    <div className='form-group mb-2 position-relative'>
                                        <label>Confirm Password <span className='text-danger fw-bold'>*</span></label>
                                        <input type={showPass.cnfPassword ? 'text' : 'password'} className='form-control' name="cnfPassword" value={formData.cnfPassword} onChange={formHandler} placeholder='Enter Confirm Password' />
                                        <div className='position-absolute' onClick={() => toggleButton("cnfPassword")} style={{ top: '54%', right: "10px", lineHeight: "0" }}>
                                            <span style={{ fontSize: "20px", cursor: "pointer" }}>{showPass.cnfPassword ? <IoEye /> : < IoEyeOff />}</span>
                                        </div>
                                    </div>
                                    <button className='btn btn-primary w-100 mt-4 mb-3' onClick={submitHandler}>Sign Up</button>
                                    <div className='d-flex justify-content-center'>
                                        <Link to="/">
                                            <a className='text-muted hover'>Click here if you already have an account</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 d-none d-lg-block'>
                                <div className="imgWidth">
                                    <img src={logo} alt='Illustration' style={{ width: "100%", }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Toast container for error/success messages */}
            <ToastContainer />
        </>
    );
};

export default Register;
