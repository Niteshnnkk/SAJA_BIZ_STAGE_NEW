import React, { useEffect, useState } from "react";
import axios from 'axios';
import Config from '../config/config';
import { containerClasses } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CustomerDatabase = () => {
    const baseUrl = Config.baseUrl;
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [CustomerDetailsModal, setCustomerDetailsModal] = useState(false);
    const [showFileModal, setFileModal] = useState(false);
    const [searchContact, setSearchContact] = useState([]);
    const [selectedContact, setSelectedContact] = useState("");
    const [customerData, setCustomerData] = useState([]);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        cId: 0,
        cName: "",
        cPhone: "",
        cEmail: "",
        createdOn: new Date().toISOString()
    })

    const getAllContact = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/customers`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setSearchContact(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const addPhoneHandler = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/customers`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    ...formData,
                }
            })
            getAllContact();
            toast.success(data);
            setFormData({
                cId: 0,
                cName: "",
                cPhone: "",
                cEmail: "",
                createdOn: new Date().toISOString()
            });
        } catch (error) {
            toast.error(error);
            console.log("Error ::>>", error);
        }
    }

    const formChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const getCustomerById = async (cId) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/customers/${cId}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setCustomerData(data);
            customerData(null);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const selectHandler = (e) => {
        const selectedCId = e.target.value;
        setSelectedContact(selectedCId);
        getCustomerById(selectedCId);
    }

    useEffect(() => {
        getAllContact();
    }, [])

    const uploadExcelFile = async () => {
        try {
            if (!file) {
                toast.error("No file selected!");
                return;
            }
            const fileData = new FormData();
            fileData.append("file", file);
            const { data } = await axios({
                url: `${baseUrl}/api/customers/upload`,
                method: 'POST',
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: fileData,
            });
            toast.success(data);
            setFile(null);
        } catch (error) {
            console.error("Error ::>>", error);
        }
    };

    const fileChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const worksheetData = [
        ["S.No", "Customer Name", "Customer Phone Number", "Customer Email"]
    ];

    const downloadExcelFile = () => {
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Sample_Customer_Details.xlsx");
    };

    const handleOpenPhoneModal = () => {
        setShowPhoneModal(true);
    };

    const handleClosePhoneModal = () => {
        setShowPhoneModal(false);
    };

    const handleOpenEmailModal = () => {
        setShowEmailModal(true);
    };

    const handleCloseEmailModal = () => {
        setShowEmailModal(false);
    };

    const handleOpenCustomerModal = () => {
        if(selectedContact){
            setCustomerDetailsModal(true);
            setSelectedContact("");
            return;
        }
        toast.error('Please select the contact!');
    };

    const handleCloseCustomerModal = () => {
        setCustomerDetailsModal(false);
    };

    const handleOpenFileModal = () => {
        setFileModal(true);
    };

    const handleCloseFileModal = () => {
        setFileModal(false);
    };

    return (
        <div className="container mb-5">
            <ToastContainer />
            <div className="form-container shadow p-5 rounded rounded-4 bg-white col-lg-11 m-auto">
                <div>
                    <div className="border"></div>
                    <div className="form-group d-flex mt-2 gap-3 align-items-center justify-content-between">
                        <div style={{ width: "33.3%" }}>
                            <label>Search Contact</label>
                        </div>
                        <div style={{ width: "50%" }}>
                            <select className="form-select" onChange={selectHandler} value={selectedContact}>
                                <option selected disabled value="">--- Select Contact ---</option>
                                {searchContact.map((item, index) => (
                                    <option key={index} value={item?.cId}>{item?.cName}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ width: "17%" }}>
                            <button className="btn btn-primary w-100" onClick={handleOpenCustomerModal} style={{ borderRadius: "100px" }}>Go</button>
                        </div>

                        {/* Customer Details Modal */}
                        {CustomerDetailsModal && (
                            <div className="modal-overlay">
                                <div className="modal-dialog bg-white">
                                    <div className="modal-content pb-3 pt-3 px-4" style={{ width: "500px" }}>
                                        <div className="modal-header justify-content-between">
                                            <h5 className="modal-title text-primary fw-bold fs-5">Customer Detail</h5>
                                            <button type="button" className="btn-close" onClick={handleCloseCustomerModal} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="border mt-0"></div>
                                            <div className="mb-2 mt-2">
                                                <strong className="form-label col-lg-3">
                                                    Name : <span>{customerData?.cName}</span>
                                                </strong>
                                            </div>
                                            <div className="border mt-0"></div>
                                            <div className="mt-2 mb-2">
                                                <strong className="form-label col-lg-4">
                                                    Phone Number : <span>{customerData?.cPhone}</span>
                                                </strong>
                                            </div>
                                            <div className="border mt-0"></div>
                                            <div className="mt-2 mb-0">
                                                <strong className="form-label col-lg-2">
                                                    Email : <span>{customerData?.cEmail}</span>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Phone Number */}
                    <div className="border mt-2"></div>
                    <div className="form-group d-flex mt-2 gap-3 align-items-center justify-content-between">
                        <div style={{ width: "33.3%" }}>
                            <label>Add Phone Number</label>
                        </div>
                        <div style={{ width: "50%" }}>
                            <button className="btn btn-primary w-100" style={{ borderRadius: "100px" }} onClick={handleOpenPhoneModal}>Go</button>
                        </div>
                        <div style={{ width: "17%" }}></div>
                    </div>

                    {/* Phone Modal */}
                    {showPhoneModal && (
                        <div className="modal-overlay">
                            <div className="modal-dialog bg-white">
                                <div className="modal-content pb-3 pt-3 px-4" style={{ width: "500px" }}>
                                    <div className="modal-header justify-content-between mb-3">
                                        <h5 className="modal-title text-primary fw-bold fs-5">Add Phone Number</h5>
                                        <button type="button" className="btn-close" onClick={handleClosePhoneModal} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3 d-flex">
                                            <label htmlFor="customerName" className="form-label col-lg-3">Name:</label>
                                            <input type="text" className="form-control modalTextfield" name="cName" onChange={formChangeHandler} placeholder="Enter customer name" />
                                        </div>
                                        <div className="mb-3 d-flex">
                                            <label htmlFor="phoneNumber" className="form-label col-lg-3">Phone Number:</label>
                                            <input type="text" className="form-control modalTextfield" name="cPhone" onChange={formChangeHandler} placeholder="Enter customer number" />
                                        </div>
                                        <div className="m-auto" style={{ width: "fit-content" }}>
                                            <button className="btn btn-primary mx-auto px-4 p-1 m-auto" onClick={() => { handleClosePhoneModal(); addPhoneHandler() }} style={{ borderRadius: "100px" }}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border mt-2"></div>
                    <div className="form-group d-flex mt-2 gap-3 align-items-center justify-content-between">
                        <div style={{ width: "33.3%" }}>
                            <label>Add Email</label>
                        </div>
                        <div style={{ width: "50%" }}>
                            <button className="btn btn-primary w-100" style={{ borderRadius: "100px" }} onClick={handleOpenEmailModal}>Go</button>
                        </div>
                        <div style={{ width: "17%" }}></div>
                    </div>

                    {/* Email Modal */}
                    {showEmailModal && (
                        <div className="modal-overlay">
                            <div className="modal-dialog bg-white">
                                <div className="modal-content pb-3 pt-3 px-4" style={{ width: "500px" }}>
                                    <div className="modal-header justify-content-between mb-3">
                                        <h5 className="modal-title text-primary fw-bold fs-5">Add Email</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseEmailModal} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3 d-flex">
                                            <label htmlFor="fullName" className="form-label col-lg-3">Name:</label>
                                            <input type="text" className="form-control modalTextfield" name="cName" onChange={formChangeHandler} placeholder="Enter full name" />
                                        </div>
                                        <div className="mb-3 d-flex">
                                            <label htmlFor="emailAddress" className="form-label col-lg-3">Email</label>
                                            <input type="email" className="form-control modalTextfield" name="cEmail" onChange={formChangeHandler} placeholder="Enter email address" />
                                        </div>
                                        <div className="m-auto" style={{ width: "fit-content" }}>
                                            <button className="btn btn-primary mx-auto px-4 p-1 m-auto" onClick={() => { handleCloseEmailModal(); addPhoneHandler() }} style={{ borderRadius: "100px" }}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border mt-2"></div>
                    <div className="form-group d-flex mt-2 gap-3 align-items-center justify-content-between">
                        <div style={{ width: "33.3%" }}>
                            <label>Add Database</label>
                        </div>
                        <div style={{ width: "50%" }}>
                            <button className="btn btn-primary w-100" onClick={downloadExcelFile} style={{ borderRadius: "100px" }}>Download Sample Database</button>
                        </div>
                        <div style={{ width: "17%" }}>
                            <button onClick={handleOpenFileModal} className="btn btn-primary w-100" style={{ borderRadius: "100px" }}>Upload</button>
                        </div>

                        {/* Email Modal */}
                        {showFileModal && (
                            <div className="modal-overlay">
                                <div className="modal-dialog bg-white">
                                    <div className="modal-content pb-3 pt-3 px-4" style={{ width: "500px" }}>
                                        <div className="modal-header justify-content-between mb-3">
                                            <h5 className="modal-title text-primary fw-bold fs-5">Upload Excel</h5>
                                            <button type="button" className="btn-close" onClick={handleCloseFileModal} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3 d-flex">
                                                <strong htmlFor="fullName" className="form-label col-lg-2">Upload : </strong>
                                                <input type="file" className="form-control modalTextfield" name="file" onChange={fileChangeHandler} />
                                            </div>
                                            <div className="m-auto" style={{ width: "fit-content" }}>
                                                <button className="btn btn-primary mx-auto px-4 p-1 m-auto" onClick={() => { handleCloseFileModal(); uploadExcelFile() }} style={{ borderRadius: "100px" }}>Upload</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDatabase;
