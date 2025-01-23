import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaCopy, FaEdit, FaGlobe, FaDownload } from 'react-icons/fa';
import { IoMdArchive } from "react-icons/io";
import qrCode from "../assets/Images/Collect/qrCode.png";
import axios from 'axios';
import Config from '../config/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import FeedbackCardEng from './QrPageEng';
import html2pdf from 'html2pdf.js';
import { RxCross2 } from "react-icons/rx";

import { LuSmilePlus } from "react-icons/lu";
import { GoSmiley } from "react-icons/go";
import { AiOutlineSmile } from "react-icons/ai";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import { MdDelete } from "react-icons/md";
import Draggable from 'react-draggable';
import { Button, Dialog, DialogActions } from '@mui/material';
import copyGryaIcon from '../assets/Images/copy_icons_grey.png';
import copyIcon from '../assets/Images/copy_icons.png';

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

const ManageSurvey = () => {
    const baseUrl = Config.baseUrl;
    const [surveyData, setSurveyData] = useState([]);
    const [itemPerPage] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page') || '1', 10);
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItem = surveyData.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItem)
    const totalPage = Math.ceil(surveyData.length / itemPerPage);
    const [downloadIndex, setdownloadIndex] = useState("0")
    const currentId = useRef("0")

    function PDFGenerator(index) {
        setdownloadIndex(index);
        currentId.current = index
        // const element = document.getElementById('feedbackCard');
        // html2pdf().set({ margin: 0, filename: `Survey Form`, image: { type: 'jpeg', quality: 1.0 } }).from(element).save();
    }

    const handleDownload = () => {
        const feedbackCard = document.getElementById("feedbackCard");
        if (feedbackCard) {
            html2canvas(feedbackCard).then((canvas) => {
                const pngUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = "FeedbackCard.png";
                link.click();
            });
        } else {
            console.error("FeedbackCardEng component not found");
        }
    };

    const [businessName, setBusinessName] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllSurveyData = async () => {
        setLoading(true)
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/survey`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (Array.isArray(data)) {
                setSurveyData(data);
                const busName = data?.businessName;
                // console.log("Setting businessName:", busName); 
                setBusinessName(busName);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error ::>>", error);
        }
    };

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`);
    };

    useEffect(() => {
        getAllSurveyData();
    }, []);

    const handleCopyLink = (multiLanguageId) => {
        const dynamicLink = `https://saja-biz.vercel.app/view-survey/${multiLanguageId}`;
        navigator.clipboard.writeText(dynamicLink)
            .then(() => {
                handleClickOpen();
            })
            .catch((err) => {
                console.error("Failed to copy link: ", err);
            });
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [selectSurveyId, setSelectSurveyId] = useState(null);
    const deleteHandler = (id) => {
        setSelectSurveyId(id);
        setOpen(true);
    };

    const closeHandler = () => {
        setOpen(false);
    };

    const deleteSurvey = async (id) => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/survey/${id}`,
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            getAllSurveyData();
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    return (
        <div className="container p-0 mb-5" >
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText className='pb-0'>
                        {/* <strong className='text-center d-block text-capitalize'>{businessName}</strong> */}
                        <p> Survey link copied successfully!!</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='btn btn-primary rounded-rounded-4' onClick={handleClose}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            {/* delete modal  */}

            <Dialog className=""
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText className='pb-0'>
                        <p>Are you sure you want to delete this Survey?</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <p className="position-absolute" onClick={() => { handleClose() }} style={{ cursor: "pointer", top: "5px", right: "5px", lineHeight: "0px", fontSize: "18px" }}>
                        <RxCross2 />
                    </p>
                    <button className="btn btn-danger px-3" onClick={() => { handleClose(); deleteSurvey(selectSurveyId) }} style={{ borderRadius: "100px" }}>
                        Delete
                    </button>
                </DialogActions>
            </Dialog>

            <div className='d-flex gap-2 align-items-center'>
                <div style={{ borderLeft: "3px solid #0066ff", height: "25px" }}></div>
                <h4 className='m-0' style={{ color: "#0066ff" }}>Manage Survey</h4>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className='rounded rounded-4 p-4 mt-3' style={{ boxShadow: "0 0 10px #0002" }}>
                    <div className='mt-2' style={{ overflowX: "scroll", scrollbarColor: " #0066ff #706e6e", scrollbarWidth: "thin", borderRadius: "10px" }}>
                        <table className="tableData table table-bordered table-hover m-0" style={{ width: "1400px" }}>
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Business Name</th>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>City</th>
                                    <th>Branch</th>
                                    <th>Multi Branch</th>
                                    <th>View Survey</th>
                                    <th>Edit</th>
                                    <th>Copy Link</th>
                                    <th>QR Code</th>
                                
                                  <th>Archive</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItem
                                    .slice()
                                    .map((item, index) => (
                                        <tr key={item?.id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td className='text-capitalize'>{item.businessName || "N/A"}</td>
                                            <td>{item?.countryName || "N/A"}</td>
                                            <td>{item?.state || "N/A"}</td>
                                            <td>{item?.cityName || "N/A"}</td>
                                            <td className='text-capitalize'>{item.branch || "N/A"}</td>
                                            <td>
                                                {item?.isMultiBranch === "Yes" ? (
                                                    <Link to={`/edit-survey-with-multibranch/${item.surveyId}`}>
                                                        <img style={{ width: "25px" }} src={copyIcon} />
                                                    </Link>
                                                ) : (
                                                    <img style={{ width: "25px" }} src={copyGryaIcon} />
                                                )}
                                            </td>

                                            <td>
                                                {/* {(Array.isArray(item.multiLanguageId) && item.multiLanguageId.length === 1) || (item.multiLanguageId === "") ? ( */}
                                                    {/* <Link to={`/view-survey/${item.multiLanguageId}`}>
                                                        <FaEye className="text-dark iconSize" />
                                                    </Link>
                                                ) : ( */}
                                                    <Link to={`/view-survey/${item.multiLanguageId}`} target="_blank">
                                                        <FaEye className="text-dark iconSize" />
                                                    </Link>
                                                {/* )} */}
                                            </td>
                                            <td>
                                                {/* <Link to={`/business-summary/${item.surveyId}`}> */}
                                                <Link to={`/edit-survey-with-multibranch/${item.surveyId}`}>
                                                    <FaEdit className="text-dark iconSize" />
                                                </Link>
                                            </td>
                                            <td>
                                                <FaGlobe className="text-dark iconSize" style={{ cursor: "pointer" }} onClick={() => handleCopyLink(item.multiLanguageId)} />
                                            </td>
                                            <td>
                                                {/* <p className="m-0 text-primary" style={{ cursor: "pointer" }} onClick={() => { PDFGenerator(index) }}>
                                                {item?.languages}
                                            </p> */}
                                                {/* <p className="m-0 text-dark" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => { PDFGenerator(index) }} style={{ cursor: "pointer" }}>
                                                    {item?.language }
                                                </p> */}
                                                <p className="m-0 text-dark" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => { PDFGenerator(index) }} style={{ cursor: "pointer" }}><img style={{width:"25px"}} src={qrCode}/></p>
                                



                                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-scrollable">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div>
                                                                    <FeedbackCardEng
                                                                        surveyData={surveyData}
                                                                        downloadIndex={currentId?.current}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                           
                                            <td>
                                                <IoMdArchive className="text-dark iconSize" />
                                            </td>
                                            <td>
                                                <MdDelete className="text-danger fw-bold fs-5" style={{ cursor: "pointer" }} onClick={() => deleteHandler(item.surveyId)} />
                                            </td>
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
            )
            }
            {/* <div className='d-none'>
                <FeedbackCardEng
                    surveyData={surveyData}
                    downloadIndex={currentId?.current}
                />
            </div> */}
        </div >
    );
};

export default ManageSurvey;