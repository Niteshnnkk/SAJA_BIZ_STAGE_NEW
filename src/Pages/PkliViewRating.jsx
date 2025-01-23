import React, { useEffect, useState } from "react";
import axios from 'axios';
import Config from "../config/config";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import Select from 'react-select';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppointmentChart = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("SurveyId");
    const baseUrl = Config.baseUrl;
    const [ratingData, setRatingData] = useState({});
    const labels = ["Poor", "Fair", "Good", "Very Good"];
    const yesNolabels = ["Yes", "No"];
    const [expirenceData, setexpirenceData] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [surveyLogo, setsurveyLogo] = useState([]);
    const [branchName, setBranchName] = useState([]);
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [filterData, setFilterData] = useState({
        surveyId: queryParams.get("SurveyId"),
        opdIpd: null,
        department: null,
        physician: null,
        createdDate: null,
        start_date: null,
        end_date: null
    });
    const [departmentData, setDepartmentData] = useState([]);
    const [physiciansData, setPhysiciansData] = useState([]);
    const [opdId, setOpdId] = useState(['out-patient', 'In-Patient']);


    const ViewPlkiRating = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/pkli/getSurveyResponse?surveyId=${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setRatingData(data.attributes);
            setsurveyLogo(data.surveyLogo);
            setexpirenceData(data.experienceDetails);
            setBranchName(data.branch);
            console.log("expirenceData ::>>", expirenceData);
        } catch (error) {
            console.error("Error fetching survey responses:", error);
        }
    };

    const filterResponse = async (fData) => {
        try {
            const query = Object.entries(fData)
                .filter(([key, value]) => value !== null && value !== undefined && value !== "")
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
            const { data } = await axios({
                url: `${baseUrl}/api/pkli/filterSurveyResponse?${query}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log("Datat ::>>", data);
            if (data === 'No Record Found') {
                setRatingData([]);
                setsurveyLogo([]);
                setexpirenceData([]);
                setBranchName([]);
                return;
            }
            setRatingData(data?.attributes);
            setsurveyLogo(data?.surveyLogo);
            setexpirenceData(data?.experienceDetails);
            setBranchName(data?.branch);
        } catch (error) {
            console.log("Error ::>>", error)
        }
    }

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        ViewPlkiRating();
        getPhysicians();
        getDepartment();
    }, []);

    const handleDateChange = (value) => {
        const start_date = new Date(value[0]).toJSON().split("T")[0];
        const end_date = new Date(value[1]).toJSON().split("T")[0];
        const fData = { ...filterData, start_date, end_date };
        setFilterData(fData);
        filterResponse(fData);
    };

    const prepareRatingChartData = (responses) => {
        const labelCounts = labels.map((label) => {
            const count = Object.keys(responses).reduce((acc, key) => {
                if (key.includes(label)) {
                    acc += responses[key];
                }
                return acc;
            }, 0);
            return count;
        });

        return {
            labels,
            datasets: [
                {
                    label: labels.label,
                    data: labelCounts,
                    backgroundColor: ["#f5c06f", "#9b59b6", "#e74c3c", "#2ecc71"],
                },
            ],
        };
    };

    const prepareYesNoChartData = (responses) => {
        const yesNoCounts = yesNolabels.map((label) => {
            const count = Object.keys(responses).reduce((acc, key) => {
                if (key.includes(label)) {
                    acc += responses[key];
                }
                return acc;
            }, 0);
            return count;
        });

        return {
            labels: yesNolabels,
            datasets: [
                {
                    label: yesNolabels.label,
                    data: yesNoCounts,
                    backgroundColor: ["#3498db", "#e67e22"],
                },
            ],
        };
    };

    const chartOptions = (title) => ({
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                stepSize: 1,
            },
        },
    });

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

    const handleSelectChange = (e) => {
        const fData = { ...filterData, [e.target.name]: e.target.value };
        setFilterData(fData);
        filterResponse(fData);
    }

    const resetFilter = () => {
        setFilterData({
            selectedValue: "",
        });
        setDepartmentData((prevState) => prevState.map((item) => ({
            ...item, selected: false
        })));
        setPhysiciansData((prevState) => prevState.map((item) => ({
            ...item, selected: false
        })));
        setDateRange([new Date(), new Date()]);
        ViewPlkiRating();
    };

    return (
        <div className="container mb-5">
            <div
                className="d-flex align-items-center gap-2 bg-white rounded rounded-3 p-2 px-3"
                style={{ border: "1px solid rgba(0, 0, 0, 0.125)", boxShadow: "0 0 10px #0001" }}
            >
                <div style={{ width: "60px", height: "60px" }}>
                    <img className="w-100 h-100" src={surveyLogo} />
                </div>
                <p className="m-0">{branchName}</p>
            </div>

            <div className="bg-white rounded rounded-3 mt-3" style={{ border: "1px solid rgba(0, 0, 0, 0.125)", boxShadow: "0 0 10px #0001" }}>
                <div className="d-flex justify-content-between p-4 align-items-center">
                    <div className="d-flex flex-column w-100">
                        <div>
                            <h4>Filter Data</h4>
                        </div>
                        <div className="d-flex justify-content-between gap-2 w-100">
                            <div className="form-group w-25">
                                <DateRangePicker
                                    value={dateRange}
                                    onChange={handleDateChange}
                                    format="yyyy-MM-dd"
                                />
                            </div>

                            <div className="form-group w-25">
                                <select className="form-select" name="physician" value={filterData.selectedValue} onChange={handleSelectChange}>
                                    <option selected value={''}>Choose Physicians</option>
                                    {physiciansData?.map((item, index) => (
                                        <option key={index}>{item?.firstName + " " + item?.lastName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group w-25">
                                <select className="form-select" name="opdIpd" value={filterData.selectedValue} onChange={handleSelectChange}>
                                    <option selected value={''}>Choose Opd/Ipd</option>
                                    {opdId?.map((item, index) => (
                                        <option key={index}>{item}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group w-25">
                                <select className="form-select" name="department" value={filterData.selectedValue} onChange={handleSelectChange}>
                                    <option selected value={''}>Choose Department</option>
                                    {departmentData?.map((item, index) => (
                                        <option key={index}>{item?.departmentName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <button className="btn px-4 btn-primary" onClick={resetFilter} style={{ borderRadius: "100px" }}>Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div
                    className="Pklichart"
                    style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}
                >
                    {Object.entries(ratingData).length === 0 ? (
                        <div>
                            <h4 className="text-center">Data not available</h4>
                        </div>
                    ) : (
                        Object.entries(ratingData).map(([question, responses], index) => {
                            const ratingChartData = prepareRatingChartData(responses);
                            const yesNoChartData = prepareYesNoChartData(responses);
                            const ratingTotalResponses = ratingChartData.datasets[0].data.reduce((acc, value) => acc + value, 0);
                            const yesNoTotalResponses = yesNoChartData.datasets[0].data.reduce((acc, value) => acc + value, 0);
                            const hasYesNoData = Object.keys(responses).some(key => yesNolabels.some(label => key.includes(label)));

                            return (
                                <div key={index} className="w-100 chartBar mt-0" style={{ width: "300px", height: "250px", margin: "auto" }}>
                                    {ratingTotalResponses > 0 && (
                                        <div className="w-100 h-100" key={index}>
                                            <Bar
                                                data={ratingChartData}
                                                options={chartOptions(`${question}`)}
                                            />
                                        </div>
                                    )}
                                    {hasYesNoData && yesNoTotalResponses > 0 && (
                                        <div className="w-100 h-100" style={{ textAlign: "-webkit-center" }}>
                                            <Pie
                                                data={yesNoChartData}
                                                options={{
                                                    plugins: {
                                                        legend: {
                                                            position: "bottom",
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: `${question} (Yes/No Responses)`,
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div className="shadow bg-white p-3 mt-4 rounded rounded-3 card">
                <h5 className="m-0 d-flex align-items-center justify-content-between" onClick={toggleAccordion} style={{ cursor: "pointer" }}>
                    What can we do to make your experience better?
                    <button
                        className="btn btn-link text-decoration-none"
                        style={{
                            fontSize: "1.2rem",
                            padding: "0",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {isExpanded ? <FaMinus className="text-dark" /> : <FaPlus className="text-dark" />}
                    </button>
                </h5>
                {/* <b className="text-dark">{totalExperiences} Responses</b> */}
                <div
                    className={`accordion-content ${isExpanded ? "expanded" : "collapsed"}`}
                    style={{
                        maxHeight: isExpanded ? "500px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-out",
                    }}
                >
                    {expirenceData?.length > 0 ? (
                        expirenceData.map((experience, index) => (
                            <p className="m-0 card mt-2 px-3 p-2" key={index}>
                                {experience || "No experience available"}
                            </p>
                        ))
                    ) : (
                        <p className="m-0">No experiences available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentChart;
