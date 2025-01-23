import axios from "axios";
import React, { useEffect, useState } from "react";
import Config from "../config/config";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const baseUrl = Config.baseUrl;
    const [userData, setUserData] = useState();

    const getUserById = async (userId) => {
        try {
            const { data } = await axios.get(`${baseUrl}/getUserById?userId=${userId}`, {
                headers: { "Content-Type": "application/json" }
            });
            setUserData(data);
        } catch (error) {
            console.log("Error fetching user data ::>>", error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getUserById(userId);
        }
    }, []);

    return (
        <div className="mb-5" style={styles.card}>
            <div style={styles.header}>
                <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="m-0" style={styles.title}>User Profile</h3>
                        <Link to={`/edit-profile/${userData?.userId}`}>
                            <span className="fw-bold text-dark" style={styles.edit}>Edit</span>
                        </Link>
                    </div>
                    <div className="mt-3" style={{ width: "60px", height: "60px", border: "1px solid #555555", borderRadius: "100%" }}>
                        <img
                            className="w-100 h-100"
                            src={userData && userData.profileImagePath ? `${baseUrl}${userData.profileImagePath}` : "path-to-default-image.png"}
                            alt="Profile"
                            style={styles.qrImage}
                        />
                    </div>
                </div>
            </div>
            <div style={styles.content}>
                {userData ? (
                    <div style={styles.info}>
                        <p><strong>Name :</strong> {userData.firstName} {userData.lastName}</p>
                        <p><strong>Email :</strong> {userData.email}</p>
                        <p><strong>Phone :</strong> {userData.phone}</p>
                        <p><strong>Position :</strong> {userData.position || "N/A"}</p>
                        <p className="mb-0"><strong>Company :</strong> {userData.companyName}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: {
        maxWidth: "650px",
        margin: "auto",
        padding: "35px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        fontSize: "1.3rem",
        fontWeight: "bold",
        color: "#333",
    },
    edit: {
        fontSize: "0.9rem",
        color: "#888",
        cursor: "pointer",
    },
    content: {
        display: "flex",
        alignItems: "center",
    },
    qrImage: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
    },
    info: {
        lineHeight: "1.6",
    },
};

export default UserProfile;
