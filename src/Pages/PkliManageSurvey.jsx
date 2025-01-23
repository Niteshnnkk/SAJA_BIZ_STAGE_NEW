import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye } from 'react-icons/fa';
import { FaFileExcel } from "react-icons/fa6";
import { IoMdArchive } from "react-icons/io";
import { AiOutlineBarChart } from "react-icons/ai";
import Config from '../config/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';

const PkliManageSurvey = () => {
    const baseUrl = Config.baseUrl;
    const [itemPerPage] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page') || '1', 10);
    const indexOfLastItem = currentPage * itemPerPage;
    const [pkliData, setpkliData] = useState([]);
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItem = pkliData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(pkliData.length / itemPerPage);
    const currentId = useRef("0")

    const getAllPilkiSurvey = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/pkli/getAllSurvey`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (Array.isArray(data)) {
                setpkliData(data);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`);
    };

    useEffect(() => {
        getAllPilkiSurvey();
    }, [])

    return (
        <div className="container p-0 mb-5">
            <div className='d-flex gap-2 align-items-center'>
                <div style={{ borderLeft: "3px solid #0066ff", height: "25px" }}></div>
                <h4 className='m-0' style={{ color: "#0066ff" }}>Manage Survey</h4>
            </div>

            <div className='rounded rounded-4 p-4 mt-3' style={{ boxShadow: "0 0 10px #0002" }}>
                <div className='mt-2' style={{ overflowX: "scroll", scrollbarColor: " #0066ff #706e6e", scrollbarWidth: "thin", borderRadius: "10px" }}>
                    <table className="tableData table table-bordered table-hover m-0" style={{ width: "1100px", verticalAlign: "middle" }}>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Branch Name</th>
                                <th>Language</th>
                                <th>Date</th>
                                <th>View Survey</th>
                                <th>View Rating</th>
                                <th>Download Excel</th>
                                <th>Last updated</th>
                                <th>Archived</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItem?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + indexOfFirstItem}</td>
                                    <td>{item.branch || "N/A"}</td>
                                    <td>{item.language || "N/A"}</td>
                                    <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                                    <td className='fs-5' style={{ cursor: "pointer" }}>
                                        <Link className='text-dark' to={`/pkli-rating-form/${item.id}`} target="_blank">
                                            <FaEye />
                                        </Link>
                                    </td>
                                    <td className='fs-4 fw-bold' style={{ cursor: "pointer" }}>
                                        <Link className='text-dark' to={`/pkli-view-rating?SurveyId=${item.id}`}>
                                            <AiOutlineBarChart />
                                        </Link>
                                    </td>
                                    <td className='fs-4' style={{ cursor: "pointer" }}><FaFileExcel className='text-success' /></td>
                                    <td>{item.updateTime ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                                    <td className='fs-4' style={{ cursor: "pointer" }}><IoMdArchive /></td>
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
    );
};

export default PkliManageSurvey;