import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaChartBar, FaLink } from "react-icons/fa";
import { IoArrowUpCircleOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { processSingleChoiceData, surveyApi } from "../api/surveyApi.jsx";
import CollectComp from "../components/CollectComp.jsx";
import Preview from "../components/Preview/Preview.jsx";
import { ChoiceQuestion } from "../components/questions/ChoiceQuestion.jsx";
import { NPSQuestion } from "../components/questions/NPSQuestion.jsx";
import { TextboxQuestion } from "../components/questions/TextboxQuestion.jsx";
import Rightbar from "../components/Rightbar.jsx";
import RightbarLogic from "../components/RightbarLogic.jsx";
import Settingscomp from "../components/Settingscomp.jsx";
import { withDeleteOption } from "../components/withDeleteOption.jsx";
import { questionCategories } from "../config/questionTypes.js";
import { getDecodedToken } from "../helpers/authFunctions.js";
import { axiosWrapper } from "../helpers/axiosWrapper.js";
import "../styles/createSurvey.css";
import QuestionPanel from "./QuestionPanel.jsx";

// Define available question components
const questionComponents = {
  "single-choice": withDeleteOption(ChoiceQuestion),
  "multi-choice": withDeleteOption(ChoiceQuestion),
  "single-text": withDeleteOption(TextboxQuestion),
  "long-text": withDeleteOption(TextboxQuestion),
  "multi-text": withDeleteOption(TextboxQuestion),
  dropdown: withDeleteOption(TextboxQuestion),
  "multi-select-dropdown": withDeleteOption(TextboxQuestion),
  nps: withDeleteOption(NPSQuestion),
  "multi-nps": withDeleteOption(NPSQuestion),
  "pro-nps": withDeleteOption(NPSQuestion),
  // multiple
  // Add other question types here as needed
};

function CreateSurvey() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [activeContainerDetails, setactiveContianerDetails] = useState({
    quesType: "",
  });
  const [pageBreaks, setPageBreaks] = useState({});
  const [surveyId, setSurveyId] = useState(null);
  const params = useParams();
  const location = useLocation();
  const id = params?.surveyid;
  const isInitialRender = useRef(true);
  const [renderItem, setrenderItem] = useState("quesComp");
  const [surveyBasicDestails, setSurveyBasicDetails] = useState({
    name: "",
    image: "",
  });
  const [showLogic, setShowLogic] = useState(false);
  const userFname = getDecodedToken()?.firstName;

  function changeComponent(comp) {
    setrenderItem(comp);
  }

  useEffect(() => {
    if (id) {
      setSurveyId(id);
    }
  }, [location]);

  useEffect(() => {
    if (id) {
      getFormAllQuestions(id);
    }
  }, []);

  useEffect(() => {
    //console.log("in useEffect")
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    updateQuestions();
  }, [questions]);

  async function getFormAllQuestions(id) {
    let response = await axiosWrapper.get(
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
    }
  }

  const addBorder = (id, e) => {
    e.stopPropagation();
    setActiveId(id); // Set the ID of the clicked div
  };

  const removeBorder = () => {
    setActiveId(null); // Clear active ID on blur or other condition
  };

  // Functions to handle opening and closing the question type selection canvas
  const handleOpenCanvas = (index) => {
    setActiveIndex(index);
    setShowCanvas(true);
  };
  const handleCloseCanvas = () => setShowCanvas(false);

  // Function to handle selection of question type
  const handleQuestionTypeSelect = (type, position) => {
    // alert(type)
    let optionTypesQuestions = [
      { name: "Single Choice", value: "single-choice" },
      { name: "Multiple Choice", value: "multi-choice" },
      { name: "Single TextBox", value: "single-text" },
      { name: "dropdown", value: "dropdown" },
      { name: "Multi Select Dropdown", value: "multi-select-dropdown" },
      { name: "Multiple TextBox", value: "multi-text" },
      { name: "long-text", value: "long-text" },
      { name: "nps", value: "nps" },
      { name: "multi-nps", value: "multi-nps" },
      { name: "Pro NPS", value: "pro-nps" },
    ];
    let v = optionTypesQuestions.filter((item) => item.name === type);
    if (v.length > 0) {
      fetchSingleChoiceData(position, v[0]?.value);
    } else {
      addNewQuestion(type, position);
    }
    handleCloseCanvas();
  };

  // Function to fetch single choice question data from the API
  const fetchSingleChoiceData = async (position, quesType) => {
    if (!surveyId) {
      toast.error("Survey ID is missing");
      return;
    }
    try {
      const data = await surveyApi.getSingleChoiceData(surveyId, quesType);
      ////console.log("Single Choice Data:", data);
      const newQuestion = processSingleChoiceData(data);
      addNewQuestion(quesType, position, newQuestion);
    } catch (error) {
      console.error("Error fetching Single Choice data:", error);
      toast.error("Failed to fetch Single Choice data");
    }
  };

  // Function to add a new question to the survey
  const addNewQuestion = async (type, position, questionData = null) => {
    const newQuestion = questionData || {
      data: {
        question: {
          quesType: "single_choice",
          rawTitle: "Click to add question text",
          options: {
            row: [],
            col: [],
          },
        },
      },
    };

    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions.splice(position, 0, newQuestion);
      return newQuestions;
    });

    setActiveQuestionId(newQuestion.data.question.uuid);

    try {
      await surveyApi.saveSurveyData(newQuestion);
      toast.success("Question Added and Saved: " + type);
    } catch (error) {
      console.error("Failed to save question:", error);
      toast.error("Question Added but Failed to Save");
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById(
          `question-${newQuestion.data.question.uuid}`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  };

  //console.log("activeQuestionId-----", activeQuestionId)
  async function updateQuestions() {
    let quesItemThatCHanged = questions?.filter(
      (item) => item?.data?.question?.uuid === activeQuestionId
    );
    if (questions.length === 0 || quesItemThatCHanged.length === 0) {
      return;
    }

    if (!activeQuestionId) {
      return;
    }
    //console.log("quesItemThatCHanged---------", quesItemThatCHanged);
    //console.log("activeContainerDetails---------", activeContainerDetails);
    if (
      activeContainerDetails?.quesType === "single-text" ||
      activeContainerDetails?.quesType === "multi-text" ||
      activeContainerDetails?.quesType === "long-text"
    ) {
      const { title } = quesItemThatCHanged[0]?.data?.question;
      await axiosWrapper.post(
        `sky/surveyTitle/${activeQuestionId}`,
        title.toString(),
        true
      );
    }

    if (
      activeContainerDetails?.quesType === "single-choice" ||
      activeContainerDetails?.quesType === "multi-choice" ||
      activeContainerDetails?.quesType === "dropdown" ||
      activeContainerDetails?.quesType === "multi-select-dropdown" ||
      activeContainerDetails?.quesType === "nps" ||
      activeContainerDetails?.quesType === "multi-nps" ||
      activeContainerDetails?.quesType === "pro-nps"
    ) {
      let { row } = quesItemThatCHanged[0]?.data?.question?.options;
      // let { row:dd } = quesItemThatCHanged[0]?.data?.question?.settings?.configScale[0]?.qId[0].options;
      const { title } = quesItemThatCHanged[0]?.data?.question;
      await axiosWrapper.post(
        `sky/surveyTitle/${activeQuestionId}`,
        title.toString(),
        true
      );
      await axiosWrapper.post(`sky/surveyOptions/${activeQuestionId}`, { row });
    }
  }

  // Function to update a question's data
  const handleQuestionUpdate = async (id, field, value, questionType, uuid) => {
    console.log("filed----->", field);
    console.log("value----->", value);
    let z = questions;

    let IndexOfquestionToUpdate = z.findIndex(
      (item) => item.data.question.uuid === id
    );

    // BELOW CODE IS TO JUST UPDATE THE SUBTEXT/DESCRIPTION OF THE QUESTIONS

    if (field === "description") {
      await axiosWrapper.post(
        `sky/addSubTitle?uuid=${activeQuestionId}&subTitleFlag=${value?.enabled}`
      );
      z[IndexOfquestionToUpdate].data.question.description.enabled =
        value?.enabled;
      setQuestions((prevQuestions) =>
        prevQuestions.map((questionWrapper, index) => {
          if (index === IndexOfquestionToUpdate) {
            return z[IndexOfquestionToUpdate];
          }
          return questionWrapper;
        })
      );
      return;
      // await axiosWrapper.post(`sky/surveyTitle/${activeQuestionId}`, { [field]: value }, true);
    }
    if (
      questionType === "single-text" ||
      questionType === "long-text" ||
      questionType === "multi-text" ||
      (questionType === "multi-select-dropdown" && field === "questionText") ||
      (questionType === "dropdown" && field === "questionText") ||
      (questionType === "nps" && field === "questionText") ||
      (questionType === "multi-nps" && field === "questionText") ||
      (questionType === "pro-nps" && field === "questionText")
    ) {
      z[IndexOfquestionToUpdate].data.question.title = value;
      //console.log("zzz", z)
      setQuestions((prevQuestions) =>
        prevQuestions.map((questionWrapper, index) => {
          if (index === IndexOfquestionToUpdate) {
            return z[IndexOfquestionToUpdate];
          }
          return questionWrapper;
        })
      );
    } else {
      if (field === "options") {
        z[IndexOfquestionToUpdate].data.question.options = value;
        setQuestions((prevQuestions) =>
          prevQuestions.map((questionWrapper, index) => {
            if (index === IndexOfquestionToUpdate) {
              return z[IndexOfquestionToUpdate];
            }
            return questionWrapper;
          })
        );
      } else {
        z[IndexOfquestionToUpdate].data.question[`${field}`] = value;
        //console.log(" z[IndexOfquestionToUpdate].data.question", z[IndexOfquestionToUpdate])
        setQuestions((prevQuestions) =>
          prevQuestions.map((questionWrapper, index) => {
            if (index === IndexOfquestionToUpdate) {
              return z[IndexOfquestionToUpdate];
            }
            return questionWrapper;
          })
        );
      }
    }
  };

  //console.log("questtttttttt------->", questions)
  // Function to delete a question from the survey
  const handleDeleteQuestion = async (id) => {
    const deleteResponse = await axiosWrapper.get(
      `sky/deleteQuestionById?questionId=${id}`
    );
    //console.log("deleteResponse--------->", deleteResponse);
    if (deleteResponse === "record deleted successfully") {
      toast.success("Question deleted.");
      setQuestions((prevQuestions) =>
        prevQuestions.filter((questionWrapper) => {
          return questionWrapper.data.question.uuid !== id;
        })
      );
      if (activeQuestionId === id) {
        setActiveQuestionId(null);
      }
    }
  };

  // Function to set the active question when clicked
  const handleQuestionClick = (id) => {
    setActiveQuestionId(id);
    let z = questions;
    let ActiveContainer = z.filter((item) => item.data.question.uuid === id);
    let quesType = ActiveContainer[0]?.data?.question?.quesType;
    setactiveContianerDetails((prev) => {
      return { ...prev, quesType: quesType };
    });
  };
  //console.log("activeContainerDetails---------", activeContainerDetails)
  // Function to toggle page breaks between questions
  const handlePageBreakToggle = (index, value) => {
    // alert((index))
    const f = questions[index];
    //console.log(f);
    //console.log(questions);
    let allQues = [...questions];
    allQues[index].data.separator = value;
    setQuestions(allQues);

    axiosWrapper.post(
      `sky/addSeparator/${f?.data?.question?.uuid}?separator=${value}`
    );
    return;
    setPageBreaks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to render the "Add Question" button and page break toggle
  const renderAddQuestionButton = (index, isLast = false) => (
    <div className="d-flex justify-content-between align-items-center my-3 position-relative">
      <div
        className="position-absolute start-50 translate-middle-x"
        style={{ zIndex: "999" }}
      >
        <Button
          variant="link"
          className="text-primary border-0 px-3 py-1 my-5 add-question-btn"
          style={{
            fontSize: "0.8rem",
            fontWeight: "normal",
          }}
          onClick={() => handleOpenCanvas(index)}
        >
          Add Question
        </Button>
        {/* <hr class="border-bottom border-3 border-dark" /> */}
      </div>
      {!isLast &&
        questions.length >= 2 &&
        index > 0 &&
        index < questions.length && (
          <>
            {" "}
            {questions[index]?.data?.separator === true ? (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ms-auto text-muted bg-white hover-light"
                  style={{
                    borderColor: "#cbd5e0",
                    fontSize: "0.8rem",
                    position: "static",
                    zIndex: "999",
                  }}
                  onClick={() => handlePageBreakToggle(index, false)}
                >
                  Remove Page Break
                </Button>

                <hr
                  class="border-bottom border-1 border-dark w-100"
                  style={{
                    position: "absolute",
                    top: "-3px",
                    left: "0",
                    zIndex: "1",
                  }}
                />
              </>
            ) : (
              <Button
                variant="outline-secondary"
                size="sm"
                className="ms-auto text-muted bg-white hover-light"
                style={{ borderColor: "#cbd5e0", fontSize: "0.8rem" }}
                onClick={() => handlePageBreakToggle(index, true)}
              >
                Page Break
              </Button>
            )}{" "}
          </>
        )}
    </div>
  );

  //console.log(questions)
  //console.log("activeId--------", activeId)
  // Main render function for the CreateSurvey component
  return (
    <>
      <ToastContainer />
      {/* Header buttons for Publish and Close */}
      <div className="d-flex justify-content-start mb-2 gap-2">
        {/* <button className="btn btn-sm btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Publish</button>
        <Link to="/survey">
          <button className="btn btn-sm btn-secondary me-2" >
            Close
          </button>
        </Link> */}
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex gap-3 align-items-center justify-content-between w-75">
            {renderItem === "quesComp" ? (
              <div className="d-flex gap-2">
                <Link to="/survey">
                  {" "}
                  <span>Cancel</span>
                </Link>
                <span>|</span>
                <span
                  className="previewBtn"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  Preview <IoEyeOutline />
                </span>
                <span>|</span>
                <span
                  className={
                    renderItem === "collectComp" ? "publishBtn" : "previewBtn"
                  }
                  onClick={() => {
                    changeComponent("collectComp");
                  }}
                >
                  Collect <FaLink />{" "}
                </span>
                <span>|</span>
                <a href={`/surveyPublish/${id}`} target="_blank">
                  <span className="publishBtn">
                    Publish <IoArrowUpCircleOutline />{" "}
                  </span>
                </a>
                <span>|</span>
                <Link to={`/skyanalyze/${id}`}>
                  {" "}
                  <span className="">
                    {" "}
                    <FaChartBar style={{ fontSize: "21px" }} />{" "}
                  </span>{" "}
                </Link>
              </div>
            ) : (
              <div></div>
            )}

            <div className="d-flex gap-2 pe-2 ">
              <span
                className={
                  renderItem === "quesComp" ? "previewBtn" : "publishBtn"
                }
                onClick={() => {
                  changeComponent("quesComp");
                }}
              >
                Question <IoEyeOutline />
              </span>
              <span>|</span>
              <span>
                <span
                  className={
                    renderItem === "quesComp" ? "publishBtn" : "previewBtn"
                  }
                  onClick={() => {
                    changeComponent("settings");
                  }}
                >
                  Settings <IoArrowUpCircleOutline />{" "}
                </span>
              </span>
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <span style={{ fontWeight: "600" }}>
              {surveyBasicDestails?.name}
            </span>

            <div style={{ width: "50px", borderRadius: "50%" }}>
              <img src={surveyBasicDestails?.image} alt="" className="w-100" />
            </div>
          </div>
        </div>
      </div>

      {renderItem === "quesComp" ? (
        <div className="d-flex mb-4 gap-4">
          <Container
            fluid
            className="App mainQuesConainer"
            onClick={() => removeBorder()}
          >
            <Row className="justify-content-center">
              <Col xs={12} className="p-0">
                <div
                  className="createForm border p-5 rounded rounded-3 w-100"
                  style={{
                    minHeight: "100%",
                    background: "rgb(250, 249, 251)",
                  }}
                >
                  {/* Preview button */}
                  <div
                    className="d-flex justify-content-end"
                    style={{ cursor: "pointer" }}
                  >
                    <IoEyeOutline />
                  </div>

                  {/* Render initial "Add Question" button */}
                  {renderAddQuestionButton(0)}

                  {/* Container for all questions */}
                  <div className="questions-container">
                    {console.log("QuestionComponent----" + questions)}
                    {questions.map((questionWrapper, index) => {
                      const question = questionWrapper.data.question;
                      const QuestionComponent =
                        questionComponents[question.quesType];

                      if (!QuestionComponent) {
                        console.error(
                          "Unknown question type:",
                          question.quesType
                        );
                        return null;
                      }

                      const isActive = activeQuestionId === question.uuid;

                      return (
                        <React.Fragment key={question.uuid}>
                          <div
                            id={`question-${question.uuid}`}
                            className={`optionWidth w-100 pe-5 mb-4 rounded p-3 position-relative ${
                              activeId === question.uuid ? "ShadowClass" : ""
                            }`}
                            onClick={(e) => {
                              handleQuestionClick(question.uuid);
                              addBorder(question.uuid, e); // Pass the div's ID to addBorder
                            }}
                            // onBlur={removeBorder} // Optional, to remove border when focus is lost
                            tabIndex="0" // Make the div focusable to trigger onBlur if needed
                          >
                            <QuestionComponent
                              question={question}
                              onUpdate={(uuid, field, value, questionType) =>
                                handleQuestionUpdate(
                                  question.uuid,
                                  field,
                                  value,
                                  questionType
                                )
                              }
                              onDelete={() =>
                                handleDeleteQuestion(question.uuid)
                              }
                              isActive={isActive}
                              setQuestions={setQuestions}
                              questions={questions}
                              handleQuestionUpdate={handleQuestionUpdate}
                              updateQuestions={updateQuestions}
                              activeQuestionId={activeQuestionId}
                              addBorder={addBorder}
                              showLogic={showLogic}
                              setShowLogic={setShowLogic}
                            />
                          </div>
                          {index === questions.length - 1
                            ? renderAddQuestionButton(index + 1, true)
                            : renderAddQuestionButton(index + 1)}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Question type selection panel */}
            <QuestionPanel
              showCanvas={showCanvas}
              handleCloseCanvas={handleCloseCanvas}
              handleQuestionTypeSelect={(type) =>
                handleQuestionTypeSelect(type, activeIndex)
              }
              questionCategories={questionCategories}
            />
          </Container>

          {!showLogic ? (
            <Row className="rightBar p-0">
              <Rightbar
                activeQuestionId={activeQuestionId}
                setQuestions={setQuestions}
                handleQuestionUpdate={handleQuestionUpdate}
                questions={questions}
              />
            </Row>
          ) : (
            <Row className=" p-0 rightBar">
              <RightbarLogic
                activeQuestionId={activeQuestionId}
                setQuestions={setQuestions}
                handleQuestionUpdate={handleQuestionUpdate}
                questions={questions}
                showLogic={showLogic}
                setShowLogic={setShowLogic}
              />
            </Row>
          )}
        </div>
      ) : null}

      {renderItem === "settings" && <Settingscomp />}

      {renderItem === "collectComp" && (
        <CollectComp surveyId={id} userFname={userFname} />
      )}

      <div className="previewCanvas p-1">
        <div
          class="offcanvas offcanvas-end"
          tabindex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div class="offcanvas-header">
            <p
              id="offcanvasRightLabel "
              style={{ fontSize: "22px", fontWeight: "700" }}
            >
              Survey Preview
            </p>
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body p-0">
            <Preview questions={questions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSurvey;
