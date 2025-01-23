import axios from "axios";
import { useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config/config";
import uploadImg from "../../src/assets/Images/img_upload_icon.png";
import placeholder from "../../src/assets/Images/placeholder.png";
import { useNavigate } from "react-router-dom";

const PkliSurvey = () => {
    const baseUrl = Config.baseUrl;
    const navigate = useNavigate()
    const maxSize = 150 * 1024;
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        id: 0,
        userId: 0, 
        pkliLogo: "",
        branch: "",
        language: "",
        date: "",
        updateTime: new Date().toISOString(),
        createdTime: new Date().toISOString(),
        status: 1,
    });

    const savepkliSurvey = async () => {
        console.log("Final FormData Before Submit:", formData); 
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/pkli/addSurvey`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: formData,
            });
            toast.success(data);
            navigate('/Pkli-manage-survey');
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to launch survey.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.size > maxSize) {
            toast.error("File size should not exceed 150KB");
            fileInputRef.current.value = '';
            return;
        }
        if (selectedFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedFile);
            try {
                const { data } = await axios({
                    url: `${baseUrl}/api/files/upload`,
                    method: 'POST',
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    data: uploadFormData,
                });
                console.log("Upload Response:", data); 
                setPreview(URL.createObjectURL(selectedFile));
                setFormData((prevData) => ({
                    ...prevData,
                    pkliLogo: data, 
                }));
                toast.success("File uploaded successfully!");
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error("Failed to upload file. Please try again.");
            }
        }
    };
    
    const fileDelete = () => {
        setPreview(null);
        setFormData((prevData) => ({
            ...prevData,
            pkliLogo: "",
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast.success("Image deleted successfully!");
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-lg-10 mx-auto">
                    <div className="d-flex gap-2 align-items-center mb-3">
                        <div style={{ borderLeft: "3px solid #0066ff", height: "22px" }}></div>
                        <h5 className="m-0" style={{ color: "#0066ff" }}>PKLI Survey Builder</h5>
                    </div>
                    <div className="formDiv bg-white mt-3 p-4 px-5" style={{ boxShadow: "0 0 10px #0003", borderRadius: "15px" }}>
                        <div className="row mb-3 align-items-center">
                            <label className="col-lg-4 m-0">Business Logo <span className="fw-bold text-danger">*</span></label>
                            <div className="col-lg-8 d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                    <input type="file" className="form-control d-none" ref={fileInputRef} onChange={handleFileChange} />
                                    <div className="d-flex gap-2 align-items-center" style={{ cursor: "pointer" }} onClick={handleButtonClick}>
                                        <img src={uploadImg} alt="Upload" style={{ objectFit: "contain", width: "35px", height: "35px" }} />
                                        <span style={{ fontSize: "13px" }}>Maximum size should be 150kb.</span>
                                    </div>
                                </div>
                                <div className="position-relative" style={{ width: '40px', height: '40px', border: "1px solid #ddd", borderRadius: "50%" }}>
                                    {preview ? (
                                        <div>
                                            <img src={preview} alt="Preview" className="w-100 h-100 rounded-circle" />
                                            <span
                                                onClick={fileDelete}
                                                className="position-absolute top-0 start-100 translate-middle"
                                                style={{ fontWeight: '600', color: "red", cursor: "pointer" }}
                                            >x</span>
                                        </div>
                                    ) : (
                                        <img src={placeholder} alt="Placeholder" className="w-100 h-100 rounded-circle" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <label className="col-lg-4">Branch <span className="text-danger fw-bold">*</span></label>
                            <div className="col-lg-8">
                                <input
                                    type="text"
                                    name="branch"
                                    placeholder="Write a branch"
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <label className="col-lg-4">Choose Language <span className="text-danger fw-bold">*</span></label>
                            <div className="col-lg-8">
                                <select
                                    name="language"
                                    className="form-select"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                >
                                    <option value="" disabled>---Choose Language---</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <label className="col-lg-4">Date <span className="text-danger fw-bold">*</span></label>
                            <div className="col-lg-8">
                                <input
                                    type="date"
                                    name="date"
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-primary" onClick={savepkliSurvey}>Launch Survey</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PkliSurvey;
