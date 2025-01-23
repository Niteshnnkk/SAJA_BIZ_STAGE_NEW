import axios from "axios";
import React, { useEffect, useState } from "react";
import Config from "../config/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubCategory = () => {
    const baseUrl = Config.baseUrl;
    const [subCategory, setSubCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        "businessCategoryId": "",
        "businessSubCategoryName": "",
        "status": 1,
        "createdBy": 1,
        "createdAt": getCurrentDateTimeISO()
    });

    function getCurrentDateTimeISO() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    const getAllSubCategory = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/getAllBusinessCategory`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            setSubCategory(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const fetchSubCategory = async () => {
        setLoading(true);
        const { businessSubCategoryName, businessCategoryId } = formData;
        if (!businessSubCategoryName || !businessCategoryId) {
            toast.error('All fields are requireds');
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios({
                url: `${baseUrl}/saveSubBusinessCategory`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                data: formData
            });
            console.log("Response Data:", data);
            toast.success(data);
            setLoading(false);
            setFormData({
                businessCategoryId: "",
                businessSubCategoryName: "",
            })
        } catch (error) {
            setLoading(false);
            console.log("Error ::>>", error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        getAllSubCategory();
    }, []);

    return (
        <div className="conatiner mt-5">
            <ToastContainer />
            <div className="rows">
                <div className="col-lg-8 m-auto border bg-white p-4 boxShadow" style={{ borderRadius: "15px" }}>
                    <div className="d-flex justify-content-between gap-4">
                        <select className="form-select w-100" aria-label="Select Language" name="businessCategoryId" value={formData.businessCategoryId} onChange={handleInputChange}>
                            <option selected value='' disabled>Select Business Category</option>
                            {subCategory.map((item, index) => (
                                <option key={index} value={item.businessCategoryId}>{item.businessCategoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group mt-4'>
                        <div className='form-group d-flex align-items-center gap-2'>
                            <input type="text" className="form-control" placeholder="Enter Business Subcategory" name="businessSubCategoryName" value={formData.businessSubCategoryName} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-primary text-capitalize" onClick={fetchSubCategory} loading={loading}>
                            {loading ? 'Please wait...' : 'Save/Updates'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SubCategory;