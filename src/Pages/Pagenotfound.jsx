import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: '100vh' }}>
            <h1 className="fw-bold">404 - Page Not Found</h1>
            <p style={{fontSize: "18px"}}>Sorry, the page you're looking for does not exist.</p>
           <button className="btn btn-primary text-white"><Link className="text-white fw-bold" to="/home">Go to Home</Link></button>
        </div>
    );
};

export default NotFound;
