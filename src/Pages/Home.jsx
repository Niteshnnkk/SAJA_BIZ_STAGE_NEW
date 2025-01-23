import React from "react";
import img from '../assets/Images/1.png'

export default function Home() {
    return (
        <div className="d-flex mb-5">
            <div className="content p-4 pt-0 d-flex gap-4 flex-column m-auto" style={{ width: '78%' }}>
                <div className="text-muted text-center">
                    <p className="fs-5 m-0">Welcome Nisar Ahmed. It is good to see you again!</p>
                    <p className="fs-5 m-0">
                        Your last activity was October 13, 2024 01:35
                    </p>
                </div>
                <div className="text-center m-auto" style={{ width: "60%" }}>
                    <img src={img} className="w-100" />
                </div>
            </div>
        </div>
    );
}
