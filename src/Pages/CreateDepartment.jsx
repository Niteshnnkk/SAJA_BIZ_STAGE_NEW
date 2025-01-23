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
import { RxCross2 } from "react-icons/rx";
import Select from 'react-select'

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

const CreateDepartment = () => {
    const baseUrl = Config.baseUrl;
    const [itemPerPage] = useState(10);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [departmentData, setdepartmentData] = useState([]);
    const navigate = useNavigate();
    const currentPage = parseInt(query.get('page') || '1', 10);
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItem = departmentData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(departmentData.length / itemPerPage);
    const [loading, setLoading] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = useState({
        departmentId: 0,
        departmentName: "",
        departmentType: "",
        status: "",
        createdDate: new Date().toISOString(),
    });

    const AddDepartment = async () => {
        setLoading(true);
        try {
            if (!formData.departmentName || !formData.departmentType || formData.status === "") {
                toast.error("all field are requried ...!");
                setLoading(false);
                return;
            }
            const { data } = await axios({
                url: `${baseUrl}/api/departments`,
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
            setFormData({
                departmentName: "",
                departmentType: "",
                status: "",
            })
            getAllDepartment();
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
            [name]: value,
        }));
    };

    const getAllDepartment = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/departments`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (Array.isArray) {
                setdepartmentData(data);
            }
        } catch (error) {
            console.error("Error ::>>", error);
        }
    };

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`);
    };

    const deleteDepartment = async (id) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/departments/${id}`,
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            getAllDepartment();
            toast.success(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const getAllDepartmentById = async (id) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/departments/${id}`,
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
                url: `${baseUrl}/api/departments`,
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ...formData
                },
            });
            toast.success(data);
            getAllDepartment();
            setLoading(false);
            setFormData({
                departmentId: 0,
                departmentName: "",
                departmentType: "",
                status: "",
                createdDate: new Date().toISOString(),
            });
        } catch (error) {
            toast.error("Failed to update the department!");
            setLoading(false);
            console.error("Error updating department:", error);
        }
    };

    const handleClickOpen = (id) => {
        setSelectedDepartmentId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getAllDepartment();
    }, []);

    const [selectValue, setSelectValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const filterData = (selectedOption) => {
        if (selectedOption?.value === "none") {
            setSelectValue(null);
            setFilteredData(departmentData);
        } else {
            setSelectValue(selectedOption);
            const selectedDepartment = selectedOption ? selectedOption.value : "";
            const filtered = departmentData.filter((item) => item.departmentName === selectedDepartment);
            setFilteredData(filtered);
        }
    };

    const options = [
        { value: 1, label: 'Active' },
        { value: 0, label: 'In-Active' }
    ];

    return (
        <div className="container mb-5">
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText className='pb-0'>
                        <p> Are you sure you want to delete this item?</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <p className="position-absolute" onClick={() => { handleClose() }} style={{ cursor: "pointer", top: "5px", right: "5px", lineHeight: "0px", fontSize: "18px" }}>
                        <RxCross2 />
                    </p>
                    <button className="btn btn-danger px-3" onClick={() => { handleClose(); deleteDepartment(selectedDepartmentId) }} style={{ borderRadius: "100px" }}>
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
            <div className="row">
                <div className="col-lg-11 m-auto">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2 align-items-center">
                            <div style={{ borderLeft: "3px solid #0066ff", height: "25px" }}></div>
                            <h4 className="text-primary m-0 fw-bold">PKLI Department</h4>
                        </div>
                        <div className="col-lg-4 mb-1">
                            {/* <select className="form-select" value={selectValue} onChange={filterData}>
                                <option value="" selected disabled>Select Department</option>
                                {departmentData?.map((item, index) => (
                                    <option key={index} value={item?.departmentName}>
                                        {item?.departmentName}
                                    </option>
                                ))}
                            </select> */}

                            <Select
                                options={[
                                    { value: "none", label: "Select None" }, 
                                    ...departmentData.map((item) => ({
                                        value: item.departmentName,
                                        label: item.departmentName,
                                    }))
                                ]}
                                value={selectValue} 
                                onChange={filterData}  
                                placeholder="Select Department"
                            />
                        </div>
                    </div>
                    <div className="formData p-4 bg-white mt-2" style={{ borderRadius: "15px", boxShadow: "0 0 10px #0002" }}>
                        <div className="d-flex gap-3 justify-content-between">
                            <div className="form-group w-100">
                                <input type="text" placeholder="Enter Department Name" name="departmentName" onChange={handleChange} className="form-control" value={formData.departmentName} />
                            </div>
                            <div className="form-group w-100">
                                <input type="text" placeholder="Enter Department Type" name="departmentType" onChange={handleChange} className="form-control" value={formData.departmentType} />
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

                            <div className="">
                                {formData?.departmentId ? (
                                    <button className="btn btn-primary" onClick={updateHandler} disabled={loading}>
                                        {loading ? 'Please wait...' : 'Update'}
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={AddDepartment} disabled={loading}>
                                        {loading ? 'Please wait...' : 'Save'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <table className="tableData table table-bordered table-hover m-0 mt-3">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Department Name</th>
                                    <th>Department Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectValue ? filteredData : currentItem)?.length > 0 ? (
                                    (selectValue ? filteredData : currentItem)?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{item?.departmentName ? item.departmentName : 'N/A'}</td>
                                            <td>{item?.departmentType ? item.departmentType : 'N/A'}</td>
                                            <td>
                                                <div className="d-flex gap-2 justify-content-center align-items-center">
                                                    <FaEdit className="text-danger fw-bold" onClick={() => getAllDepartmentById(item.departmentId)} style={{ cursor: "pointer" }} />
                                                    <MdDelete className="text-danger fw-bold" style={{ cursor: "pointer" }} onClick={() => handleClickOpen(item.departmentId)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4 fs-5">
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

export default CreateDepartment;
