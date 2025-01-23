import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Config from "../config/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BusinessCategory = () => {
    const baseUrl = Config.baseUrl;
    const [language, setLanguge] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [CategoryData, setCategoryData] = useState({
            businessCategoryName: "",
            businessCategoryId: 0,
            languageId: "",
            status: 1,
            createdBy: 1,
            createdAt: getCurrentDateTimeISO(),
            updatedBy: 2,
            updatedAt: getCurrentDateTimeISO(),
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

    const getAllLanguage = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/getLanguage`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setLanguge(data);
        } catch (error) {
            setLanguge('');
            console.log("Error ::>>", error);
        }
    }

    const formChangeHandler = (e) => {
        const { name, value } = e.target;
        setCategoryData({
            ...CategoryData,
            [name]: value
        })
    }

    const fetchBusinessCategory = async () => {
        setLoading(true);
        const { businessCategoryName, languageId } = CategoryData;
        if (businessCategoryName && languageId) {
            try {
                const { data } = await axios({
                    url: `${baseUrl}/saveBusinessCategory`,
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        ...CategoryData,
                    }
                })
                setLoading(false);
                setCategoryData(data);
                toast.success(data);
                getAllCategory();
                setCategoryData({
                    businessCategoryName: '',
                    languageId: ''
                });
            } catch (error) {
                setLoading(false);
            }
        } else {
            toast.error('All fields are required');
            setLoading(false);
        }
    }

    const getAllCategory = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/getAllBusinessCategory`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            })
            setCategoryList(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const getBusinessCategoryById = async (languageId) => {
        try {
            const { data } = await axios.get(`${baseUrl}/getBusinessCategoryByLangId/${languageId}`)
            setCategoryData({
                businessCategoryName: data[0].businessCategoryName,
                businessCategoryId: data[0].businessCategoryId,
            })
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const updateHandler = async () => {
        try {
            const { businessCategoryId, businessCategoryName } = CategoryData;
            const categoryName = businessCategoryName.replace(/\s+/g, '');
            const { data } = await axios({
                url: `${baseUrl}/updateBusinessCategory/${businessCategoryId}?businessCategoryName=${categoryName}`,
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast.success(data);
            getAllCategory();
            setCategoryData({
                businessCategoryName: '',
                businessCategoryId: '',
            })
        } catch (error) {
            console.log("Error ::>>", error);
        }
    };

    useEffect(() => {
        getAllLanguage();
        getAllCategory();
    }, []);

    return (
        <div className="container mb-5">
            <ToastContainer />
            <div className="row mb-3 align-items-center">
                <div className="col-lg-11 m-auto border bg-white boxShadow p-4" style={{ borderRadius: "15px" }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="col-lg-4 p-0">
                            <select className="form-select" aria-label="Select Language" name="languageId" value={CategoryData.languageId} onChange={formChangeHandler}>
                                <option value='' selected disabled>Select Language</option>
                                {language.map((item, index) => (
                                    <option key={index} value={item.languageMasterId}>{item.languageLabel}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-4 p-0">
                            <input type="text" className="form-control" name="businessCategoryName" value={CategoryData.businessCategoryName} onChange={formChangeHandler} placeholder="Business Category Name" />
                        </div>
                        <div className="">
                            {CategoryData.businessCategoryId ? (
                                <button className="btn btn-primary" onClick={updateHandler} disabled={loading}>
                                    {loading ? 'Please wait...' : 'Update'}
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={fetchBusinessCategory} disabled={loading}>
                                    {loading ? 'Please wait...' : 'Save'}
                                </button>
                            )}
                        </div>
                    </div>
                    <table className="table table-bordered text-center mt-3">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Language</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.businessCategoryName ? item?.businessCategoryName : "N/A"}</td>
                                    <td>{language.filter(lang => lang.languageMasterId == item.languageId)[0]?.languageLabel || "N/A"}</td>
                                    <td>{item.status}</td>
                                    <td className="text-center d-flex justify-content-center gap-3">
                                        <span className="fontSize" onClick={() => getBusinessCategoryById(item.languageId)}><FaRegEdit /></span>
                                        <span className="text-danger fontSize"><MdDeleteForever /></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BusinessCategory;
