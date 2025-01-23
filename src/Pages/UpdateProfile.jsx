import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Config from '../config/config';
import { useParams } from 'react-router-dom';

const EditProfile = () => {
    const baseUrl = Config.baseUrl;
    const { id: userId } = useParams();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        code: '',
        lastlogin: '',
        profileImagePath: ''
    });

    const getUserById = async () => {
        try {

            const { data } = await axios({
                method: 'GET',
                url: `${baseUrl}/getUserById?userId=${userId}`,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setUser(data);
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    const [loading, setLoading] = useState(false);
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { data } = await axios({
                url: `${baseUrl}/updateUser`,
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    ...user,
                }
            })
            setLoading(false);
        } catch (error) {
            setLoading(false)
            console.log("Error ::>>", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    useEffect(() => {
        if (userId) {
            getUserById();
        }
    }, [userId]);

    return (
        <div style={styles.profileCard}>
            <h4 style={styles.header}>Update Profile</h4>
            <form className='mt-3'>
                <div className='d-flex gap-3'>
                    <div className='w-50' style={styles.formGroup}>
                        <label style={styles.label}>First Name</label>
                        <input style={styles.input} type="text" className='form-control' placeholder='Enter First Name' name='firstName' value={user.firstName} onChange={handleChange} />
                    </div>
                    <div className='w-50' style={styles.formGroup}>
                        <label style={styles.label}>Last Name</label>
                        <input style={styles.input} className='form-control' type="text" placeholder='Enter Last Name' name='lastName' value={user.lastName} onChange={handleChange} />
                    </div>
                </div>

                <div className='d-flex gap-3'>
                    <div className='w-50' style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input style={styles.input} type="email" className='form-control' placeholder='Enter Your Email' name='email' value={user.email} onChange={handleChange} />
                    </div>
                    <div className='w-50' style={styles.formGroup}>
                        <label style={styles.label}>Phone</label>
                        <input style={styles.input} className='form-control' type="text" placeholder='Enter Your Mobile' name='phone' value={user.phone} onChange={handleChange} />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Company Name</label>
                    <input style={styles.input} className='form-control' type="text" placeholder='Enter Your Company' name='companyName' value={user.companyName} onChange={handleChange} />
                </div>
                <button className='mt-3' style={styles.updateButton} onClick={handleUpdate} disabled={loading}>
                    {loading ? "Please wait..." : "Update"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    profileCard: {
        width: '650px',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        margin: '0 auto',
        fontWeight: '600'
    },
    header: {
        textAlign: 'center',
        color: '#333',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        fontWeight: "unset"
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1em',
    },
    updateButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        border: 'none',
        color: 'white',
        fontSize: '1em',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default EditProfile;
