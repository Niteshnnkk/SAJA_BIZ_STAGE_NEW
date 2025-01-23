import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Config from '../config/config';
import { useParams } from 'react-router-dom';
import logo from '../../src/assets/Images/logo.png';
import feedback from '../../src/assets/Images/turkey.png';
import sajaLogo from '../../src/assets/Images/sajalogo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoShareSocial } from "react-icons/io5";
import smile1 from '../../src/assets/Unselected/1.png'
import smile2 from '../../src/assets/Unselected/2.png'
import smile3 from '../../src/assets/Unselected/3.png'
import smile4 from '../../src/assets/Unselected/4.png'
import smile5 from '../../src/assets/Unselected/5.png'
import smile11 from '../../src/assets/Selected/11.png'
import smile22 from '../../src/assets/Selected/22.png'
import smile33 from '../../src/assets/Selected/33.png'
import smile44 from '../../src/assets/Selected/44.png'
import smile55 from '../../src/assets/Selected/55.png'
import { LuSmilePlus } from "react-icons/lu";
import { GoSmiley } from "react-icons/go";
import { AiOutlineSmile } from "react-icons/ai";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Button, Dialog, DialogActions } from '@mui/material';

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

const SurveyReviews = () => {
    const { id } = useParams();
    const baseUrl = Config.baseUrl;
    const [data, setData] = useState([]);
    const [attributeList, setAttributeList] = useState([]);
    const [textareaValue, setTextareaValue] = useState("");
    const [empList, setEmpList] = useState([""]);
    const [employeeFeedback, setEmployeeFeedback] = useState([]);
    const [loading, setLoading] = useState(false)
    const [nameState, setNameState] = useState({
        firstName: null,
        lastName: null
    });
    const [formData, setFormData] = useState({
        surveyId: id,
        userId: 2,
        email: "",
        phone: "",
        dob: "",
        empMessage: "",
        foodSuggestion: "",
        attributeList: [],
        employeeList: [],
        recommended: "",
        billNumber: "",
        billDate: new Date().toISOString().split('T')[0],
        billAmount: 0,
        sourceType: "",
        suggestionQue: "rtyj",
        suggestionAns: "fgh",
        createdTime: new Date().toISOString(),
    });

    const getSurveyById = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/survey/getSurveyDetails/${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setData(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firstName' || name === 'lastName') {
            setNameState({ ...nameState, [name]: value });
        }
        else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const saveRating = async () => {
        try {
            setLoading(true);
            const { data } = await axios({
                url: `${baseUrl}/api/survey/saveRating`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    name: nameState.firstName + " " + nameState.lastName,
                    ...formData,
                }
            });
            handleClickOpen();
            setLoading(false)
        } catch (error) {
            setLoading(false)
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            console.error("API Error:", error);
        }
    };

    const changeHandler = (e) => {
        if (e.target.checked) {
            setTextareaValue((prevValue) =>
                prevValue.startsWith("Complaint -") ? prevValue : `Complaint - ${prevValue}`
            );
            setFormData((prevFormData) => ({
                ...prevFormData,
                empMessage: `Complaint - ${textareaValue}`,
            }));
        } else {
            setTextareaValue((prevValue) => prevValue.replace(/^Complaint - /, ""));
            setFormData((prevFormData) => ({
                ...prevFormData,
                empMessage: textareaValue.replace(/^Complaint - /, ""),
            }));
        }
    };


    const handleTextareaChange = (e) => {
        const empMessage = e.target.value;
        const updatedValue = textareaValue.startsWith("Complaint -")
            ? `Complaint - ${empMessage.replace(/^Complaint - /, "")}`
            : empMessage;
        setTextareaValue(updatedValue);
        setFormData((prevFormData) => ({
            ...prevFormData,
            empMessage: updatedValue,
        }));
    };

    const [activeImages, setActiveImages] = useState([]);
    const handleImageClick = (attributeIndex, smileIndex) => {
        const updatedActiveImages = [...activeImages];
        updatedActiveImages[attributeIndex] = smileIndex;
        setActiveImages(updatedActiveImages);
        const selectedAttribute = data?.attributes[attributeIndex];
        const rating = (smileIndex + 1).toString();
        const updatedAttribute = {
            attributeName: selectedAttribute.termName,
            attributeRating: rating,
        };
        const updatedAttributeList = [...formData.attributeList];
        updatedAttributeList[attributeIndex] = updatedAttribute;
        setFormData((prevFormData) => ({
            ...prevFormData,
            attributeList: updatedAttributeList,
        }));
    };

    const handleEmployeeFeedback = (employeeIndex, emojiIndex) => {
        const updatedFeedback = [...employeeFeedback];
        updatedFeedback[employeeIndex] = emojiIndex;
        setEmployeeFeedback(updatedFeedback);
        const selectedEmployee = data?.employeesName?.split(',')[employeeIndex];
        const updatedEmployeeList = [...formData.employeeList];

        updatedEmployeeList[employeeIndex] = {
            employeeName: selectedEmployee.trim(),
            employeeRating: (emojiIndex + 1).toString(),
            employeeMessage: `hii ${selectedEmployee.trim()}`,
        };

        setFormData((prevFormData) => ({
            ...prevFormData,
            employeeList: updatedEmployeeList,
        }));
    };

    const [selectedIndex, setSelectedIndex] = useState(null);
    const handleButtonClick = (index) => {
        setSelectedIndex(index);
        setFormData((prevState) => ({
            ...prevState,
            recommended: index,
        }));
    };

    const options = [
        "Personal visit experience or interaction",
        "Friends colleagues relatives community or other people in social circle etc",
        "Digital advertising or promotion on websites social media or apps",
        "Social media pages influencers or any other content",
        "Any other advertising or promotion",
        "Public relations news i.e. articles or stories in the media",
        "Others (Specify)"
    ];

    const handleCheckboxChange = (event, option) => {
        if (event.target.checked) {
            const newSourceType = formData.sourceType.split(',');
            newSourceType.push(option);
            setFormData((prevState) => ({
                ...prevState,
                sourceType: newSourceType.join(','),
            }));
        } else {
            let newSourceType = formData.sourceType.split(',');
            newSourceType = newSourceType.filter((item) => item !== option);
            setFormData((prevState) => ({
                ...prevState,
                sourceType: newSourceType.join(','),
            }));
        }
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const SaveReviewRating = () => {
        saveRating();
    };

    useEffect(() => {
        getSurveyById();
    }, []);


    const shareLink = `/view/${id}/English`;
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

    return (
        <section className='bgImage'>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        Thank you for your time to answer the survey
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='btn btn-primary rounded-rounded-4' onClick={handleClose}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="container pt-4 pb-4">
                <div className='row'>
                    <div className='col-lg-7 m-auto bg-white rounded paddingMob' style={{ padding: "20px 100px" }}>
                        <div className='d-flex flex-row-reverse aling-items-baseline'>
                            <div>
                                <IoShareSocial className='fw-bold fs-4 text-muted' style={{ cursor: "pointer" }} onClick={handleShare} />
                            </div>
                            <div className='m-auto' style={{ width: "80px", height: "80px" }}>
                                <img className='w-100 h-100 card' src={data.bussLogoUrl} alt="Logo" style={{ borderRadius: "100px" }} />
                            </div>
                        </div>

                        <h5 className="text-center mt-3 mb-3">{data?.businessSlogan}</h5>
                        <div className='w-75 m-auto'>
                            <img className='w-100' src={feedback} alt='feedback' />
                        </div>
                        <div className='d-flex inputData gap-4'>
                            <input type="text" name="businessName" readOnly value={data?.businessName || ''} />
                            <input type="text" name="branch" readOnly value={data?.branch || ''} />
                            <input type="text" name="city" readOnly value={data?.cityName || ''} />
                            <input type="text" name="countryId" readOnly value={data?.countryName || ''} />
                        </div>
                        <div className='sutisfiction mt-4 mb-4'>
                            <p className='m-0' style={{ fontStyle: "italic" }}>{data?.custSatisfactionSurvey ? data?.custSatisfactionSurvey : "N/A"}</p>
                        </div>
                        <form>
                            <div className="mb-4" style={{ borderTop: "2px solid #ddd" }}>
                                <p className='m-0 mt-3 mb-4'>How likely are you to recommend this brand to your family or friend number on a scale of 0 to 10?</p>
                                <div className="mb-3 gridMob">
                                    {[...Array(11)].map((_, index) => (
                                        <div key={index} className="text-center">
                                            <button
                                                type="button"
                                                className={`btn rounded-circle fw-bold ${selectedIndex === index ? 'btn-success' : 'btn-outline-secondary'
                                                    }`}
                                                onClick={() => handleButtonClick(index)}
                                            >
                                                {index}
                                            </button>
                                        </div>
                                    ))}

                                </div>
                                <div style={{ borderTop: "2px solid #ddd" }}></div>
                                <p className='m-0 mt-3 mb-3'>How would your rate the business on the following parameters?</p>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex flex-column gap-1">
                                    {data?.attributes?.map((attribute, attributeIndex) => (
                                        <div
                                            className="d-flex justify-content-between align-items-center"
                                            key={attributeIndex}
                                        >
                                            <p className="m-0">{attribute.termName}</p>
                                            <div className="d-flex gap-2 smile">
                                                {[smile1, smile2, smile3, smile4, smile5].map((smile, smileIndex) => (
                                                    <img
                                                        key={smileIndex}
                                                        src={
                                                            activeImages[attributeIndex] === smileIndex
                                                                ? [smile11, smile22, smile33, smile44, smile55][smileIndex]
                                                                : smile
                                                        }
                                                        alt={`smile${smileIndex + 1}`}
                                                        onClick={() => handleImageClick(attributeIndex, smileIndex)}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ borderTop: "2px solid #ddd" }}>
                                <div className="mt-3">
                                    <p className='mb-2'>We will appreciate your feedback on our employees?</p>
                                    {data?.employeesName?.split(',').map((name, employeeIndex) => (
                                        <div className="d-flex align-items-center justify-content-between" key={employeeIndex}>
                                            <div className="employee-name">
                                                <label>{name.trim()}</label>
                                            </div>
                                            <div className="feedback-icons d-flex ms-3">
                                                {[<LuSmilePlus />, <GoSmiley />, <AiOutlineSmile />].map((emoji, emojiIndex) => (
                                                    <span
                                                        key={emojiIndex}
                                                        className={`emoji mx-1 ${employeeFeedback[employeeIndex] === emojiIndex ? "text-warning" : ""
                                                            }`}
                                                        onClick={() => handleEmployeeFeedback(employeeIndex, emojiIndex)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {emoji}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-3' style={{ borderTop: "2px solid #ddd" }}></div>
                            <div className="form-group mb-3 mt-3">
                                <label>
                                    <input
                                        onChange={changeHandler}
                                        type="checkbox"
                                    />{' '}
                                    Please check if you are writing a complaint
                                </label>
                                <textarea
                                    className="form-control"
                                    name="empMessage"
                                    rows="3"
                                    value={textareaValue}
                                    placeholder="Any Suggestion"
                                    onChange={handleTextareaChange}
                                ></textarea>
                            </div>
                            <div>
                                <p className='mb-2'>Please let us know if you would like us to add any food or beverages to our menu?</p>
                                <div className='form-group'>
                                    <input type='text' className='form-control' name='foodSuggestion' onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group mb-3 mt-3">
                                <label>What are your sources of awareness for us?</label>
                                {options.map((option, index) => (
                                    <div key={index} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`checkbox${index}`}
                                            onChange={(e) => handleCheckboxChange(e, option)}
                                        />
                                        <label className="form-check-label" htmlFor={`checkbox${index}`}>
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="form-row mb-4 mt-3">
                                <label className='mb-3'>Please enter your billing information to participate in promotions</label>
                                <div className="formStyle d-flex align-items-center gap-3">
                                    <label>Bill Number</label>
                                    <input type="text" className="form-control" name='billNumber' onChange={handleChange} />
                                </div>
                                <div className='d-flex align-items-center gap-4 mt-3'>
                                    <div className='lable'>
                                        <label htmlFor="">Name</label>
                                    </div>
                                    <div className="formStyle">
                                        <input type="text" className="form-control" placeholder="First Name" name='firstName' onChange={handleChange} />
                                    </div>
                                    <div className="formStyle">
                                        <input type="text" className="form-control" placeholder="Last Name" name='lastName' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="formStyle d-flex align-items-center gap-3 mt-3">
                                    <label>Email</label>
                                    <input type="text" className="form-control" placeholder="Email" name='email' onChange={handleChange} />
                                </div>
                                <div className='formStyle d-flex align-items-center gap-3 mt-3'>
                                    <label>Phone Number</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="" name='phone' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='form-group formStyle d-flex align-items-center gap-3 mt-3'>
                                    <label>Date of Birth</label>
                                    <input className='form-control' type='date' name='dob' onChange={handleChange} />
                                </div>
                            </div>
                        </form>

                        <footer className="mt-0">
                            <p className='mb-1'>We really appreciate your feedback to help us improve our products and services. By submitting this survey, you agree to our <a href='#'>Privacy Policy</a> and <a href='#'>Terms</a></p>
                            <p className=''>Net Promoter, Net Promoter Score and NPS are registered trademarks of Bain & Company, Inc., Satmetrix Systems, Inc., and Fred Reichheld.</p>
                        </footer>
                        <div className='text-center'>
                            <button type="submit" className="btn text-center btn-primary btn-block w-25 m-auto" style={{ borderRadius: "100px" }} onClick={SaveReviewRating} disabled={loading}>
                                {loading ? 'Please wait...' : 'Submit'}
                            </button>
                        </div>
                        <div className='textBottom'>
                            <p className='text-center mt-3 mb-1'>This content is created by the owner of the form. The data you submit will be sent to the form owner. Saja neither created this content nor endorses it.</p>
                        </div>
                        <div className='text-center'>
                            <a href='#'>Write to Us</a>
                            <a href='#'>Terms of Use</a>
                        </div>
                        <div className='m-auto mt-3 d-flex justify-content-center'>
                            <p>Powered by </p>
                            <img src={sajaLogo} style={{ width: '14%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SurveyReviews;

