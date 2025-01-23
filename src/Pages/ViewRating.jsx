import { useLocation } from "react-router-dom";
import Config from "../config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import redSmile from '../../src/assets/Images/red_smile.png';
import GaugeChart from "react-gauge-chart";
import { Bar } from "react-chartjs-2";
import { PieChart } from "react-minimal-pie-chart";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = [
    { title: "PROMOTERS", value: 70, color: "#22b24c" },
    { title: "PASSIVES", value: 20, color: "#faa61a" },
    { title: "DETRACTORS", value: 40, color: "#d12424" },
];

const ViewRating = () => {
    const baseUrl = Config.baseUrl;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const surveyId = queryParams.get("survey_id");
    const [otherData, setOtherData] = useState({});

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            // title: {
            //     display: true,
            //     text: "business",
            // },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: "Scale in %",
                },
            },
        },
    };

    const barData = {
        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        datasets: [
            {
                label: "Scores",
                data: [2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 12],
                backgroundColor: [
                    "red", "red", "red", "red", "orange", "orange", "yellow", "yellow", "green", "green", "green",
                ],
            },
        ],
    }

    const barOptions = {
        plugins: {
            legend: { display: false },
            title: { display: true, text: "NPS = -62%" },
        },
        scales: {
            y: { beginAtZero: true, max: 15 },
        },
    };

    // Data for pie chart
    const pieData = [
        { title: "Promoters", value: 9, color: "green" },
        { title: "Passives", value: 21, color: "orange" },
        { title: "Detractors", value: 71, color: "red" },
    ];

    const [ratingData, setRatingData] = useState([]);
    const [allratingdata, setallratingdata] = useState([])
    const getAllReviews = async (surveyId) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/survey/getSurveyResponse/${surveyId}`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const rating = data?.rating;
            if (rating) {
                setallratingdata(rating)
                const keys = Object.keys(rating);
                const attributeNames = keys.map((item) => item);
                setRatingData(attributeNames);
            }
            const businessName = data?.businessName;
            const branchName = data?.branch;
            const cityName = data?.city;
            setOtherData({ businessName, branchName, cityName })
        } catch (error) {
            console.log("Error ::>>", error);
        }
    };

    // useEffect(() => {
    //     console.log("Updated ratingData:", ratingData);
    // }, [ratingData])

    useEffect(() => {
        if (surveyId) {
            getAllReviews(surveyId);
        }
    }, []);

    const generateChartData = (attributeRatings) => {
        const categories = ["Very Bad", "Bad", "OK", "Good", "Excellent"];
        const data = categories?.map((category) => {
            const ratingData = attributeRatings.find(item => item?.attributeRating === categories.indexOf(category) + 1);
            return ratingData ? ratingData.percentage : 0;
        });

        return {
            labels: categories,
            datasets: [
                {
                    data: data,
                    backgroundColor: ["red", "orange", "yellow", "lime", "green"],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="conatiner">
            <div className="row">

                <div className="mb-3 w-100 p-4 rounded rounded-4 d-flex flex-column gap-3 justify-content-center align-items-center" style={{ boxShadow: "0 0 10px #0003" }}>
                    <div className="d-flex justify-content-center gap-4 w-100">
                        <div className="card rounded rounded-0" style={{ background: "red", width: "fit-content" }}>
                            <span className="text-center mt-2 text-white fw-bold">DETRACTOR</span>
                            <div className="card-body pt-1">
                                <div className="d-flex text-center gap-2 text-white">
                                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                        <div
                                            key={num}
                                            className="d-flex text-white flex-column gap-1 justify-content-center align-items-center"
                                        >
                                            <span>{num}</span>
                                            <img
                                                className="m-auto"
                                                src={redSmile}
                                                alt="Red smile emoji"
                                                style={{ width: "20px" }}
                                            />
                                            <span
                                                className="bg-white p-1 text-dark rounded fw-bold rounded-3"
                                                style={{ fontSize: "12px" }}
                                            >
                                                0%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="card px-2 rounded rounded-0" style={{ background: "#faa61a", width: "fit-content" }}>
                                <span className="text-center mt-2 text-white fw-bold">PASSIVES</span>
                                <div className="card-body pt-1">
                                    <div className="d-flex text-center gap-2 text-white">
                                        {[7, 8].map((num) => (
                                            <div
                                                key={num}
                                                className="d-flex text-white flex-column gap-1 justify-content-center align-items-center"
                                            >
                                                <span>{num}</span>
                                                <img
                                                    className="m-auto"
                                                    src={redSmile}
                                                    alt="Yellow smile emoji"
                                                    style={{ width: "20px" }}
                                                />
                                                <span
                                                    className="bg-white p-1 text-dark rounded fw-bold rounded-3"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    0%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card px-2 rounded rounded-0" style={{ background: "#22b24c", width: "fit-content" }}>
                                <span className="text-center mt-2 text-white fw-bold">PROMOTERS</span>
                                <div className="card-body pt-1">
                                    <div className="d-flex text-center gap-2 text-white">
                                        {[9, 10].map((num) => (
                                            <div
                                                key={num}
                                                className="d-flex text-white flex-column gap-1 justify-content-center align-items-center"
                                            >
                                                <span>{num}</span>
                                                <img
                                                    className="m-auto"
                                                    src={redSmile}
                                                    alt="Green smile emoji"
                                                    style={{ width: "20px" }}
                                                />
                                                <span
                                                    className="bg-white p-1 text-dark rounded fw-bold rounded-3"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    0%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center mt-4 gap-4">
                        <div className="" style={{width: "33.3%"}}>
                            <PieChart data={pieData}
                                lineWidth={50}
                                radius={30}
                                animate
                                label={({ dataEntry }) => `${dataEntry.value}%`}
                                labelStyle={{
                                    fontSize: "5px",
                                    fontFamily: "sans-serif",
                                    fill: "#fff",
                                }}
                                labelPosition={75}
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div className="w-75" style={{width: "33.3%"}}>
                            <Bar className="w-100 h-100" data={barData} options={barOptions} />
                            <p className="text-center">Sample Size: 600</p>
                        </div>

                        <div className="d-flex flex-column align-items-start" style={{ width: "100%" }}>
                            {chartData.map((data, index) => (
                                <div key={index} className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
                                    {/* Pie Chart */}
                                    <PieChart
                                        data={[
                                            { value: data.value, color: data.color },
                                            { value: 100 - data.value, color: "#e6e6e6" },
                                        ]}
                                        lineWidth={40}
                                        startAngle={-90}
                                        rounded
                                        style={{ width: "40px", height: "40px" }}
                                    />
                                    {/* Label */}
                                    <div
                                        className="p-2 d-flex align-items-center"
                                        style={{
                                            background: data.color,
                                            color: "#fff",
                                            fontWeight: "bold",
                                            borderRadius: "4px",
                                            width: "calc(100% - 40px)",
                                            height: "60px",
                                        }}
                                    >
                                        {data.title}
                                    </div>
                                    {/* ashik */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-100 rounded rounded-4 p-4 mt-1" style={{ boxShadow: "0 0 10px #0003" }}>
                    <div className="d-flex justify-content-between">
                        <div style={{ textAlign: "center", borderRight: "2px solid #cfcfcf", width: "33.3%" }}>
                            <span>Business Name :</span>
                            <p className="m-0 text-capitalize">{otherData.businessName}</p>
                        </div>
                        <div style={{ textAlign: "center", borderRight: "2px solid #cfcfcf", width: "33.3%" }}>
                            <span>City :</span>
                            <p className="m-0 text-capitalize">{otherData?.cityName}</p>
                        </div>
                        <div style={{ width: "33.3%", textAlign: "center" }}>
                            <span>Branch :</span>
                            <p className="m-0 text-capitalize">{otherData?.branchName}</p>
                        </div>
                    </div>
                </div>

                <div className="w-100 rounded d-flex flex-column rounded-4 p-5 mt-4 mb-5" style={{ boxShadow: "0 0 10px #0003" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
                        {ratingData && ratingData.length > 0 ? (
                            ratingData.map((attributeName, index) => {
                                const attributeRatings = allratingdata[attributeName];
                                return (
                                    <div key={index}>
                                        <p className="text-center mb-1 fw-bold">{attributeName}</p>
                                        <div style={{ width: "100%", margin: "0 auto" }}>
                                            <Bar className="w-100" data={generateChartData(attributeRatings)} options={options} />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center fw-bold m-auto">No Rating Data Available</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewRating;
