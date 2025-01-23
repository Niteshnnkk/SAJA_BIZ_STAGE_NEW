import React from "react";
import { useLocation } from "react-router-dom";
import SAJA from ".././assets/Images/sajalogo.jpg";

export default function Sajaskythnakyou() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const message = queryParams.get("message");
  // alert(message);
  // console.log("message", message);
  return (
    <div className="bg-white">
      <div
        className="w-100 d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="">
          <div className="d-flex justify-content-center mt-5">
            <img src={SAJA} alt="Logo" className="w-25 m-3" />
          </div>
          <div>
            {status === "quota-meet" ? (
              <h3 className="text-bold text-center alert alert-success">
                Quota Meet!!!
                <br />
                {message}
              </h3>
            ) : status === "quota-exceed" ? (
              <h3 className="text-bold text-center alert alert-danger">
                Quota Exceeded!!!
                <br />
                {message}
              </h3>
            ) : (
              <h3 className="text-bold text-center">
                Your response has been recorded
              </h3>
            )}

            <h3 className="text-bold text-center">
              Thank you for completing this survey
            </h3>
            <p className="text-center m-0 p-0 mt-3">
              You can also easily create your own using
            </p>
            <p className="text-center">Saja !</p>
          </div>

          <div className="d-flex align-items-center">
            <input
              type="text"
              className="p-1"
              style={{ width: "300px" }}
              placeholder="your email address"
            />
            <span
              className=""
              style={{
                background: "blue",
                width: "150px",
                textAlign: "center",
                color: "white",
                padding: "6px",
              }}
            >
              Sign up for free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
