import axios from "axios";
import Config from "../config/config";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Button, Dialog, DialogActions } from '@mui/material';
import React from "react";
import Select from 'react-select'
import { RxCross2 } from "react-icons/rx";

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

const CreatePhysician = () => {
    const baseUrl = Config.baseUrl;
    const [itemPerPage] = useState(10);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [physicianData, setphysicianData] = useState([]);
    const navigate = useNavigate();
    const currentPage = parseInt(query.get('page') || '1', 10);
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItem = physicianData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(physicianData.length / itemPerPage);
    const [loading, setLoading] = useState(false);
    const [selectedPhycianId, setSelectedPhycianId] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [department, setdepartment] = useState([]);

    const [formData, setFormData] = useState({
        pkliPhysicianId: 0,
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        departmentId: 0,
        status: "",
        createdBy: new Date().toISOString()
    });

    const getDepartments = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/departments`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (Array.isArray) {
                setdepartment(data);
            }
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const AddDepartment = async () => {
        setLoading(true);
        try {
            console.log("FormData :::>", formData);
            if (!formData.firstName || !formData.lastName || !formData.mobile || !formData.email || !formData.departmentId || formData.status === "") {
                toast.error("all fields are requried ...!");
                setLoading(false);
                return;
            }
            const { data } = await axios({
                url: `${baseUrl}/api/physicians`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ...formData,
                }
            });
            toast.success(data);
            setLoading(false);
            getAllPhyciansData();
            setFormData({
                firstName: "",
                lastName: "",
                mobile: "",
                email: "",
                departmentId: "",
                status: ""
            })
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            setLoading(false)
            console.error("Error adding department:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === "status" ? (value === "Active" ? 1 : value === "In-Active" ? 0 : "") : value,
        }));
    };

    const getAllPhyciansData = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/physicians`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (Array.isArray) {
                setphysicianData(data);
            }
        } catch (error) {
            console.error("Error ::>>", error);
        }
    };

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`);
    };

    const deletDePhycians = async (id) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/physicians/${id}`,
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            getAllPhyciansData();
            toast.success(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const getAllPhyciansDataById = async (id) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/physicians/${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setFormData(data);
        } catch (error) {
            console.error("Error fetching department by ID:", error);
        }
    };

    const updateHandler = async () => {
        setLoading(true);
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/physicians`,
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ...formData
                }
            });
            toast.success(data);
            getAllPhyciansData();
            setLoading(false);
            setFormData({
                pkliPhysicianId: 0,
                firstName: "",
                lastName: "",
                mobile: "",
                email: "",
                departmentId: "",
                status: "",
            });
        } catch (error) {
            toast.error("Failed to update the department!");
            setLoading(false);
            console.error("Error updating department:", error);
        }
    };

    const handleClickOpen = (id) => {
        setSelectedPhycianId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getAllPhyciansData();
        getDepartments();
    }, []);

    const options = [
        { value: 1, label: 'Active' },
        { value: 0, label: 'In-Active' }
    ];

    const [selectValue, setSelectValue] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const filterData = (selectedOption) => {
        if (selectedOption?.value === "none") {
            setSelectValue(null);
            setFilteredData(physicianData);
        } else {
            setSelectValue(selectedOption);
            const selectedEmail = selectedOption ? selectedOption.value : "";
            const filtered = physicianData.filter((item) => item.email === selectedEmail);
            setFilteredData(filtered);
        }
    };

    return (
        <div className="container mb-5">
            <Dialog className=""
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText className='pb-0'>
                        <p>Are you sure you want to delete this item?</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <p className="position-absolute" onClick={() => { handleClose() }} style={{ cursor: "pointer", top: "5px", right: "5px", lineHeight: "0px", fontSize: "18px" }}>
                        <RxCross2 />
                    </p>
                    <button className="btn btn-danger px-3" onClick={() => { handleClose(); deletDePhycians(selectedPhycianId) }} style={{ borderRadius: "100px" }}>
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
            <div className="row">
                <div className="col-lg-12 m-auto">
                    <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex gap-2 align-items-center">
                            <div style={{ borderLeft: "3px solid #0066ff", height: "25px" }}></div>
                            <h4 className="text-primary m-0 fw-bold">PKLI Physician Details</h4>
                        </div>

                        <div className="col-lg-4 mb-1">
                            <Select
                                options={[
                                    { value: "none", label: "Select None" },
                                    ...physicianData.map((item) => ({
                                        value: item.email,
                                        label: item.email,
                                    }))
                                ]}
                                value={selectValue}
                                onChange={filterData}
                                placeholder="Select Physician"
                            />
                        </div>
                    </div>

                    <div className="formData p-4 bg-white mt-2" style={{ borderRadius: "15px", boxShadow: "0 0 10px #0002" }}>
                        <div className="d-flex gap-3 justify-content-between">
                            <div className="form-group w-100">
                                <input type="text" placeholder="Enter firstName" name="firstName" onChange={handleChange} className="form-control" value={formData.firstName} />
                            </div>
                            <div className="form-group w-100">
                                <input type="text" placeholder="Enter lastName" name="lastName" onChange={handleChange} className="form-control" value={formData.lastName} />
                            </div>
                            <div className="form-group w-100">
                                <input type="text" placeholder="Enter mobile" name="mobile" onChange={handleChange} className="form-control" value={formData.mobile} />
                            </div>
                        </div>

                        <div className="d-flex gap-4 mt-3">
                            <div className="form-group w-100">
                                <input type="text" placeholder="Enter Email" name="email" onChange={handleChange} className="form-control" value={formData.email} />
                            </div>
                            <div className="form-group w-100">
                                <select className="form-select" name="departmentId" value={formData.departmentId} onChange={handleChange}>
                                    <option selected value="">Choose Department</option>
                                    {department?.map((departmentItem, index) => (
                                        <option value={departmentItem?.departmentId}>{departmentItem?.departmentName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group w-100">
                                <Select
                                    options={options}
                                    value={options.find(option => option.value === formData.status) || null}
                                    onChange={(selectedOption) =>
                                        setFormData(prevState => ({
                                            ...prevState,
                                            status: selectedOption ? selectedOption.value : "",
                                        }))
                                    }
                                    placeholder="Select Status"
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <div>
                                {formData?.pkliPhysicianId ? (
                                    <button className="btn btn-primary" onClick={updateHandler} disabled={loading} style={{ width: "fit-content" }}>
                                        {loading ? 'Please wait...' : 'Update'}
                                    </button>
                                ) : (
                                    <button className="btn btn-primary px-3" onClick={AddDepartment} disabled={loading} style={{ width: "fit-content" }}>
                                        {loading ? 'Please wait...' : 'Save'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <table className="tableData table table-bordered table-hover m-0 mt-3">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Mobile Number</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectValue ? filterData : currentItem)?.length > 0 ? (
                                    (selectValue ? filteredData : currentItem)?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{item?.firstName ? item?.firstName : 'N/A'}</td>
                                            <td>{item?.lastName ? item?.lastName : 'N/A'}</td>
                                            <td>{item?.mobile ? item?.mobile : "N/A"}</td>
                                            <td>{item?.email ? item?.email : "N/A"}</td>
                                            <td>
                                                <div className="d-flex gap-2 justify-content-center align-items-baseline">
                                                    <FaEdit className="text-danger fw-bold" onClick={() => getAllPhyciansDataById(item.pkliPhysicianId)} style={{ cursor: "pointer" }} />
                                                    <MdDelete className="text-danger fw-bold" style={{ cursor: "pointer" }} onClick={() => handleClickOpen(item.pkliPhysicianId)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4 fs-5">
                                            Oops Data not found ...!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className='d-flex justify-content-end gap-1 mb-0 mt-3'>
                            <Pagination
                                count={totalPage}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePhysician;
