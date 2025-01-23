import React, { useEffect, useState } from 'react';
import { IoChevronBack } from "react-icons/io5";
import AddNewAttribute from './AddNewAttribute';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import Config from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';

const LaunchSurvey = ({ pageChangeHandler, updatedPayload, surveyData, getAllSurveyById, restaurantCheck, showEmployeeField, showReviewField, showfield, setShowField, showEmpField, setShowEmpField, formData, setFormData, setCustomcheck, customcheck, customCheckbox, setCustomchecks, customchecks, customCheckboxs, restaurantCheckBox, setrestaurantCheck }) => {
    const [backPage, setBackPage] = useState(true);
    const baseUrl = Config.baseUrl;
    const navigate = useNavigate()

    const emailChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
        console.log("formData ::>>", formData);
    };

    const createTextHandler = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            employeesName: [...prevFormData.employeesName, ""]
        }));
    };

    useEffect(() => {
        if (surveyData?.alertEmailIds) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                alertEmailIds: surveyData.alertEmailIds,
            }));
        }
        if (surveyData?.reviewLink) {
            setShowField(true);
            setFormData((prevData) => ({
                ...prevData,
                reviewLink: surveyData.reviewLink,
            }));
        }

        if (surveyData?.employeesName) {
            const employeeArray = surveyData.employeesName.split(",");
            setFormData((prev) => ({ ...prev, employeesName: employeeArray }));
        }
    }, [surveyData]);

    const handleInputChange = (index, event) => {
        const newEmployeesNames = [...formData.employeesName];
        newEmployeesNames[index] = event.target.value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            employeesName: newEmployeesNames
        }));
        console.log("newEmployeesNames", newEmployeesNames);
    };

    const deleteHandler = (index) => {
        const newEmployeesNames = formData.employeesName.filter((_, i) => i !== index);
        setFormData((prevFormData) => ({
            ...prevFormData,
            employeesName: newEmployeesNames
        }));
    };

    const handleReviewField = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            reviewLink: value
        }));
    };

    const launchSurveyHandler = async () => {
        try {
            const formattedFormData = {
                ...formData,
                employeesName: formData.employeesName.join(","),
            };
            const { data } = await axios({
                url: `${baseUrl}/api/survey/addSurvey`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ...updatedPayload,
                    ...formattedFormData,
                    businessSector: "Hotels, Restaurants and Food Retail",
                }
            });
            localStorage.setItem('formData', JSON.stringify(data));
            console.log('Data saved to local storage:', data);
            toast.success(data);
            navigate('/manage-survey');
        } catch (error) {
            toast.error(error.data);
            console.log("Error launching survey:", error);
        }
    };
    console.log("updatedPayload ....>", updatedPayload);
    const updateSurveyById = async () => {
        try {
            const formattedFormData = {
                ...formData,
                employeesName: Array.isArray(formData.employeesName)
                    ? formData.employeesName.join(",")
                    : formData.employeesName,
                languages: Array.isArray(updatedPayload?.languageIds) && updatedPayload.languageIds.length > 0
                    ? updatedPayload.languageIds[0]
                    : "",
            };

            const { data } = await axios({
                url: `${baseUrl}/api/survey/updateSurvey/${surveyData?.surveyId}`,
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ...updatedPayload,
                    ...formattedFormData,
                    businessSlogan: updatedPayload?.businessSlogan[0]?.name || "",
                    businessName: updatedPayload?.businessName[0]?.name || "",
                    branch: updatedPayload?.businessBranch[0]?.name || "",
                    businessSector: "Transportation",
                },
            });
            toast.success("Survey updated successfully!");
            console.log("Updated Survey Data:", data);
            navigate('/manage-survey');
        } catch (error) {
            console.error("Error updating survey:", error);
            toast.error("Failed to update survey. Please try again.");
        }
    };

    const handleFetchSurvey = async () => {
        await getAllSurveyById();
    };

    useEffect(() => {
        if (surveyData?.surveyId) {
            handleFetchSurvey();
        }
    }, [surveyData?.surveyId])


    const handleCheckboxChange = (fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: prevData[fieldName] === "No" ? "Yes" : "No",
        }));
    };

    const [TypeFood, setTypeFood] = useState(["Take away", "Dine-in", "Delivery"]);
    const handleTypeOfOrderChange = (selectedValue) => {
        setFormData((prevData) => ({
            ...prevData,
            typeOfOrder: selectedValue,
        }));
    };

    return (
        <div className='container'>
            {backPage ? (
                <div className='row'>
                    <ToastContainer />
                    <div className='col-lg-10 boxShadow m-auto bg-white border p-4' style={{ borderRadius: "15px" }}>
                        <div className='formQuextion mb-3'>
                            <label className='fw-bold text-dark'>Add Additional Optional Question</label>
                            <div className='d-flex gap-4 flex-column mt-2'>
                                <div className='genericForm p-3 w-100 card'>
                                    <label className='fw-bold'>Generic</label>
                                    <div className='d-flex align-items-center gap-2 mt-2'>
                                        <div className='from-group' style={{ lineHeight: "0" }}>
                                            <input
                                                className="checkBox"
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange("isSourceAwarness")}
                                                checked={formData?.isSourceAwarness === "Yes"}
                                            />
                                        </div>
                                        <div className='launchSurvey'>
                                            <p className='m-0 mt-0 textTitle'>Source of Information.</p>
                                        </div>
                                    </div>

                                    <div className='d-flex align-items-center gap-2 mt-2'>
                                        <div className='from-group' style={{ lineHeight: "0" }}>
                                            <input
                                                className="checkBox"
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange("isCollectBillInfo")}
                                                checked={formData?.isCollectBillInfo === "Yes"}
                                            />
                                        </div>
                                        <div className='launchSurvey'>
                                            <p className='m-0 mt-0 textTitle'>Bill Number.</p>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center gap-2 mt-2'>
                                        <div className='from-group' style={{ lineHeight: "0" }}>
                                            <input
                                                className="checkBox"
                                                type="checkbox"
                                                onChange={showEmployeeField}
                                                checked={showEmpField}
                                            />
                                        </div>
                                        <div className='launchSurvey'>
                                            <p className='m-0 mt-0 textTitle'>Feedback on Employee.</p>
                                        </div>
                                    </div>
                                </div>

                                {updatedPayload?.businessSector === "Hotels, Restaurants and Food Retail" && (
                                    <div className='w-100 p-3 card'>
                                        <label className='fw-bold'>Restaurant / Hospitality</label>
                                        <div className='d-flex align-items-center gap-2 mt-2'>
                                            <div className='from-group' style={{ lineHeight: "0" }}>
                                                <input
                                                    className="checkBox"
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChange("suggestionForFoodMenu")}
                                                    checked={formData?.suggestionForFoodMenu}
                                                />
                                            </div>
                                            <div className='launchSurvey'>
                                                <p className='m-0 mt-0 textTitle'>Suggetion for Food Menu.</p>
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            {/* <select className='form-select' value={formData?.typeOfOrder} onChange={handleTypeOfOrderChange}>
                                                <option selected>Choose Type Of Order</option>
                                                {TypeFood?.map((item, index) => (
                                                    <option value={item}>{item}</option>
                                                ))} */}

                                            <Dropdown
                                                value={formData.typeOfOrder}
                                                onChange={(e) => handleTypeOfOrderChange(e.value)} options={TypeFood} // Options list
                                                optionLabel="label"
                                                placeholder="Choose Type Of Order"
                                                filter
                                                className="w-full md:w-14rem"
                                            />
                                            {/* </select> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* <label className='fw-bold mb-3'>Please select from the following any questions you wish to add:</label>
                        <div className='d-flex align-items-center gap-2'>
                            <div className='from-group' style={{ lineHeight: "0" }}>
                                <input className='checkBox' type='checkbox' onChange={customCheckbox} checked={formData?.isCollectBillInfo === "Yes"} />
                            </div>
                            <div className='launchSurvey'>
                                <p className='m-0' style={{ fontSize: "15px" }}>Collect Billing Information</p>
                                <p className='m-0 mt-0 textTitle'>Inserts a question in the survey to collect billing numbers from customers.</p>
                            </div>
                        </div> */}
                        {/* 
                        <div className='d-flex align-items-center gap-2 mt-3'>
                            <div className='from-group' style={{ lineHeight: "0" }}>
                                <input className='checkBox' type='checkbox' onChange={customCheckboxs} checked={formData?.isSourceAwarness === "Yes"} />
                            </div>
                            <div className='launchSurvey'>
                                <p className='m-0' style={{ fontSize: "15px" }}>Sources of Awareness</p>
                                <p className='m-0 mt-0 textTitle'>Enable customers to specify how they got to know about your business.</p>
                            </div>
                        </div> */}

                        <div className='d-flex align-items-center gap-2 mt-3'>
                            <div className='from-group' style={{ lineHeight: "0" }}>
                                <input className='checkBox' onChange={showReviewField} checked={showfield} type='checkbox' />
                            </div>
                            <div className='launchSurvey'>
                                <p className='m-0' style={{ fontSize: "15px" }}>Enable Review</p>
                                <p className='m-0 mt-0 textTitle'>Redirect happy customers to your public rating page.</p>
                            </div>
                        </div>
                        {showfield && (
                            <div className='form-group mt-2'>
                                <input
                                    type='text'
                                    placeholder='Enter the review link'
                                    name='reviewLink'
                                    value={formData.reviewLink || surveyData?.reviewLink || ""}
                                    className='form-control'
                                    // disabled={surveyData?.surveyId ? true : false}
                                    onChange={(e) => handleReviewField(e.target.value)}
                                />
                            </div>
                        )}

                        {/* {updatedPayload?.businessSector === "Hotels, Restaurants and Food Retail" && (
                            <div className='d-flex align-items-center gap-2 mt-3'>
                                <div className='from-group' style={{ lineHeight: "0" }}>
                                    <input className='checkBox' type='checkbox' onChange={restaurantCheckBox} checked={formData?.isTakeFoodSugg === "Yes"} />
                                </div>
                                <div className='launchSurvey'>
                                    <p className='m-0' style={{ fontSize: "15px" }}>Take Food Suggestions</p>
                                    <p className='m-0 mt-0 textTitle'>Enables customers to recommend food items for your menu.</p>
                                </div>
                            </div>
                        )} */}


                        <div className='form-group mt-3'>
                            <label>Alert Email</label>
                            <input type='email' className='form-control' name='alertEmailIds' value={formData?.alertEmailIds || surveyData?.alertEmailIds || ''} onChange={emailChangeHandler} />
                        </div>
                        {showEmpField && (
                            <div className='mt-3'>
                                <p className='m-0'>Which of our employees you would like to feedback for their professionalism?</p>
                                {formData.employeesName.map((item, index) => (
                                    <div className='form-group d-flex align-items-center gap-2 mb-3' key={index}>
                                        <span className='fw-bold'>{index + 1}.</span>
                                        {surveyData?.surveyId ? (
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='employeesName'
                                                value={item}
                                                onChange={(e) => handleInputChange(index, e)}
                                            />
                                        ) : (
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='employeesName'
                                                value={formData.employeesName[index]}
                                                onChange={(e) => handleInputChange(index, e)}
                                            />
                                        )}
                                        {/* <input
                                        type='text'
                                        className='form-control'
                                        name='employeesName'
                                        value={item}
                                        disabled
                                        onChange={(e) => handleInputChange(index, e)}
                                    /> */}
                                        <span onClick={() => deleteHandler(index)} style={{ fontSize: "20px", cursor: "pointer" }}><MdDelete /></span>
                                    </div>
                                ))}

                                <div className='form-group d-flex justify-content-end'>
                                    <button
                                        className='px-3 p-1 bg-white'
                                        onClick={createTextHandler}
                                        style={{ border: "2px solid #0563ff", borderRadius: "100px", color: "#0563ff" }}
                                    >
                                        Add +
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className='button d-flex justify-content-between mt-4'>
                            <button className="px-3 border text-muted" onClick={pageChangeHandler} style={{ background: "#0563ff2b", borderRadius: "5px" }} ><IoChevronBack />Back</button>
                            {surveyData?.surveyId ? (
                                <button className='btn btn-primary m-0' onClick={updateSurveyById}>Update Survey</button>
                            ) : (
                                <button className='btn btn-primary m-0' onClick={launchSurveyHandler}>Launch Survey</button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <AddNewAttribute setBackPage={setBackPage} />
            )}
        </div>
    );
};

export default LaunchSurvey;
