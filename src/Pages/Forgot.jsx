import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Images/login.png';

const Forgot = () => {
    return (
        <section className='p-0' style={{ background: "#f2f2f2", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className='container'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <div className='col-lg-8 d-flex align-items-center bg-white custom-box'>
                        <div className='col-lg-6 col-md-12 p-4'>
                            <h3 className='text-center mb-4'>Forgot Password</h3>
                            <div className='formlayout'>
                                <div className='form-group mb-3'>
                                    <label>Enter Your Email <span className='text-danger fw-bold'>*</span></label>
                                    <input type='text' className='form-control' placeholder='Enter Email' />
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <Link to="/" className='text-muted hover text-center'>Back to sign In</Link>
                                </div>
                                <button className='btn btn-primary w-100 mt-3 mb-3'>Reset Password</button>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <Link to="/signup" className='text-muted text-center'>Click here if you want to create account</Link>
                            </div>
                        </div>
                        <div className='col-lg-6 d-none d-lg-block'>
                            <div className='imgWidth pt-4 pb-4'>
                            <img src={logo} alt='Illustration' style={{ width: "100%", }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Forgot;
