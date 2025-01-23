import React, { useEffect, useState } from "react";
import { IoShareSocial } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Button, Dialog, DialogActions } from '@mui/material';
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

const PkliRatingSurvey = () => {
    const { id } = useParams();
    const baseUrl = Config.baseUrl;
    const [showEmail, setShowEmail] = useState(false);
    const [pkliSurvey, setPkliSurvey] = useState(null);
    const ageGroups = ["0-12", "13-19", "20-29", "30-39", "40-49", "50-64", "65+"];
    const [formData, setFormData] = useState({
        id: 0,
        surveyId: id,
        userId: id,
        fullName: "",
        medicalRecordNo: "",
        age: "",
        gender: "",
        experienceBetterDetails: "",
        concernedDepartment: "",
        opdIpd: "",
        treatingPhysician: "",
        phone: "",
        email: "",
        createdAt: new Date().toISOString(),
        pkliSurveyResponse: [],
    });

    const questions = [
        "Able to get appointment easily (New/Followup)",
        "Able to get same day appointment when sick or hurt",
        "PKLI working hours suits me",
        "Phone calls get through easily",
        "I get call back quickly",
        "Able to get medical advice when office is closed",
        "Outpatient service waiting time",
        "Admission/discharge waiting time",
    ];

    const FacilityQuestion = [
        "Easy to nd clinic / relevant department",
        "Lobby and waiting rooms are comfortable and clean",
        "Clinics/ IPD/ Exam rooms are comfortable & clean",
        "Wheelchair/ stretcher easily available",
    ]

    const FrontDeskQuestion = [
        "Friendly and helpful to you",
    ]

    const HealthcareQuestion = [
        "Treated you with courtesy and respect",
        "Listened carefully to you",
        "Explained things in understandable way",
        "Considers your personal or family beliefs",
        "Involves other doctors or care givers when needed",
        "Gives you good advice and treatment",
    ]

    const NurseQuestion = [
        "Nurse treated you with courtesy and respect",
        "Nurse listened carefully to you",
        "Nurse explained things in understandable way",
        "Nurse explained things in understandable way",
        "Did you get help soon after pressing call button"
    ]

    const ratingOptions = ["Very Good (4)", "Good (3)", "Fair (2)", "Poor (1)"];
    const yesNoOptions = ["Yes", "No", "Not Applicable"];
    const visitQuestions = [
        "Were you asked about problem of medicine you take?",
        "Were you given any medicine, not taken before?",
        "Were you informed what was medicine for?",
        "Were side effects informed before giving medicine?",
        "Do you have problems getting your medication?",
        "Did someone talk about goals for your health?",
        "Did you get a copy of your care plan?"
    ];
    const generalQuestions = [
        "Have we helped you find other services you need?",
        "Did we help you to make healthy lifestyle choices?",
        "Would you send your friends and family to us?",
        "Do you understand what we ask you to pay for care?",
        "Do you feel what you pay is reasonable?"
    ];

    const getSurveyDetailsById = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/pkli/getSurveyDetails/${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setPkliSurvey(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const addSurveyResponse = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/pkli/addSurveyResponse`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    ...formData,
                }
            })
            handleClickOpen();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            console.log("Error ::>>", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleResponseChange = (question, response) => {
        setFormData((prevData) => {
            const updatedResponses = prevData.pkliSurveyResponse.filter(
                (item) => item.question !== question
            )
            updatedResponses.push({
                surveyId: prevData.surveyId,
                patientId: prevData.id,
                question: question,
                response: response,
                branch: pkliSurvey?.branch || "",
                language: pkliSurvey.language,
            });
            return {
                ...prevData,
                pkliSurveyResponse: updatedResponses,
            };
        });
    };

    useEffect(() => {
        getSurveyDetailsById();
    }, [id])

    const shareLink = `/pkli-rating-form/${id}`;
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check this out!",
                    text: "Here's a survey link:",
                    url: shareLink,
                });
            } catch (error) {
                console.error("Error sharing the link:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareLink);
            } catch (error) {
                console.error("Failed to copy the link:", error);
            }
        }
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const showField = (e) => {
        const checkValue = e.target.checked;
        setShowEmail(checkValue);
    }

    const [departmentData, setDepartmentData] = useState([]);
    const [physiciansData, setPhysiciansData] = useState([]);

    const getDepartment = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/departments`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (Array.isArray) {
                setDepartmentData(data);
            }
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const getPhysicians = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/physicians`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (Array.isArray) {
                setPhysiciansData(data);
            }
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    useEffect(() => {
        getDepartment();
        getPhysicians();
    }, [])

    return (
        <section className="pkliBgImage">
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        Survey response capture successfully
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='btn btn-primary rounded-rounded-4' onClick={handleClose}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="container pt-4 pb-4">
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6 bg-white p-4 px-5 cardScroll card shadow rounded rounded-3">
                        <div className="d-flex justify-content-end">
                            <IoShareSocial className='fw-bold fs-4 text-muted' style={{ cursor: "pointer" }} onClick={handleShare} />
                        </div>
                        <div className='d-flex flex-row-reverse aling-items-baseline'>
                            <div className='m-auto' style={{ width: "80px", height: "80px" }}>
                                <img src={pkliSurvey?.pkliLogo} className='w-100 h-100 card' alt="Logo" style={{ borderRadius: "100px" }} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <h5 className="text-center mt-3 mb-3">{pkliSurvey?.branch}</h5>
                        </div>
                        <div className="ratingForm">
                            <h5 className="mb-1 fw-bold">Patient Experience Form</h5>
                            <div className="form-group">
                                <label htmlFor="date" className="fw-bold">Date <span className="text-danger">*</span></label>
                                <input type="date" className="form-control w-50" name="date" onChange={handleChange} id="date" required />
                            </div>
                            <h5 className="mt-4 mb-1">Patient Demographics</h5>
                            <div className="form-group">
                                <label htmlFor="name" className="fw-bold">Name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" name="fullName" onChange={handleChange} placeholder="Enter your name" required />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="medicalRecord" className="fw-bold">Medical Record Number <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" name="medicalRecordNo" onChange={handleChange} placeholder="Enter record number" required />
                            </div>
                            <div className="form-group mt-3">
                                {/* <select className="form-select" name="age" onChange={handleChange}>
                                    <option value="" selected disabled>Select Age</option>
                                    {ageGroups.map((group, index) => (
                                        <option key={index} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select> */}
                                <label htmlFor="medicalRecord" className="fw-bold">Select Age<span className="text-danger">*</span></label>
                                <Select
                                    options={ageGroups?.map((group) => ({ value: group, label: group }))}
                                    onChange={(selectedOption) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            age: selectedOption?.value || "",
                                        }));
                                    }}
                                    placeholder="Select Age"
                                />

                            </div>
                            <div className="form-group mt-3">
                                <label className="fw-bold">Gender <span className="text-danger">*</span></label>
                                <div>
                                    {["Male", "Female", "Transgender"].map((gender, index) => (
                                        <div className="form-check form-check-inline" key={index}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                value={gender}
                                                checked={formData.gender === gender}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">{gender}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group mt-3">
                                <label className="fw-bold">
                                    OPD/IPD <span className="text-danger">*</span>
                                </label>
                                <div>
                                    {["In-Patient", "Out-Patient"].map((option, index) => (
                                        <div className="form-check form-check-inline" key={index}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="opdIpd"
                                                value={option}
                                                checked={formData.opdIpd === option}
                                                onChange={(e) => setFormData({ ...formData, opdIpd: e.target.value })}
                                            />
                                            <label className="form-check-label">{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* <div className="form-group mt-3">
                                <label htmlFor="physician" className="fw-bold">Treating Physician <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" name="treatingPhysician" onChange={handleChange} placeholder="Enter physician's name" required />
                            </div> */}

                            <div className="form-group">
                                <label className="fw-bold mt-3">Choose Department</label>
                                {/* <select className="form-select">
                                    <option selected disabled>Choose Department</option>
                                    {departmentData.map((item, index) => (
                                        <option>{item?.departmentName}</option>
                                    ))}
                                </select> */}

                                <Select
                                    options={departmentData?.map((item) => ({
                                        value: item?.departmentName,
                                        label: item?.departmentName,
                                    }))}
                                    onChange={(selectedOption) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            concernedDepartment: selectedOption?.value || "",
                                        }));
                                    }}
                                    placeholder="Choose Department"
                                />
                            </div>

                            <div className="form-group">
                                <label className="fw-bold mt-3">Choose Physicians</label>
                                {/* <select className="form-select">
                                    <option selected disabled>Choose Physicians</option>
                                    {physiciansData?.map((item, index) => (
                                        <option>{item?.firstName + " " + item?.lastName}</option>
                                    ))}
                                </select> */}

                                <Select
                                    options={physiciansData?.map((item) => ({
                                        value: item?.firstName + " " + item.lastName,
                                        label: item?.firstName + " " + item?.lastName,
                                    }))}
                                    onChange={(selectedOption) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            treatingPhysician: selectedOption?.value || "",
                                        }));
                                    }}
                                    placeholder="Choose Physicians"
                                />

                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="contactNumber" className="fw-bold">Contact Number <span className="text-danger">*</span></label>
                                <input type="tel" className="form-control" name="phone" onChange={handleChange} placeholder="Enter contact number" required />
                            </div>

                            <div className="form-group mt-3">
                                <label className="fw-bold">How would you rate your general health? <span className="text-danger">*</span></label>
                                <div className="d-flex gap-4">
                                    {ratingOptions.map((option, index) => (
                                        <div className="form-check mt-2" key={index}>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                onChange={() => handleResponseChange('How would you rate your general health?', option)}
                                                name={`questionHealth`}
                                            />
                                            <label className="form-check-label" htmlFor={`health-${index}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h4 className="mt-4 fs-5 fw-bold">Ease of Getting Care</h4>
                            {questions.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {ratingOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`question2-${qIndex}`}
                                                    id={`question2-${qIndex}-${index}`}
                                                    value={option}
                                                    required
                                                    onChange={() => handleResponseChange(question, option)}
                                                />
                                                <label className="form-check-label" htmlFor={`question-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <h4 className="mt-4 fs-5 fw-bold">Facility</h4>
                            {FacilityQuestion.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {ratingOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`question3-${qIndex}`}
                                                    id={`question3-${qIndex}-${index}`}
                                                    value={option}
                                                    required
                                                    onChange={() => handleResponseChange(question, option)}
                                                />
                                                <label className="form-check-label" htmlFor={`question-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <h4 className="mt-4 fs-5 fw-bold">Front Desk</h4>
                            {FrontDeskQuestion.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {ratingOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`question4-${qIndex}`}
                                                    id={`question4-${qIndex}-${index}`}
                                                    value={option}
                                                    required
                                                    onChange={() => handleResponseChange(question, option)}
                                                />
                                                <label className="form-check-label" htmlFor={`question-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <h4 className="mt-4 fs-5 fw-bold">Healthcare Providers</h4>
                            {HealthcareQuestion.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {ratingOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`question5-${qIndex}`}
                                                    id={`question5-${qIndex}-${index}`}
                                                    value={option}
                                                    required
                                                    onChange={() => handleResponseChange(question, option)}
                                                />
                                                <label className="form-check-label" htmlFor={`question-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <h4 className="mt-4 fs-5 fw-bold">Nurses & Medical Assistants</h4>
                            {NurseQuestion.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {ratingOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`question6-${qIndex}`}
                                                    id={`question6-${qIndex}-${index}`}
                                                    value={option}
                                                    onChange={() => handleResponseChange(question, option)}
                                                    required
                                                />
                                                <label className="form-check-label" htmlFor={`question-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <h4 className="mt-4 fs-5 fw-bold">Experience with Today's Visit</h4>
                            {visitQuestions.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {yesNoOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`visit-${qIndex}`}
                                                    id={`visit-${qIndex}-${index}`}
                                                    value={option}
                                                    required
                                                    onChange={() => handleResponseChange(question, option)}
                                                />
                                                <label className="form-check-label" htmlFor={`visit-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <h4 className="mt-4 fs-5 fw-bold">General</h4>
                            {generalQuestions.map((question, qIndex) => (
                                <div className="form-group mt-4" key={qIndex}>
                                    <label className="fw-bold">{question} <span className="text-danger">*</span></label>
                                    <div>
                                        {yesNoOptions.map((option, index) => (
                                            <div className="form-check form-check-inline mt-2" key={index}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={`general-${qIndex}`}
                                                    id={`general-${qIndex}-${index}`}
                                                    value={option}
                                                    onChange={() => handleResponseChange(question, option)}
                                                    required
                                                />
                                                <label className="form-check-label" htmlFor={`general-${qIndex}-${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="form-group mt-3">
                                <label className="fw-bold mb-1">What can we do to make your experience better? <span className="text-danger">*</span></label>
                                <textarea className="form-control" name="experienceBetterDetails" onChange={handleChange} placeholder="Please specify" rows="3"></textarea>
                            </div>
                            <div className="form-check mt-3">
                                <input type="checkbox" className="form-check-input" id="copyResponses" onChange={showField} />
                                <label className="form-check-label" htmlFor="copyResponses">Send me a copy of my responses</label>
                            </div>
                            {showEmail && (
                                <div className="form-group mt-2 mb-2">
                                    <input type="email" className="form-control" placeholder="Enter email address" name="email" onChange={handleChange} />
                                </div>
                            )}
                            <div className="text-center">
                                <button className="btn btn-primary px-4 p-2 mt-3" onClick={addSurveyResponse} style={{ borderRadius: "100px" }}>Submit</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
            </div>
        </section>
    );
};

export default PkliRatingSurvey;
