import axios from "axios";
import React, { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config/config";

const BusinessAttribute = () => {
    const baseUrl = Config.baseUrl;
    const [loading, setLoading] = useState(false);
    const [SubCategory, setSubCategory] = useState([]);
    const [attrData, setAttrData] = useState({
        businessCategoryAttributeId: 0,
        businessCategoryId: '',
        attributeName: [],
        status: 0,
        createdBy: 0
    })

    const getAllSubCategory = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/getAllBusinessCategory`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            })
            setSubCategory(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const formHandler = (e) => {
        const { name, value } = e.target;
        const attributeNameArray = value.split(',').map(attr => attr.trim());
        setAttrData({
            ...attrData,
            [name]: attributeNameArray
        });
    }

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setAttrData({
            ...attrData,
            [name]: value
        })
    }

    const addAttribute = async () => {
        setLoading(true);
        const { attributeName, businessCategoryId } = attrData;
        if (!attributeName || !businessCategoryId) {
            toast.error('All fields are required');
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios({
                url: `${baseUrl}/addBusinessAttribute`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ...attrData,
                    attributeName: attrData.attributeName.join(', ')
                }
            })
            toast.success(data);
            setLoading(false);
            setAttrData({
                businessCategoryId: '',
                attributeName: [],
            })
        } catch (error) {
            setLoading(false);
            console.log("Error ::>>", error);
        }
    }

    useEffect(() => {
        getAllSubCategory();
    }, [])

    return (
        <div className="conatiner">
            <ToastContainer />
            <div className="rows">
                <div className="col-lg-8 m-auto border bg-white p-4 boxShadow" style={{ borderRadius: "15px" }}>
                    <div className="d-flex justify-content-between gap-4">
                        <select className="form-select w-100" name="businessCategoryId" onChange={changeHandler} aria-label="Select Language">
                            <option selected value="" disabled>Choose Business Category</option>
                            {SubCategory.map((item, index) => (
                                <option value={item.businessCategoryId} key={index}>{item?.businessCategoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group mt-4'>
                        <div className='form-group d-flex align-items-center gap-2'>
                            <textarea class="form-control" id="exampleFormControlTextarea1" name="attributeName" value={attrData.attributeName} onChange={formHandler} placeholder="Enter here ..." rows="6"></textarea>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-primary text-capitalize" onClick={addAttribute} disabled={loading}>
                            {loading ? "please wait ..." : "Add Attribute"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BusinessAttribute;