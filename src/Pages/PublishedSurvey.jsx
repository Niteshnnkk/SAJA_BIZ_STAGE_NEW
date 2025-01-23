import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FaCheck, FaSortDown, FaSortUp } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../components/Preview/Preview.css";
import Config from "../config/config";
// import { getDecodedToken } from "../helpers/authFunctions";
// import { axiosWrapper } from "../helpers/axiosWrapper";

export default function PublisedSurvey({}) {
  //   const userEmail = getDecodedToken().email;
  const [currentPage, setCurrentPage] = useState(0);
  const [surveyId, setSurveyId] = useState(null);
  const [questions, setQuestions] = useState([]);
  ////console.log("questions--------->", questions)
  const [allAnswers, setAllAnswers] = useState([]);
  const params = useParams();
  const location = useLocation();
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();
  const [surveyBasicDestails, setSurveyBasicDetails] = useState({
    name: "",
    image: "",
  });
  const [selectOptionId, setselectOptionId] = useState("");
  const [selectOptionsThings, setselectOptionsThings] = useState([]);
  const [npsOptionsThings, setnpsOptionsThings] = useState([]);
  const [multinpsOptionsThings, setmultinpsOptionsThings] = useState([]);
  ////console.log("npsOptionsThings------>", npsOptionsThings)
  ////console.log("multinpsOptionsThings------>", multinpsOptionsThings)
  const id = params?.surveyid;

  const urlParams = new URLSearchParams(window.location.search); // Alternative to useLocation
  const collectId = urlParams.get("collectId");
  const medium = urlParams.get("medium");

  const userId = "";
  const { baseUrl } = Config;
  useEffect(() => {
    if (id) {
      setSurveyId(id);
      getFormAllQuestions(id);
    }
    // Set the start time when the page loads
    setStartTime(new Date());
  }, []);

  async function getSurveyData(endpoint) {
    let userSession = ``;
    console.log("userSession------", userSession);
    // if (endpoint.includes("?")) {
    //     userSession = `&userId=${userId}&lastActivityTime=${formatCurrentDate()}`
    // }else{
    //     userSession = `?userId=${userId}&lastActivityTime=${formatCurrentDate()}`
    // }
    console.log("get method called----------", {
      method: "GET",
      endpoint,
    });

    try {
      const { data } = await axios({
        method: "GET",
        url: `${baseUrl}/${endpoint}${userSession}`,
        // url: `${endpoint}`,
        headers: {
          // "Authorization": token,
          "access-control-allow-origin": "*",
        },
      });
      console.log("data-----", data);
      return data;
    } catch (err) {
      console.log("Server error----->", err);
      return {
        isError: true,
        error: err,
      };
    }
  }

  async function getFormAllQuestions(id) {
    const response = await getSurveyData(
      `sky/getAllOptionListBySurveyId?surveyId=${id}`
    );

    if (response === "something went wrong") {
      setQuestions([]);
      return;
    } else {
      setQuestions(response.surveyData);
      setSurveyBasicDetails({
        name: response.surveyData[0]?.surveyName,
        image: response.surveyData[0]?.surveyImagePath,
      });

      // Extract and store basic settings
      const basicSettings = response.surveyBasicSetting?.basicSetting || {};
      setSurveySettings(basicSettings);

      // Extract and store completion rules
      const completionRule = response.completionRules?.completionRule || {};
      setSurveyRules({ completionRule });
      console.log("Completion Rules-------->", completionRule);

      setAllAnswers({
        responseData: {
          org: "",
          surveyId: response.surveyData[0]?.data?.question?.surveyId,
          result: response.surveyData?.map((item) => ({
            questionId: item?.data?.question?.uuid,
            question: item?.data?.question?.title,
            type: item?.data?.question?.quesType,
            answer: [],
          })),
        },
      });
    }
  }

  const [surveyRules, setSurveyRules] = useState({
    completionRule: {},
  });

  const [surveySettings, setSurveySettings] = useState({
    buttons: {},
    questions: {},
    questionView: {},
  });

  function onChoiceChangeHandlerProNps(
    index,
    type,
    quesId,
    event,
    rowids,
    qtext,
    title
  ) {
    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );

    if (indexItem == -1) {
      d.responseData.result.push({
        question: title,
        questionId: quesId,
        type: "single-choice",

        answer: [
          {
            rowId: rowids,
            rowValue: qtext,
            createdDate: getFormattedDate(),
          },
        ],
      });
    } else {
      d.responseData.result[indexItem].answer = [
        {
          rowId: rowids,
          rowValue: qtext,
          createdDate: getFormattedDate(),
        },
      ];
    }
  }

  function onSelectChangeHandler(
    index,
    type,
    quesId,
    uuid,
    rowids,
    qText = ""
  ) {
    let p = [...selectOptionsThings];
    if (p.some((item) => item?.quesId === quesId)) {
      let z = p.findIndex((item) => item?.quesId === quesId);
      p[z] = {
        quesId,
        rowids,
        qText,
        createdDate: getFormattedDate(),
      };
    } else {
      p.push({
        quesId,
        rowids,
        qText,
        createdDate: getFormattedDate(),
      });
    }

    setselectOptionsThings([...p]);

    const questioniiis = questions.filter(
      (item) => item?.data?.question?.uuid === quesId
    );

    let rowQues = questioniiis[0]?.data?.question?.options?.row.filter(
      (item) => item.uuid === uuid
    );

    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );

    d.responseData.result[indexItem].answer = [
      {
        rowId: uuid,
        rowValue: rowQues[0].text,
        createdDate: getFormattedDate(),
      },
    ];

    setselectOptionId("");
  }

  const formatCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensures two digits
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  };

  function onTextChangeHandler(index, type, quesId, rowids, qText = "", event) {
    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );
    d.responseData.result[indexItem].answer = [
      {
        rowId: rowids,
        rowValue: event?.target.value,
        createdDate: getFormattedDate(),
      },
    ];
  }

  // Split questions based on separator (separation between pages)
  const pages = questions?.reduce(
    (acc, item, index) => {
      if (item?.data?.separator) {
        // Start a new page after this item (separator).
        acc.push([item]);
      } else {
        // Add item to the current page
        acc[acc.length - 1].push(item);
      }
      return acc;
    },
    [[]]
  ); // Initializing with an empty first page

  console.log("pages---->", pages);

  // Get the questions for the current page
  const currentQuestions = pages[currentPage] || [];
  console.log("currentQuestions----->", currentQuestions);

  function npsSelectHandler(index, type, quesId, rowids, rating) {
    let p = [...npsOptionsThings];
    if (p.some((item) => item?.quesId === quesId)) {
      let z = p.findIndex((item) => item?.quesId === quesId);
      p[z] = {
        quesId,
        rowids,
        rating,
        createdDate: getFormattedDate(),
      };
    } else {
      p.push({
        quesId,
        rowids,
        rating,
        createdDate: getFormattedDate(),
      });
    }

    setnpsOptionsThings([...p]);
    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );
    ////console.log(indexItem)
    ////console.log(d.responseData.result[indexItem])
    d.responseData.result[indexItem].answer = [
      {
        rowId: rowids,
        rowValue: rating,
        createdDate: getFormattedDate(),
      },
    ];
    ////console.log(d)
  }

  function multinpsSelectHandler(index, type, quesId, rowids, rating, rowText) {
    let p = [...multinpsOptionsThings];
    if (p.some((item) => item?.quesId === quesId)) {
      let z = p.findIndex((item) => item?.quesId === quesId);

      if (p[z].answer.some((item) => item?.rowids === rowids)) {
        //alert()
        let t = p[z].answer.findIndex((i) => i.rowids === rowids);

        p[z].answer[t] = {
          rowids,
          rating,
          rowText,
          createdDate: getFormattedDate(),
        };
      } else {
        p[z].answer.push({
          rowids,
          rating,
          rowText,
          createdDate: getFormattedDate(),
        });
      }
    } else {
      p.push({
        quesId,
        answer: [
          {
            rowids,
            rating,
            rowText,
            createdDate: getFormattedDate(),
          },
        ],
      });
    }

    setmultinpsOptionsThings([...p]);
    // return
    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );

    d.responseData.result[indexItem].answer.push({
      rowId: rowids,
      rowValue: rating,
      rowText,
      createdDate: getFormattedDate(),
    });
  }

  const renderNPS = (question) => {
    ////console.log(question)
    const ratings = Array.from({ length: 11 }, (_, i) => i);
    switch (question.quesType) {
      case "nps":
        return (
          <Row className="mt-1 g-0 rounded overflow-hidden text-center">
            {ratings.map((rating, index) => (
              <Col key={rating} className="p-0">
                <Form.Check
                  type="radio"
                  id={`nps-${question.id}-${rating}`}
                  name={`nps-${question.id}`}
                  className="h-100 m-0 p-0 border border-1"
                >
                  <Form.Check.Input type="radio" className="d-none" />
                  <Form.Check.Label
                    style={{
                      background: `${getBackgroundColor(rating)}`,
                      cursor: "pointer",
                      border: npsOptionsThings?.some(
                        (item) =>
                          item.rating === rating &&
                          question.uuid === item?.quesId
                      )
                        ? "1px solid blue "
                        : "",
                    }}
                    className={` p-2 d-flex  justify-content-center align-items-center m-0 w-100 h-100`}
                    onClick={() =>
                      npsSelectHandler(
                        index,
                        "nps",
                        question?.uuid,
                        question?.options?.row[0]?.uuid,
                        rating
                      )
                    }
                  >
                    {rating}
                  </Form.Check.Label>
                </Form.Check>
              </Col>
            ))}
            <div className="mt-2 text-muted small d-flex justify-content-between">
              <p>Least Likely</p>
              <p>Most Likely</p>
            </div>
          </Row>
        );
      case "multi-nps":
        return (
          <>
            <Row className="mt-1 g-0  rounded overflow-hidden text-center">
              {question.options.row.map((option, index) => {
                ////console.log("optionoptionoption----------", option);

                function borderChecker(raweid, rating) {
                  let c = multinpsOptionsThings?.some(
                    (item) => question.uuid === item?.quesId
                  );
                  ////console.log("C", c)
                  if (c) {
                    const ind = multinpsOptionsThings?.findIndex(
                      (item) => question.uuid === item?.quesId
                    );
                    ////console.log("ind", ind)
                    let y = multinpsOptionsThings[ind]?.answer.some(
                      (item) =>
                        item?.rowids === raweid && item?.rating === rating
                    );
                    ////console.log("yyyy, y", y)
                    if (y) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
                return (
                  <>
                    <p className="m-0 mt-4 text-start">{option.text}</p>

                    {ratings.map((rating, index) => (
                      <Col key={rating} className="p-0">
                        <Form.Check
                          type="radio"
                          id={`nps-${index}`} // Unique ID for each radio button
                          name={`nps-${question.id}`} // Same name for all radio buttons in this question
                          className="h-100 m-0 p-0"
                        >
                          <Form.Check.Input type="radio" className="d-none" />
                          <Form.Check.Label
                            className={`p-2  d-flex justify-content-center align-items-center m-0 w-100 h-100`}
                            htmlFor={`nps-${index}`} // Correct binding with radio input's ID
                            onClick={() =>
                              multinpsSelectHandler(
                                index,
                                "multi-nps",
                                question?.uuid,
                                option?.uuid,
                                rating,
                                option.text
                              )
                            }
                            style={{
                              background: `${getBackgroundColor(rating)}`,
                              cursor: "pointer",
                              border: borderChecker(option?.uuid, rating)
                                ? "1px solid blue "
                                : "",
                            }}
                          >
                            {rating}
                          </Form.Check.Label>
                        </Form.Check>
                      </Col>
                    ))}
                    <div className="mt-2 text-muted small d-flex justify-content-between">
                      <p>Least Likely</p>
                      <p>Most Likely</p>
                    </div>
                  </>
                );
              })}
            </Row>
          </>
        );

      case "pro-nps":
        return (
          <Row className="mt-1 g-0 rounded overflow-hidden text-center">
            {ratings.map((rating, index) => (
              <Col key={rating} className="p-0">
                <Form.Check
                  type="radio"
                  id={`nps-${question.id}-${rating}`}
                  name={`nps-${question.id}`}
                  className="h-100 m-0 p-0 border border-1"
                >
                  <Form.Check.Input type="radio" className="d-none" />
                  <Form.Check.Label
                    style={{
                      background: `${getBackgroundColor(rating)}`,
                      cursor: "pointer",
                      border: npsOptionsThings?.some(
                        (item) =>
                          item.rating === rating &&
                          question.uuid === item?.quesId
                      )
                        ? "1px solid blue "
                        : "",
                    }}
                    className={` p-2 d-flex  justify-content-center align-items-center m-0 w-100 h-100`}
                    onClick={() =>
                      npsSelectHandler(
                        index,
                        "nps",
                        question?.uuid,
                        question?.options?.row[0]?.uuid,
                        rating
                      )
                    }
                  >
                    {rating}
                  </Form.Check.Label>
                </Form.Check>
              </Col>
            ))}
            <div className="mt-2 text-muted small d-flex justify-content-between">
              <p>Least Likely</p>
              <p>Most Likely</p>
            </div>

            {allAnswers.responseData.result.filter(
              (item) => item.questionId === question.uuid
            )[0]?.answer[0]?.rowValue >= 0 &&
              allAnswers.responseData.result.filter(
                (item) => item.questionId === question.uuid
              )[0]?.answer[0]?.rowValue <= 6 && (
                <div div className="mt-3">
                  <p className="text-start" style={{ fontSize: "20px" }}>
                    {" "}
                    For range {
                      question?.settings?.configScale[0]?.scale?.min
                    }{" "}
                    to {question?.settings?.configScale[0]?.scale?.max}
                  </p>
                  <div className="mb-5">
                    {question?.settings?.configScale[0]?.qId[0]?.options?.row?.map(
                      (item, index) => {
                        let text = "option.text";
                        let url = "text?.split"; // Extracts everything after "https"
                        let mainURL = "";
                        return (
                          <>
                            <div
                              key={index}
                              className={`option-container w-100`}
                            >
                              <div
                                key={index}
                                className="option-item selectDivs"
                                style={{
                                  backgroundColor:
                                    selectedOptions[
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid
                                    ] === index
                                      ? "#e0f7fa"
                                      : "#f8f8f8",
                                }}
                                onClick={(e) =>
                                  handleSelectOptionProNps(
                                    index,
                                    "single-choice",
                                    question?.settings?.configScale[2]?.qId[0]
                                      ?.uuid,
                                    e,
                                    item?.uuid,
                                    item?.text,
                                    question?.settings?.configScale[1]?.qId[0]
                                      .title
                                  )
                                } // Single-choice handler
                              >
                                <span>{item?.text}</span>
                                <input
                                  className="form-check-input invisible"
                                  type="radio"
                                  name="singleChoice"
                                  id={`option-${index}`}
                                  value={item?.text}
                                  checked={
                                    selectedOptions[
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid
                                    ] === index
                                  }
                                  onChange={(e) =>
                                    handleSelectOptionProNps(
                                      index,
                                      "single-choice",
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid,
                                      e,
                                      item?.uuid,
                                      item?.text,
                                      question?.settings?.configScale[1]?.qId[0]
                                        .title
                                    )
                                  }
                                  // onChange={(e) => onChoiceChangeHandler(index, "single-choice", question?.uuid, e, item?.uuid)}
                                  style={{ marginRight: "5px" }}
                                />
                                {selectedOptions[
                                  question?.settings?.configScale[2]?.qId[0]
                                    ?.uuid
                                ] === index && <FaCheck />}
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {allAnswers.responseData.result.filter(
              (item) => item.questionId === question.uuid
            )[0]?.answer[0]?.rowValue >= 7 &&
              allAnswers.responseData.result.filter(
                (item) => item.questionId === question.uuid
              )[0]?.answer[0]?.rowValue <= 8 && (
                <div className="mt-3">
                  <p className="text-start" style={{ fontSize: "20px" }}>
                    {" "}
                    For range {
                      question?.settings?.configScale[1]?.scale?.min
                    }{" "}
                    to {question?.settings?.configScale[1]?.scale?.max}
                  </p>
                  <div className="mb-5">
                    {question?.settings?.configScale[1]?.qId[0]?.options?.row?.map(
                      (item, index) => {
                        let text = "option.text";
                        let url = "text?.split"; // Extracts everything after "https"
                        let mainURL = "";
                        return (
                          <>
                            <div
                              key={index}
                              className={`option-container w-100`}
                            >
                              <div
                                key={index}
                                className="option-item selectDivs"
                                style={{
                                  backgroundColor:
                                    selectedOptions[
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid
                                    ] === index
                                      ? "#e0f7fa"
                                      : "#f8f8f8",
                                }}
                                onClick={(e) =>
                                  handleSelectOptionProNps(
                                    index,
                                    "single-choice",
                                    question?.settings?.configScale[2]?.qId[0]
                                      ?.uuid,
                                    e,
                                    item?.uuid,
                                    item?.text,
                                    question?.settings?.configScale[1]?.qId[0]
                                      .title
                                  )
                                } // Single-choice handler
                              >
                                <span>{item?.text}</span>
                                <input
                                  className="form-check-input invisible"
                                  type="radio"
                                  name="singleChoice"
                                  id={`option-${index}`}
                                  value={item?.text}
                                  checked={
                                    selectedOptions[
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid
                                    ] === index
                                  }
                                  onChange={(e) =>
                                    handleSelectOptionProNps(
                                      index,
                                      "single-choice",
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid,
                                      e,
                                      item?.uuid,
                                      item?.text,
                                      question?.settings?.configScale[1]?.qId[0]
                                        .title
                                    )
                                  }
                                  // onChange={(e) => onChoiceChangeHandler(index, "single-choice", question?.uuid, e, item?.uuid)}
                                  style={{ marginRight: "5px" }}
                                />
                                {selectedOptions[
                                  question?.settings?.configScale[2]?.qId[0]
                                    ?.uuid
                                ] === index && <FaCheck />}
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {allAnswers.responseData.result.filter(
              (item) => item.questionId === question.uuid
            )[0]?.answer[0]?.rowValue >= 9 &&
              allAnswers.responseData.result.filter(
                (item) => item.questionId === question.uuid
              )[0]?.answer[0]?.rowValue <= 10 && (
                <div className="mt-3">
                  <p className="text-start" style={{ fontSize: "20px" }}>
                    {" "}
                    For range {
                      question?.settings?.configScale[2]?.scale?.min
                    }{" "}
                    to {question?.settings?.configScale[2]?.scale?.max}
                  </p>
                  <div className="mb-5">
                    {question?.settings?.configScale[2]?.qId[0]?.options?.row?.map(
                      (item, index) => {
                        let text = "option.text";
                        let url = "text?.split"; // Extracts everything after "https"
                        let mainURL = "";
                        //console.log(selectedOptions[question?.uuid])
                        //console.log(index)
                        return (
                          <>
                            <div
                              key={index}
                              className={`option-container w-100`}
                            >
                              <div
                                key={index}
                                className="option-item selectDivs"
                                style={{
                                  backgroundColor:
                                    selectedOptions[
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid
                                    ] === index
                                      ? "#e0f7fa"
                                      : "#f8f8f8",
                                }}
                                onClick={(e) =>
                                  handleSelectOptionProNps(
                                    index,
                                    "single-choice",
                                    question?.settings?.configScale[2]?.qId[0]
                                      ?.uuid,
                                    e,
                                    item?.uuid,
                                    item?.text,
                                    question?.settings?.configScale[1]?.qId[0]
                                      .title
                                  )
                                } // Single-choice handler
                              >
                                <span>{item?.text}</span>
                                <input
                                  className="form-check-input invisible"
                                  type="radio"
                                  name="singleChoice"
                                  id={`option-${index}`}
                                  value={item?.text}
                                  checked={
                                    selectedOptions[
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid
                                    ] === index
                                  }
                                  onChange={(e) =>
                                    handleSelectOptionProNps(
                                      index,
                                      "single-choice",
                                      question?.settings?.configScale[2]?.qId[0]
                                        ?.uuid,
                                      e,
                                      item?.uuid,
                                      item?.text,
                                      question?.settings?.configScale[1]?.qId[0]
                                        .title
                                    )
                                  }
                                  // onChange={(e) => onChoiceChangeHandler(index, "single-choice", question?.uuid, e, item?.uuid)}
                                  style={{ marginRight: "5px" }}
                                />
                                {selectedOptions[
                                  question?.settings?.configScale[2]?.qId[0]
                                    ?.uuid
                                ] === index && <FaCheck />}
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
          </Row>
        );

      default:
        return null;
    }
  };

  const getBackgroundColor = (rating) => {
    if (rating <= 6) return "rgb(255, 204, 201)";
    if (rating <= 8) return "rgb(255, 219, 148)";
    return "rgb(153, 229, 197)";
  };

  // Handle page navigation for next page
  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle page navigation for previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const [selectedOptions, setSelectedOptions] = useState({}); // For multi-choice

  const [selectedOption, setSelectedOption] = useState([]); // For single-choice

  const handleSelectOption = (index, type, quesId, event, rowids, qtext) => {
    event.stopPropagation();
    if (type === "single-choice") {
      setSelectedOptions((prev) => ({
        ...prev,
        [quesId]: prev[quesId] === index ? null : index, // Deselect if the same option is clicked
      }));
    } else if (type === "multi-choice") {
      setSelectedOptions((prev) => ({
        ...prev,
        [quesId]: prev[quesId]
          ? prev[quesId].includes(index)
            ? prev[quesId].filter((i) => i !== index) // Remove the index if it's already selected
            : [...prev[quesId], index] // Add the index if it's not selected
          : [index], // If no options are selected yet, initialize the array with this index
      }));
    }

    onChoiceChangeHandler(index, type, quesId, event, rowids, qtext);
  };

  function onChoiceChangeHandler(index, type, quesId, event, rowids, qtext) {
    //console.log("------>", allAnswers);
    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );

    if (type === "multi-choice") {
      if (!d.responseData.result[indexItem]) {
        d.responseData.result[indexItem] = { questionId: quesId, answer: [] };
      }

      const existingAnswerIndex = d.responseData.result[
        indexItem
      ].answer.findIndex((item) => item.rowId === rowids);

      if (existingAnswerIndex > -1) {
        // Remove the item if it exists
        d.responseData.result[indexItem].answer.splice(existingAnswerIndex, 1);
      } else {
        // Add the item if it doesn't exist
        d.responseData.result[indexItem].answer.push({
          rowId: rowids,
          rowValue: qtext,
          createdDate: getFormattedDate(),
        });
      }
    }

    if (type === "single-choice") {
      d.responseData.result[indexItem].answer = [
        {
          rowId: rowids,
          rowValue: qtext,
          createdDate: getFormattedDate(),
        },
      ];
    }
    //console.log("Updated allAnswers: ", d);
  }

  const handleSelectOptionProNps = (
    index,
    type,
    quesId,
    event,
    rowids,
    qtext,
    title
  ) => {
    if (type === "single-choice") {
      setSelectedOptions((prev) => ({
        ...prev,
        [quesId]: prev[quesId] === index ? null : index, // Deselect if the same option is clicked
      }));
    } else if (type === "multi-choice") {
      setSelectedOptions((prev) => ({
        ...prev,
        [quesId]: prev[quesId]
          ? prev[quesId].includes(index)
            ? prev[quesId].filter((i) => i !== index) // Remove the index if it's already selected
            : [...prev[quesId], index] // Add the index if it's not selected
          : [index], // If no options are selected yet, initialize the array with this index
      }));
    }
    onChoiceChangeHandlerProNps(
      index,
      type,
      quesId,
      event,
      rowids,
      qtext,
      title
    );
  };

  const handleAutocompleteChange = (
    event,
    newSelectedCities,
    quesId,
    qText = ""
  ) => {
    // Update the selected cities for the specific question (quesId)
    setSelectedCitiesByQuestion((prevState) => ({
      ...prevState,
      [quesId]: newSelectedCities,
    }));

    // If needed, you can also update your `allAnswers` or other logic here
    let rowIds = newSelectedCities.map((item) => item?.uuid);
    let d = { ...allAnswers };
    let indexItem = d.responseData.result.findIndex(
      (item) => item?.questionId === quesId
    );
    if (indexItem !== -1) {
      d.responseData.result[indexItem].answer.push({
        rowId: rowIds[rowIds.length - 1].toString(),
        rowValue: newSelectedCities[newSelectedCities.length - 1]?.text,
        createdDate: getFormattedDate(),
      });
    }
  };

  const [selectedCitiesByQuestion, setSelectedCitiesByQuestion] = useState({});

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Custom function to calculate elapsed time in "HH:MM:SS" format
  function calculateTimeDuration() {
    if (!startTime) return "00:00:00";

    const now = new Date();
    const elapsedMilliseconds = now - startTime;
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}-${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][date.getMonth()]
    }-${date.getFullYear()} ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;

  async function SubmitHandler() {
    const validateAnswers = (data) => {
      const result = data?.responseData?.result;
      return (
        result &&
        result.length > 0 &&
        result.every((item) => item.answer && item.answer.length > 0)
      );
    };

    const isValid = validateAnswers(allAnswers);

    if (isValid) {
      try {
        let ipInfo = {};

        try {
          const ipInfoResponse = await fetch(
            "https://ipinfo.io/json?token=6a62dadbf58d67"
          );

          if (!ipInfoResponse.ok) {
            throw new Error(
              `IPInfo fetch failed: ${ipInfoResponse.statusText}`
            );
          }

          ipInfo = await ipInfoResponse.json();
        } catch (err) {
          console.error("Error fetching IP info:", err.message, err);
          toast.error("Failed to fetch IP information. Proceeding without it.");
          ipInfo = {
            city: "Unknown",
            region: "Unknown",
            postal: "Unknown",
            loc: "Unknown",
            country: "Unknown",
            ip: "Unknown",
          };
        }

        const userAgent = navigator.userAgent;
        const osName = navigator.platform;
        const deviceType = /Mobi|Android/i.test(userAgent)
          ? "Mobile"
          : "Desktop";

        const payload = {
          responseData: {
            org: "",
            uuid: "",
            surveyId: surveyId,
            collectId: collectId,
            collectorName: "",
            userName: "",
            userId: userId || "Anonymous",
            city: ipInfo.city || "Unknown",
            state: ipInfo.region || "Unknown",
            postal: ipInfo.postal || "Unknown",
            region: ipInfo.region || "Unknown",
            loc: ipInfo.loc || "Unknown",
            country: ipInfo.country || "Unknown",
            ipAddress: ipInfo.ip || "Unknown",
            createdDate: formatDate(new Date()),
            userAgent: userAgent,
            deviceInfo: `${osName} - ${userAgent}`,
            deviceType: deviceType,
            timeDuration: calculateTimeDuration(), // Replace with your duration calculation
            osName: osName,
            startDate: formatDate(new Date()), // Replace with the actual start date
            endDate: formatDate(new Date()),
            language: navigator.language || "Unknown",
            surveyName: surveyBasicDestails.name || "Unknown Survey",
            medium: medium || "",
            respondentUniqueId: "",
            responseStatus: "Completed",
            result: allAnswers.responseData.result.map((item) => ({
              questionId: item.questionId,
              question: item.question,
              type: item.type,
              answer: item.answer.map((answer) => ({
                rowId: answer.rowId,
                rowValue: answer.rowValue,
                createdDate: formatDate(new Date()), // Format: DD/MM/YYYY
              })),
            })),
          },
        };

        const response = await axios.post(
          `${baseUrl}/sky/saveSurveyResponse`,
          payload
        );
        console.log("Response:", response);

        if (
          response.data === "Data saved successfully!" ||
          response.data === "Quota Meet" ||
          response.data === "Quota Exceed" ||
          response.data === "response capture successfully"
        ) {
          toast.success("Response Saved Successfully!");
          setTimeout(() => {
            const respondentMessage =
              surveyRules?.completionRule?.revisitingRespondent?.value;

            if (surveyRules?.completionRule?.quotaFull?.type === "URL") {
              if (response.data === "Quota Exceed") {
                window.location.href =
                  surveyRules?.completionRule?.quotaFull?.value;
                return;
              }
            }

            if (surveyRules?.completionRule?.quotaMeet?.type === "URL") {
              if (response.data === "Quota Meet") {
                window.location.href =
                  surveyRules?.completionRule?.quotaMeet?.value;
                return;
              }
            }

            if (surveyRules?.completionRule?.quotaFull?.type === "Message") {
              if (response.data === "Quota Exceed") {
                navigate(
                  `/surveyPublish/${surveyId}/thankyou?status=quota-exceed&message=${respondentMessage}`
                );
                return;
              }
            }

            if (surveyRules?.completionRule?.quotaMeet?.type === "Message") {
              if (response.data === "Quota Meet") {
                navigate(
                  `/surveyPublish/${surveyId}/thankyou?status=quota-meet&message=${respondentMessage}`
                );
                return;
              }
            }

            // Fallback if no conditions match
            navigate(`/surveyPublish/${surveyId}/thankyou`);
          }, 3000);
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error) {
        console.error("Error during submission:", error.message, error);
        toast.error("Something went wrong while saving the response.");
      }
    } else {
      toast.error("Please, Enter all answers");
    }
  }

  // async function SubmitHandler() {
  //   const validateAnswers = (data) => {
  //     // Ensure the data structure exists and contains results
  //     const result = data?.responseData?.result;
  //     //console.log("result-----", result)
  //     // If result is not available or is empty, validation fails
  //     if (!result || result.length === 0) {
  //       //console.log(result)
  //       return false;
  //     }

  //     // Check if every item has non-empty answers
  //     return result.every((item) => item?.answer && item.answer.length > 0);
  //   };

  //   const isValid = validateAnswers(allAnswers);

  //   if (isValid) {
  //     async function saveSurveyResponseData(
  //       endpoint,
  //       payload,
  //       headers = false
  //     ) {
  //       let userSession = ``;
  //       console.log("userSession------", userSession);
  //       if (endpoint.includes("?")) {
  //         userSession = `&userId=${userId}&lastActivityTime=${formatCurrentDate()}`;
  //       } else {
  //         userSession = `?userId=${userId}&lastActivityTime=${formatCurrentDate()}`;
  //       }
  //       console.log("post method called----------", {
  //         method: "POST",
  //         endpoint,
  //         payload,
  //       });
  //       let Head;

  //       if (headers === true) {
  //         Head = {
  //           "Content-Type": "text/plain", // or 'application/json' based on API requirements
  //         };
  //       } else {
  //         Head = {
  //           "Content-Type": "application/json", // or 'application/ json' based on API requirements
  //         };
  //       }

  //       try {
  //         const { data } = await axios({
  //           method: "POST",
  //           url: `${baseUrl}/${endpoint}${userSession}`,
  //           // url: `${}${endpoint}`,
  //           headers: Head,
  //           data: payload,
  //         });
  //         console.log("data-----", data);
  //         return data;
  //       } catch (err) {
  //         console.log("Server error----->", err);
  //         return {
  //           isError: true,
  //           error: err,
  //         };
  //       }
  //     }
  //     let response = await saveSurveyResponseData(
  //       `sky/saveSurveyResponse`,
  //       allAnswers
  //     );
  //     ////console.log("response------", response)
  //     if (response === "Data saved successfully!") {
  //       toast.success("Response Saved Successfully!");
  //       setTimeout(() => {
  //         navigate(`/surveyPublish/${id}/thankyou`);
  //         // window.location.reload()
  //       }, 3000);
  //     } else {
  //       toast.error("Something went wrong!");
  //     }
  //   } else {
  //     toast.error("Please, Enter all answers");
  //   }
  // }

  function removeOptionItemHandler(quesId) {
    let p = [...selectOptionsThings];
    if (p.some((item) => item?.quesId === quesId)) {
      let z = p.findIndex((item) => item?.quesId === quesId);
      p.splice(z, 1);
    }

    setselectOptionsThings([...p]);
  }
  ////console.log("selectOptionsThings-----", selectOptionsThings)

  // const showExitButton = surveySettings.buttons?.exit?.show;
  return (
    <div className="w-100" style={{ background: "white" }}>
      <ToastContainer />
      <div className="PublishPreviewHeader w-100 d-flex justify-content-between align-items-center">
        <div className="publishSurveyLogoContainer d-flex gap-3 align-items-center">
          <img src={surveyBasicDestails?.image} alt="" className="w-100" />
          <h3 className="p-0 m-0">{surveyBasicDestails?.name}</h3>
        </div>
        <div style={{ display: "flex", marginInlineEnd: "20px", gap: "10px" }}>
          {/* {surveySettings.buttons?.exit?.enabled && ( */}
          {/* <a
            style={{ display: "flex", gap: "10px" }}
            href={`${surveyRules?.completionRule?.exitPage?.url}`}
            rel="noreferrer"
            className="btn btn-primary"
          >
            {surveySettings.buttons?.okay?.text}
          </a> */}
          {/* )} */}
          {surveySettings.buttons?.exit?.enabled && (
            <a
              style={{
                display: "flex",
                gap: "10px",
              }}
              href={`${surveyRules?.completionRule?.exitPage?.url}`}
              // href="https://www.google.com"
              rel="noreferrer"
              className="btn customButton"
            >
              {surveySettings.buttons?.exit?.text}
            </a>
          )}
        </div>
      </div>

      <div className="d-flex flex-column align-items-center gap-5 PublisquesContainer">
        {/* Render current page's questions */}
        {currentQuestions?.map((item, index) => {
          let { question } = item?.data;
          const text = question?.title;
          const regex = /{{p:\/\/(.*?)}}/; // Regular expression to match the text between {{p:// and }}
          const match = text.match(regex);
          let qTitle;

          console.log(match);
          if (match) {
            console.log("allansawersss--->", allAnswers);
            let t = allAnswers.responseData.result.filter(
              (item) => item.question === match[1]
            );
            console.log(t);
            let textForT =
              t[0].answer.length > 0 ? t[0].answer[0].rowValue : "";
            let b = question?.title.split("{{");
            qTitle = `${b[0]} ${textForT} `;
          } else {
            qTitle = question?.title;
          }
          return (
            <div className="mt-2 w-75" key={index}>
              {/* Show the 'Next' button only if we are at the current page with a separator */}
              {item?.data?.separator && currentPage === 0 && (
                <div className="d-flex justify-content-end mb-5">
                  <button className="btn btn-primary" onClick={goToNextPage}>
                    Next
                  </button>
                </div>
              )}

              <p className="Publishquestitle">
                {surveySettings.questions?.numbers && `${index + 1}. `}
                {qTitle}{" "}
                {surveySettings.questions?.reqAstrick && (
                  <label htmlFor="" className="text-danger">
                    *
                  </label>
                )}
              </p>

              {/* Render questions based on type */}
              <div className="">
                {/* {
                      question?.quesType === "single-choice" && (
                          <div className="d-flex flex-wrap gap-4 flex-column">
                              {question?.options?.row?.filter((item) => !item?.hidden)?.map((item, index) => (
                                  <div className="form-check w-25" key={index}>
                                      <input className="form-check-input" style={{ borderColor: 'black' }} type="radio" name="flexRadioDisabled" id="flexRadioCheckedDisabled" />
                                      <label className="form-check-label" htmlFor="flexRadioCheckedDisabled">
                                          {item?.text}
                                      </label>
                                  </div>
                              ))}
                          </div>
                      )
                  } */}

                {question?.quesType === "single-choice" && (
                  <div className="d-flex flex-column gap-2">
                    {question?.options?.row
                      ?.filter((item) => !item?.hidden)
                      ?.map((item, index) => (
                        <div
                          key={index}
                          className="option-item selectDivs"
                          style={{
                            backgroundColor:
                              selectedOptions[question?.uuid] === index
                                ? "#e0f7fa"
                                : "#f8f8f8",
                          }}
                          onClick={(e) =>
                            handleSelectOption(
                              index,
                              "single-choice",
                              question?.uuid,
                              e,
                              item?.uuid,
                              item?.text
                            )
                          } // Single-choice handler
                        >
                          <span>{item?.text}</span>
                          <input
                            className="form-check-input invisible"
                            type="radio"
                            name={`singleChoice-${question?.uuid}`} // Unique name for each question
                            id={`option-${index}`}
                            value={item?.text}
                            checked={selectedOptions[question?.uuid] === index}
                            onChange={(e) =>
                              handleSelectOption(
                                index,
                                "single-choice",
                                question?.uuid,
                                e,
                                item?.uuid,
                                item?.text
                              )
                            } // Handle selection
                            style={{ marginRight: "5px" }}
                          />
                          {selectedOptions[question?.uuid] === index && (
                            <FaCheck />
                          )}{" "}
                          {/* Show checkmark if selected */}
                        </div>
                      ))}
                  </div>
                )}

                {question?.quesType === "multi-choice" && (
                  <div className="d-flex flex-wrap gap-4 flex-column">
                    {question?.options?.row
                      ?.filter((item) => !item?.hidden)
                      ?.map((item, index) => (
                        <div
                          key={index}
                          className="option-item selectDivs"
                          style={{
                            backgroundColor: selectedOptions[
                              question?.uuid
                            ]?.includes(index)
                              ? "#e0f7fa"
                              : "#f8f8f8",
                          }}
                          onClick={(e) =>
                            handleSelectOption(
                              index,
                              "multi-choice",
                              question?.uuid,
                              e,
                              item?.uuid,
                              item?.text
                            )
                          }
                        >
                          <span>{item?.text}</span>
                          <input
                            className="form-check-input invisible"
                            type="checkbox"
                            id={`option-${index}`}
                            value={item?.text}
                            checked={selectedOptions[question?.uuid]?.includes(
                              index
                            )}
                            onChange={(e) =>
                              handleSelectOption(
                                index,
                                "multi-choice",
                                question?.uuid,
                                e,
                                item?.uuid,
                                item?.text
                              )
                            }
                            style={{ marginRight: "5px" }}
                          />
                          {selectedOptions[question?.uuid]?.includes(index) && (
                            <FaCheck />
                          )}
                        </div>
                      ))}
                  </div>
                )}

                {question?.quesType === "single-text" && (
                  <div>
                    {/* <input type="text" placeholder="Enter your value" className="w-100 enterTextInput" onChange={() => {
                                                onTextChangeHandler()
                                            }} /> */}

                    {question?.options?.row
                      ?.filter((item) => !item?.hidden)
                      ?.map((item, index) => (
                        <input
                          type="text"
                          placeholder="Enter your value"
                          className="w-100 enterTextInput"
                          onChange={(event) => {
                            onTextChangeHandler(
                              index,
                              "single-text",
                              question?.uuid,
                              item?.uuid,
                              item?.text,
                              event
                            );
                          }}
                        />
                      ))}
                  </div>
                )}

                {question?.quesType === "long-text" && (
                  <div>
                    <textarea
                      rows={3}
                      cols={3}
                      placeholder="Enter your value"
                      className="w-100 enterTextInput"
                    />
                  </div>
                )}

                {question?.quesType === "multi-select-dropdown" && (
                  <div className="card flex justify-content-center">
                    <Autocomplete
                      multiple
                      id={`checkboxes-tags-demo-${question?.uuid}`} // Unique ID for each question
                      options={question?.options?.row}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option?.text}
                      onChange={(event, newSelectedCities) =>
                        handleAutocompleteChange(
                          event,
                          newSelectedCities,
                          question?.uuid
                        )
                      } // Pass quesId
                      value={selectedCitiesByQuestion[question?.uuid] || []} // Pass the selected cities for this specific question
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.text}
                        </li>
                      )}
                      style={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Search" />
                      )}
                    />
                  </div>
                )}

                {question?.quesType === "multi-text" && (
                  <div>
                    <div>
                      <label htmlFor="">Option 1</label>
                      <input
                        type="text"
                        placeholder="Enter your value"
                        className="w-100 enterTextInput"
                      />
                    </div>
                    <div className="mt-3">
                      <label htmlFor="">Option 2</label>
                      <input
                        type="text"
                        placeholder="Enter your value"
                        className="w-100 enterTextInput"
                      />
                    </div>
                  </div>
                )}

                {question?.quesType === "dropdown" && (
                  <>
                    <div className="d-none">
                      <select
                        name=""
                        id=""
                        className="w-100 mt-3 selectContainer"
                        onChange={(e) =>
                          onSelectChangeHandler(
                            index,
                            "dropdown",
                            question?.uuid,
                            e,
                            item?.uuid,
                            item?.text
                          )
                        }
                      >
                        <option value="">Select from dropdown</option>
                        {question?.options?.row
                          ?.filter((item) => !item?.hidden)
                          ?.map((item, index) => (
                            <option value={item.uuid} key={index}>
                              {item.text}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <div
                        className="mt-2 d-flex justify-content-between"
                        onClick={() => {
                          selectOptionId === question?.uuid
                            ? setselectOptionId("")
                            : setselectOptionId(question?.uuid);
                        }}
                        style={{ borderBottom: "1px solid grey" }}
                      >
                        {selectOptionsThings?.some(
                          (item) => item.quesId === question?.uuid
                        ) ? (
                          <div className="d-flex w-100 align-items-center justify-content-between ">
                            <p
                              className="p-2 rounded"
                              style={{ border: "1px solid purple" }}
                            >
                              {" "}
                              {
                                selectOptionsThings?.filter(
                                  (item) => item.quesId === question?.uuid
                                )[0]?.qText
                              }
                              <span
                                className="ms-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  removeOptionItemHandler(question?.uuid);
                                }}
                              >
                                x
                              </span>
                            </p>
                            {selectOptionId === question?.uuid ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )}
                          </div>
                        ) : (
                          <div
                            className="d-flex  justify-content-between w-100"
                            style={{ cursor: "pointer" }}
                          >
                            <p>Select from given options</p>
                            {selectOptionId === question?.uuid ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )}
                          </div>
                        )}
                      </div>

                      {selectOptionId === question?.uuid && (
                        <div
                          className="p-1 mt-1"
                          style={{
                            border: "1px solid black",
                            height: "200px",
                            overflowY: "scroll",
                            scrollbarWidth: "thin",
                          }}
                        >
                          {question?.options?.row
                            ?.filter((item) => !item?.hidden)
                            ?.map((item, index) => (
                              <p
                                className="p-1"
                                style={{
                                  borderBottom: "1px solid black",
                                  cursor: "pointer",
                                }}
                                value={item.uuid}
                                key={index}
                                onClick={(e) =>
                                  onSelectChangeHandler(
                                    index,
                                    "dropdown",
                                    question?.uuid,
                                    item.uuid,
                                    item?.uuid,
                                    item?.text
                                  )
                                }
                              >
                                {item.text}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {question?.quesType === "nps" && (
                  <div>
                    {renderNPS(question)}
                    {/* <div className="mt-2 text-muted small d-flex justify-content-between">
                                                <p>Least Likely</p>
                                                <p>Most Likely</p>
                                            </div> */}
                  </div>
                )}
                {question?.quesType === "multi-nps" && (
                  <div>
                    {renderNPS(question)}

                    {/* <div className="mt-2 text-muted small d-flex justify-content-between">
                                                <p>Least Likely</p>
                                                <p>Most Likely</p>
                                            </div> */}
                  </div>
                )}
                {question?.quesType === "pro-nps" && (
                  <div>
                    {renderNPS(question)}

                    {/* <div className="mt-2 text-muted small d-flex justify-content-between">
                                                <p>Least Likely</p>
                                                <p>Most Likely</p>
                                            </div> */}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Show the "Next" button only if there are more pages left */}

        <div className="d-flex justify-content-between mb-5 p-2 w-75">
          {currentPage > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={goToPreviousPage}
            >
              {surveySettings.buttons?.prev?.text || "Previous"}
            </button>
          )}
          {currentPage < pages.length - 1 && (
            <button className="btn btn-primary btn-sm" onClick={goToNextPage}>
              {surveySettings.buttons?.next?.text || "Next"}
            </button>
          )}
          {currentPage === pages.length - 1 && (
            <button className="btn btn-primary" onClick={SubmitHandler}>
              {surveySettings.buttons?.submit?.text || "Submit"}
            </button>
          )}
        </div>

        {/* Show the "Previous" button only if we are not on the first page */}
        {/* {currentPage > 0 && (
                    <div className="d-flex justify-content-start mb-5">
                       
                    </div>
                )} */}
      </div>
    </div>
  );
}
