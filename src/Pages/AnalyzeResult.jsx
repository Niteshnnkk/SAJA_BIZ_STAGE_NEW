import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Config from "../config/config";

const AnalyzeResult = () => {
    const [surveyData, setSurveyData] = useState([]);
    const navigate = useNavigate();
    const baseUrl = Config.baseUrl;
    const [itemPerPage] = useState(10);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page') || '1', 10);
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItem = surveyData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(surveyData.length / itemPerPage);

    const getAllSurveyData = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/survey`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setSurveyData(data);
        } catch (error) {
            console.error("Error ::>>", error);
        }
    };

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`);
    };

    useEffect(() => {
        getAllSurveyData();
    }, []);

    return (
        <div className="container p-0 mb-5">
            <div className='d-flex gap-2 align-items-center'>
                <div style={{ borderLeft: "3px solid #0066ff", height: "25px" }}></div>
                <h4 className='m-0' style={{ color: "#0066ff" }}>Analyze Result</h4>
            </div>
            <div className='rounded rounded-4 p-4 mt-3' style={{ boxShadow: "0 0 10px #0002" }}>
                <div className='mt-2' style={{ borderRadius: "10px" }}>
                    <table className="tableData table table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Business Name - City - Branch</th>
                                <th>AnalyzeResult</th>
                                <th>Download Excel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItem.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{item.businessName || "N/A"} - {item.city || "N/A"}</td>
                                    <td>
                                        <Link className="text-dark" to={`/view-ratings?survey_id=${item.surveyId}`}>
                                            {item.languages || "N/A"}
                                        </Link>
                                    </td>
                                    <td>{item.languages || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
    )
}
export default AnalyzeResult;