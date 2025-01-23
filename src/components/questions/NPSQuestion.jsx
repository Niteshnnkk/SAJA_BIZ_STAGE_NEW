import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import EditableText from '../common/EditableText';
import "../../styles/ChoiceQuestion.css";
import "./questions.css"
import DropdownButton from "../DropdownButton";
import { IoChatboxEllipses, IoReturnDownBackOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
export function NPSQuestion({ question, onUpdate, setQuestions, questions, handleQuestionUpdate, updateQuestions }) {

  const [isClicked, setIsClicked] = useState(false);
  console.log("question---------->", question);

  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);

  const handleOptionChange = (i, field, value, uuid, index) => {
    console.log("uuid------>", uuid)
    let t = question?.settings?.configScale[index].qId[0]?.options?.row;

    const newOptions = [...question.options.row];
    t[i] = { ...t[i], [field]: value };
    console.log("t----------->", t)
    // return
    onUpdate(uuid, "options", { ...question?.settings?.configScale[index].qId[0]?.options, row: t }, question?.quesType);
  };

  const handleDeleteOption = (index) => {
    const newOptions = question.options.row.filter((_, i) => i !== index);
    onUpdate(question.uuid, "options", { ...question.options, row: newOptions }, question?.quesType);
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    line: {
      flexGrow: 1,
      borderTop: "1px solid lightgray",
      margin: "0 10px",
    },
    text: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
    },
  };

  const handleAddOption = () => {
    console.log(question);
    // return
    let c = question.options.row;
    const newOption = {
      "text": `Option ${parseInt(c.length) + 1}`,
      "rText": "",
      "placeholder": "Enter a Placeholder",
      "required": false,
      "weight": 1,
      "addText": false,
      "hideOptsText": false,
      "textVald": {
        "enabled": false,
        "type": "text",
        "subType": "alphaText",
        "min": null,
        "max": null,
        "errMsg": "",
        "textLabel": "",
        "defCountry": "IN"
      },
      "addTextVald": {
        "enabled": false,
        "type": "text",
        "subType": "alphaText",
        "min": null,
        "max": null,
        "errMsg": "",
        "textLabel": "",
        "defCountry": null
      },
      "prePopulateAnswer": "",
      "uuid": "",
      "statement": false,
      "na": false,
      "exclusive": false,
      "mutualExclusive": false,
      "hidden": false
    }
    const hasNA = c.some(item => item.text === "NA");
    let newOptions;
    if (hasNA) {
      newOptions = [...question.options.row];
      //  newOptions[newOptions.length-2] = newOption
      newOptions.splice(newOptions.length - 1, 0, newOption)
    } else {
      newOptions = [...question.options.row, newOption];
    }

    onUpdate(question.uuid, "options", { ...question.options, row: newOptions }, question?.quesType);
  };

  const renderNPS = () => {
    const ratings = Array.from({ length: 11 }, (_, i) => i);
    switch (question.quesType) {
      case "nps":
        return <Row className="mt-1 g-0  rounded overflow-hidden text-center npsRating">

          {ratings.map((rating, index) => (
            <Col key={rating} className="p-0">
              <Form.Check
                type="radio"
                id={`nps-${index}`}  // Unique ID for each radio button
                name={`nps-${question.id}`}  // Same name for all radio buttons in this question
                className="h-100 m-0 p-0"
              >
                <Form.Check.Input type="radio" className="d-none" />
                <Form.Check.Label
                  className={`p-2 border border-1 d-flex justify-content-center align-items-center m-0 w-100 h-100 ${getBackgroundColor(rating)}`}
                  htmlFor={`nps-${index}`}  // Correct binding with radio input's ID
                  style={{ background: `${getBackgroundColor(rating)}`, cursor: "pointer" }}
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

      case "multi-nps":
        return <>
          {question.options.row.map((option, index) => {
            return <>
              <input type="text" className="mt-3 multi_nps_row_input" value={option.text} onChange={(e) => handleOptionChange(index, "text", e.target.value)} />
              <Row className="mt-1 g-0  rounded overflow-hidden text-center npsRating">

                {ratings.map((rating, index) => (
                  <Col key={rating} className="p-0">
                    <Form.Check
                      type="radio"
                      id={`nps-${index}`}  // Unique ID for each radio button
                      name={`nps-${question.id}`}  // Same name for all radio buttons in this question
                      className="h-100 m-0 p-0"
                    >
                      <Form.Check.Input type="radio" className="d-none" />
                      <Form.Check.Label
                        className={`p-2 d-flex justify-content-center align-items-center m-0 w-100 h-100`}
                        htmlFor={`nps-${index}`}  // Correct binding with radio input's ID
                        style={{ background: `${getBackgroundColor(rating)}`, cursor: "pointer" }}
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
            </>
          })}

        </>
      case "pro-nps":
        return <>
          {question.options.row.map((option, index) => {
            return <>
              {/* <input type="text" className="mt-2 multi_nps_row_input" value={option.text} onChange={(e) => handleOptionChange(index, "text", e.target.value)} /> */}
              <Row className="mt-1 g-0  rounded overflow-hidden text-center npsRating">

                {ratings.map((rating, index) => (
                  <>   <Col key={rating} className="p-0">
                    <Form.Check
                      type="radio"
                      id={`nps-${index}`}  // Unique ID for each radio button
                      name={`nps-${question.id}`}  // Same name for all radio buttons in this question
                      className="h-100 m-0 p-0"
                    >
                      <Form.Check.Input type="radio" className="d-none" />
                      <Form.Check.Label
                        className={`p-2 d-flex justify-content-center align-items-center m-0 w-100 h-100}`}
                        htmlFor={`nps-${index}`}  // Correct binding with radio input's ID
                        style={{ background: `${getBackgroundColor(rating)}`, cursor: "pointer" }}
                      >
                        {rating}
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>

                  </>
                ))}

                <div className="mt-2 text-muted small d-flex justify-content-between">
                  <p>Least Likely</p>
                  <p>Most Likely</p>
                </div>
              </Row>

              <div className="mt-4">

                {
                  question?.settings?.configScale.map((option, index) => {

                    console.log("options------->", option)

                    return <>
                      <div style={styles.container}>
                        <div style={styles.line} />
                        <div style={styles.text}> For range {option?.scale?.min} to {option?.scale?.max}</div>
                        <div style={styles.line} />
                      </div>

                      <Form.Group className="mb-3 mt-4 px-0 topInput">
                        <Form.Control
                          type="text"
                          value={option?.qId[0].title}
                          onClick={addBorder}
                          // onBlur={removeBorder}
                          onChange={(e) => { handleProNPSQuestionTextChange(e, option?.qId[0].uuid) }}
                          className={isClicked ? 'borderClass' : ''}
                          placeholder="Enter question text"
                          style={{ fontSize: "22px" }}
                        />
                      </Form.Group>

                      <div className="mb-5">{
                        option?.qId[0]?.options?.row?.map((item, i) => {
                          let text = "option.text";
                          let url = "text?.split";  // Extracts everything after "https"
                          let mainURL = "";
                          return <>
                            <div
                              key={i}
                              className={`option-container `}
                              onMouseEnter={() => setHoveredOptionIndex(index)}
                              onMouseLeave={() => setHoveredOptionIndex(null)}
                            >
                              {option?.addText && <IoChatboxEllipses className="dropdown-button-container" />}

                              <div className="input_image_container">
                                <input
                                  type="text"
                                  // value={text?.split("https")[0]}
                                  value={item.text}
                                  onChange={(e) => handleOptionChange(i, "text", e.target.value, item?.uuid, index)}
                                  placeholder={`Option ${index + 1}`}
                                  readOnly={(item.hidden || item.text === "NA") ? true : false}
                                  className={item.hidden ? "readOnly form-control inputDecorator" : "form-control inputDecorator"}
                                // style={{ background: url ? `url(${mainURL}) no-repeat center center` : "", backgroundSize: url ? "400px" : "", height: url ? "200px" : "" }}

                                />
                                
                                {/* {url && <div style={{ width: "200px" }}>
                                  <img src={mainURL} className="w-100" />
                                </div>} */}

                              </div>



                              {/* {(hoveredOptionIndex === index && option.text !== "NA") && (
                        <div className="dropdown-button-container">
                          <DropdownButton onDelete={() => handleDeleteOption(index)} option={option} onOptionUpdate={(field, value) =>
                            handleOptionChange(index, field, value)
                          }
                          />
                        </div>
                      )} */}
                            </div>


                          </>
                        })
                      }

                        <button className="btn btn-secondary btn-sm addMore" onClick={handleAddOption} >
                          <FaPlus /> <span className="showAddMoreText m-0 p-0">Add More</span>
                        </button>
                      </div>

                    </>


                  })
                }
              </div >
            </>
          })
          }

        </>

    }

  };


  const getBackgroundColor = (rating) => {
    if (rating <= 6) return 'rgb(255, 204, 201)';
    if (rating <= 8) return 'rgb(255, 219, 148)';
    return 'rgb(153, 229, 197)';
  };

  const handleQuestionTextChange = (e) => {
    console.log(question)
    onUpdate(question.uuid, "title", e.target.value, "nps");
  };
  const handleProNPSQuestionTextChange = (e, queId) => {
    console.log(queId)
    // return
    onUpdate(queId, "title", e.target.value, "pro-nps");
  };

  const addBorder = () => {
    setIsClicked(true);
  };

  const removeBorder = () => {
    setIsClicked(false);
  };

  return (
    <div className="mt-3">
      <Form.Group className="mb-3 mt-4 px-0 topInput">
        <Form.Control
          type="text"
          value={question.title}
          onClick={addBorder}
          onBlur={removeBorder}
          onChange={handleQuestionTextChange}
          placeholder="Click to add question text"
          className={isClicked ? 'borderClass' : ''}
          style={{ fontSize: "22px" }}

        />
      </Form.Group>
      {/* DISPLAYIG THIS DIV IF DESCRIPTION IS ENABLED */}
      {question?.description?.enabled ? <div className="mb-2">
        <input type="text" placeholder="Please type your answer" className="subtext textBox " />
      </div> : null}
      {renderNPS()}

    </div>
  );
}
