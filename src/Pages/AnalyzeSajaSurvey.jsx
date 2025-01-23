import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { axiosWrapper } from '../helpers/axiosWrapper';
import CanvasJSReact from '@canvasjs/react-charts';
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaChartLine } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';
import axios from 'axios';
import Config from '../config/config';
import { toast } from 'react-toastify';
import Exportdata from '../components/Sajaskyexport/Exportdata';
import GaugeChart from "react-gauge-chart";
import "./meter.css";
import Thresoldguagelevels from '../components/Thresoldguagelevels';

export default function AnalyzeSajaSurvey() {
    const { baseUrl } = Config
    const navigate = useNavigate();
    const params = useParams();
    const id = params?.id;
    var CanvasJS = CanvasJSReact.CanvasJS;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const [questions, setQuestions] = useState([]);
    console.log("questions------->", questions);
    const [options, setoptions] = useState([]);
    const [texts, setTexts] = useState([]);
    const [npsType, setnpsType] = useState([]);
    const [extraStates, setextraStates] = useState({
        isLoadingGraphData: false
    })
    const [renderComponent, setRenderComponent] = useState("analysis");


    useEffect(() => {
        if (id) {
            getFormAllQuestions(id)
        }
    }, [])

    function componentChangeHandler(type) {
        setRenderComponent(type)
    }

    function updateState(key, value) {
        setextraStates((prev) => {
            return { ...prev, [key]: value }
        })
    }

    async function getFormAllQuestions(id) {
        updateState("isLoadingGraphData", true)
        let response = await axiosWrapper.get(`sky/getSurveyResponseData?surveyId=${id}`);
        if (response === "something went wrong") {
            setQuestions([]);
            updateState("isLoadingGraphData", false)
            return
        } else {
            setQuestions(response);
            let option = response?.optionDetails?.map(item => {
                if (item?.quesFamily === "choice") {
                    console.log("item------", item)
                    const { questionTitle, optionsValue } = item;
                    const cities = Object.keys(optionsValue);  // ["mumbai", "delshi"]
                    console.log("cities------", cities)
                    return {
                        animationEnabled: true,
                        // exportEnabled: true,
                        theme: "light2", // "light1", "dark1", "dark2"
                        // title: {
                        //     text: questionTitle,
                        //     fontWeight: "normal",
                        //     fontSize: 17,
                        //     margin: 20,
                        // },
                        axisY: {
                            title: "Response",
                            margin: 20,
                            padding: 2,
                            fontSize: 10,
                        },
                        // axisX: {
                        //     title: "Cities",
                        //     prefix: "category",
                        //     interval: 1
                        // },
                        data: [{
                            type: "line",
                            // toolTipContent: "{x}: {y}",
                            dataPoints: cities.map((city, index) => ({
                                label: city, // City name on the x-axis
                                y: optionsValue[city], // Response percentage for the city
                            }))
                        }]
                    }
                }
            })
            setoptions(option);
            let text = response?.optionDetails?.map(item => {
                if (item?.quesFamily === "textbox") {
                    return item?.rowValue;
                }
            })
            setTexts(text)
            let npsType = response?.optionDetails?.map(item => {
                if (item?.quesFamily === "nps") {
                    return item;
                }
            })
            setnpsType(npsType)
            updateState("isLoadingGraphData", false)
        }
    }

    function onGraphChangeHandler(index, sType) {
        let z = [...options];
        z[index] = { ...z[index], data: [{ ...z[index].data[0], type: sType }] };
        setoptions(z);
    }

    function getPercentage(value, total) {
        if (value == 0 || total == 0) {
            return 0
        }
        const f = 100 / total;
        const g = f.toFixed(2) * value
        // console.log("f,g----->", f, g)
        return g.toFixed(2);

    }

    function PDFGenerator(id) {
        const element = document.getElementById(id);
        console.log(element);
        // Hide the tools div without removing it from the DOM
        const toolsDiv = element.querySelector("#tools");
        console.log("toolsDiv-------", toolsDiv)
        if (toolsDiv) {
            toolsDiv.style.display = 'none';
        }
        // Generate the PDF
        setTimeout(() => {
            html2pdf().set({
                margin: 0, filename: `Survey Form`, image: { type: 'jpeg', quality: 1.0 }, jsPDF: { format: 'a3' },
                html2canvas: { scale: 2 }
            }).from(element).save();

        }, 10)

        // Revert the display property of the tools div after PDF generation
        setTimeout(() => {
            if (toolsDiv) {
                toolsDiv.style.display = 'flex';
            }
        }, 20)
    }

    function ImageGenerator(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id ${id} not found`);
            return;
        }

        const toolsDiv = element.querySelector("#tools");
        if (toolsDiv) {
            toolsDiv.style.display = 'none';
        }

        setTimeout(() => {
            // Ensure htmlToImage is available
            if (typeof htmlToImage === 'undefined') {
                console.error("htmlToImage is not loaded");
                return;
            }

            htmlToImage.toJpeg(document.getElementById(id), { quality: 0.95 })
                .then(function (dataUrl) {
                    var link = document.createElement('a');
                    link.download = 'my-image-name.jpeg';  // You can customize this file name
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('Image generation failed:', error);
                });

        }, 10);

        // Restore toolsDiv after a longer delay to ensure download process is complete
        setTimeout(() => {
            if (toolsDiv) {
                toolsDiv.style.display = 'flex';
            }
        }, 1000);  // Adjust this as needed based on your image size and download time
    }



    const npsScore = 60; // Dynamic NPS score
    const thresholds = [-100, -75, -50, -25, 0, 25, 50, 75, 100];
    const radius = 140; // Adjust based on chart size

    console.log("questions--------->", questions)
    console.log("options--------->", options)
    console.log("npsType--------->", npsType)

    return (
        <div>

            <header className='py-1 border bg-white'>
                <ul className='d-flex align-items-center gap-4 ' style={{ listStyle: "none" }}>

                    <span>
                        <FaArrowCircleLeft style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => navigate(`/new-survey/${id}`)} />
                    </span>

                    <li className='text-dark text-bold d-flex'>


                        <div class="dropdown p-0 mt-1">
                            <span class=" dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Reports
                            </span>
                            <ul class="dropdown-menu">
                                <li><span class="dropdown-item" onClick={() => { componentChangeHandler("analysis") }} >Summary</span></li>
                                <li><a class="dropdown-item" href="#">Individual Response</a></li>
                                <li><a class="dropdown-item" href="#">Audio & Video Analysis</a></li>
                            </ul>
                        </div>
                        <div class="dropdown p-0 mt-1" style={{ width: "125px" }}>
                            <span class="fs-6" onClick={() => { componentChangeHandler("export") }} >
                                Export Data
                            </span>

                        </div>
                    </li>

                </ul>
            </header>

            {renderComponent === "analysis" ? <div className='d-flex flex-column gap-4 mt-3'>

                {(options.length > 0 && !extraStates?.isLoadingGraphData) && <>
                    {options?.map((item, index) => {
                        const qID = questions?.optionDetails[index]?.questionId;
                        return <>
                            {questions?.optionDetails[index]?.quesFamily === "choice" ? <div key={index} className='bg-white' id={qID}>
                                <div className='d-flex justify-content-between p-2 pb-3 border-bottom '>

                                    <p className='tex-bold m-0 ' style={{ fontSize: "20px" }}>{questions?.optionDetails[index]?.questionTitle}</p>

                                    <div className='align-items-center gap-3' id="tools" style={{ display: "flex" }}>
                                        <div>
                                            <div class="dropdown p-0 mt-1">
                                                <span class=" dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <FaChartLine />
                                                </span>
                                                <ul class="dropdown-menu p-2">
                                                    <li onClick={(e) => { onGraphChangeHandler(index, "column") }}>Column Chart</li>
                                                    <li onClick={(e) => { onGraphChangeHandler(index, "bar") }}>Bar Chart</li>
                                                    <li onClick={(e) => { onGraphChangeHandler(index, "pie") }}>Pie Chart</li>
                                                    <li onClick={(e) => { onGraphChangeHandler(index, "line") }}>Line Chart</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="dropdown p-0 mt-1">
                                                <span class=" dropdown-toggle fs-6" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <FaDownload style={{ fontSize: "14px" }} />
                                                </span>
                                                <ul class="dropdown-menu p-2">
                                                    <li onClick={() => PDFGenerator(qID)} >PDF</li>
                                                    <li onClick={() => ImageGenerator(qID)}>Image</li>

                                                </ul>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                                <div  >
                                    <CanvasJSChart options={item} style={{ width: "100%" }} />

                                    <div className='mt-3 p-5 d-flex justify-content-center w-100'>
                                        <div className="w-100">
                                            <div class="d-flex col-md-12">
                                                <div className='col-md-2'>
                                                    <div className='bg-light p-2'>Responses</div>
                                                    {Object.keys(questions?.optionDetails[index]?.optionsValue)?.map(item => {
                                                        return <>
                                                            <div className="mt-2">{item}</div>
                                                        </>
                                                    })}

                                                </div>


                                                <div className='col-md-2'>
                                                    <div className='bg-light p-2' >Count</div>
                                                    {Object.values(questions?.optionDetails[index]?.optionsValue)?.map(item => {
                                                        return <>
                                                            <div className='mt-2'>{item}</div>
                                                        </>
                                                    })}

                                                </div>
                                                <div className='col-md-2'>
                                                    <div className='bg-light p-2' >Percentage</div>
                                                    {Object.values(questions?.optionDetails[index]?.optionsValue)?.map(item => {
                                                        const reduCedValue = Object.values(questions?.optionDetails[index]?.optionsValue).reduce((item, acc) => acc + parseInt(item), 0)

                                                        return <>
                                                            <div className='mt-2 '>{getPercentage(item, reduCedValue)}</div>
                                                        </>
                                                    })}

                                                </div>
                                                <div className='col-md-6'>

                                                    <div className='d-flex w-100'>
                                                        <div className='bg-light p-2 text-end' style={{ width: "20%" }}>20%</div>
                                                        <div className='bg-light p-2 text-end' style={{ width: "20%" }} >40%</div>
                                                        <div className='bg-light p-2 text-end' style={{ width: "20%" }}>60%</div>
                                                        <div className='bg-light p-2 text-end' style={{ width: "20%" }}>80%</div>
                                                        <div className='bg-light p-2 text-end' style={{ width: "20%" }}>100%</div>

                                                    </div>

                                                    <div className='w-100 d-flex gap-2 flex-column '>
                                                        {Object.values(questions?.optionDetails[index]?.optionsValue)?.map(item => {
                                                            const reduCedValue = Object.values(questions?.optionDetails[index]?.optionsValue).reduce((item, acc) => acc + parseInt(item), 0)

                                                            return <>
                                                                <div className='mt-2' style={{ width: `${getPercentage(item, reduCedValue)}%`, background: "blue", height: "17px" }}></div>
                                                            </>
                                                        })}

                                                    </div>



                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>




                            </div> : null}

                            {questions?.optionDetails[index]?.quesType === "single-text" ? (
  <div key={index} className="bg-white" id={qID}>
    <div className="d-flex justify-content-between p-2 pb-3 border-bottom">
      <p className="text-bold m-0" style={{ fontSize: "20px" }}>
        {questions?.optionDetails[index]?.questionTitle}
      </p>
    </div>
    <div>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col" className="text-center">Date</th>
            <th scope="col" className="text-center">Answer</th>
          </tr>
        </thead>
        <tbody>
          {questions?.optionDetails[index]?.rowValue?.map((row, idx) => (
            <tr key={idx}>
              <td className="text-center">{row?.createdDate}</td>
              <td className="text-center">{row?.rowValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
) : null}


                        </>

                    })}
                </>
                }


                {(npsType.length > 0 && !extraStates?.isLoadingGraphData) && <>
                    {
                        npsType?.map((item, index) => {
                            console.log("npstype------->", item);
                            { item && console.log("Object.values---->", Object.values(item?.npsResponse)) }
                            const qID = questions?.optionDetails[index]?.questionId;
                            let reduCedValue;
                            if (item) {
                                reduCedValue = Object.values(item?.npsResponse).reduce((p, acc) => acc + parseInt(p), 0)
                            } else {
                                reduCedValue = 0
                            }
                            const npsScore = parseFloat(item?.npsResponse?.npsScore || 0);
                            const percent = (npsScore + 100) / 200;

                            return <>
                                {
                                    questions?.optionDetails[index]?.quesFamily === "nps" ? <div key={index} className='bg-white' id={qID}>
                                        <div className='d-flex justify-content-between p-2 pb-3 border-bottom '>
                                            <p className='tex-bold m-0 ' style={{ fontSize: "20px" }}>{questions?.optionDetails[index]?.questionTitle}</p>
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center flex-column p-2 '>
                                            <div className="meter-container">
                                                {/* Threshold labels */}
                                                <Thresoldguagelevels />

                                                {/* Gauge Chart */}
                                                <GaugeChart
                                                    id="gauge-chart6"
                                                    animate={false}
                                                    nrOfLevels={8}
                                                    percent={percent} // Adjust based on dynamic score
                                                    arcPadding={0.01}
                                                    arcWidth={0.06}
                                                    needleColor="#345243"
                                                    cornerRadius={1}
                                                    colors={["#FF5F5F", "#FFDD44", "#5BE12C"]} // Red, Yellow, Green
                                                    style={{ width: "100%" }}
                                                    hideText={true}

                                                />

                                                {/* NPS Score Display */}
                                                <div className="nps-score">
                                                    Net Promoter Score: <span>{item?.npsResponse?.npsScore}</span>
                                                </div>



                                            </div>

                                            <p className='text-bold fs-6 '>{item?.npsResponse?.rowText}</p>


                                        </div>
                                        <div className='mt-1 pt-1 pb-2 px-5 d-flex justify-content-center w-100'>
                                            <div className="w-100">
                                                <div class="d-flex col-md-12">
                                                    <div className='col-md-2'>
                                                        <div className='bg-light p-2'>Answer</div>

                                                        <div className="mt-2">Promoters</div>
                                                        <div className="mt-2">Detractors</div>
                                                        <div className="mt-2">Passives</div>
                                                        <div className="mt-2">Total</div>


                                                    </div>


                                                    <div className='col-md-2'>
                                                        <div className='bg-light p-2' >Count</div>

                                                        <div className='mt-2'>{item?.npsResponse?.promoters}</div>
                                                        <div className='mt-2'>{item?.npsResponse?.detractors}</div>
                                                        <div className='mt-2'>{item?.npsResponse?.passives}</div>
                                                        <div className='mt-2'>{item?.npsResponse?.totalCount}</div>

                                                    </div>
                                                    <div className='col-md-2'>
                                                        <div className='bg-light p-2' >Percentage</div>
                                                        <div className='mt-2' >{getPercentage(item?.npsResponse?.promoters, item?.npsResponse?.totalCount)}</div>
                                                        <div className='mt-2' >{getPercentage(item?.npsResponse?.detractors, item?.npsResponse?.totalCount)}</div>
                                                        <div className='mt-2' >{getPercentage(item?.npsResponse?.passives, item?.npsResponse?.totalCount)}</div>
                                                        <div className='mt-2 text-bold' >100%</div>


                                                    </div>
                                                    <div className='col-md-6'>

                                                        <div className='d-flex w-100'>
                                                            <div className='bg-light p-2 text-end' style={{ width: "20%" }}>20%</div>
                                                            <div className='bg-light p-2 text-end' style={{ width: "20%" }} >40%</div>
                                                            <div className='bg-light p-2 text-end' style={{ width: "20%" }}>60%</div>
                                                            <div className='bg-light p-2 text-end' style={{ width: "20%" }}>80%</div>
                                                            <div className='bg-light p-2 text-end' style={{ width: "20%" }}>100%</div>

                                                        </div>

                                                        <div className='w-100 d-flex gap-2 flex-column '>

                                                            {item && <>
                                                                <div className='mt-2' style={{ width: `${getPercentage(questions?.optionDetails[index]?.npsResponse?.promoters, questions?.optionDetails[index]?.npsResponse?.totalCount)}%`, background: "blue", height: "17px" }}></div>
                                                                <div className='mt-2' style={{ width: `${getPercentage(questions?.optionDetails[index]?.npsResponse?.detractors, questions?.optionDetails[index]?.npsResponse?.totalCount)}%`, background: "blue", height: "17px" }}></div>
                                                                <div className='mt-2' style={{ width: `${getPercentage(questions?.optionDetails[index]?.npsResponse?.passives, questions?.optionDetails[index]?.npsResponse?.totalCount)}%`, background: "blue", height: "17px" }}></div>
                                                                {/* <div className='mt-2' style={{ width: `${getPercentage(questions?.optionDetails[index]?.npsResponse?.promoters, questions?.optionDetails[index]?.npsResponse?.totalCount)}%`, background: "blue", height: "17px" }}></div> */}
                                                            </>
                                                            }


                                                        </div>



                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div> : null
                                }
                            </>

                        })
                    }
                </>

                }

                {
                    (options.length === 0 && extraStates?.isLoadingGraphData) && <>
                        <div className='d-flex justify-content-center align-items-center' style={{ height: "70vh" }}>
                            Loading...
                        </div>
                    </>
                }


            </div> : null}


            {
                renderComponent === "export" ? <> <Exportdata id={id} />  </> : null
            }

        </div>
    )
}
