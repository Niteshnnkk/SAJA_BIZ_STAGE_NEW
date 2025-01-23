import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import EditableText from '../common/EditableText';
import "./questions.css";
import "../../styles/ChoiceQuestion.css";
import { MultiSelect } from 'primereact/multiselect';
import AddBulkOptions from "../common/AddBulkOptions";
import { FaPlus } from "react-icons/fa6";
import DropdownButton from "../DropdownButton";
import "../../styles/ChoiceQuestion.css";
import { IoChatboxEllipses } from "react-icons/io5";



export function TextboxQuestion({ question, onUpdate, addBorder, isActive, setQuestions, questions, handleQuestionUpdate, updateQuestions, activeQuestionId }) {

  const [textBoxquesText, settextBoxquesText] = useState({
    quesText: question?.title
  })

  const [selectedCities, setSelectedCities] = useState(null);
  const [options, setOptions] = useState(question?.options?.row);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  console.log("textBoxquesText--------", textBoxquesText)
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
  const [isEditing, setIsEditing] = useState({
    questionID: "",
    isEditing: false
  })

  const handleOptionChange = (index, field, value) => {
    console.log("kkkkk", index, field, value);

    const newOptions = [...question.options.row];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdate(question.uuid, "options", { ...question.options, row: newOptions }, question?.quesType);
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


  const handleDeleteOption = (index) => {
    const newOptions = question.options.row.filter((_, i) => i !== index);
    onUpdate(question.uuid, "options", { ...question.options, row: newOptions }, question?.quesType);
  };


  const renderTextbox = () => {
    console.log(question)
    switch (question.quesType) {
      case "single-text":
        return <input type="text" placeholder="Enter your answer" className="mt-3 yourAns" onFocus={(e) => addBorder(question.uuid, e)} />;
      case "long-text":
        return <input type="text" placeholder="Enter your answer" className="mt-3 yourAns" onFocus={(e) => addBorder(question.uuid, e)} />;
      case "multi-text":
        return (
          <>
            <Form.Control type="text" placeholder="Answer 1" className="mb-2" />
            <Form.Control type="text" placeholder="Answer 2" className="mb-2" />
            <Form.Control type="text" placeholder="Answer 3" />
          </>
        );
      case "multi-text":
        return <Form.Control as="textarea" rows={3} placeholder="Enter your answer" />;


      case "multi-select-dropdown":
        return <div>
          {(isEditing.questionID === question?.uuid && isEditing.isEditing === true) ? <>

            {
              question?.options?.row?.map((option, index) => {
                let text = option.text;
                let url = text?.split("https")[1];  // Extracts everything after "https"
                let mainURL = "https" + url;

                return <div className={`option-container`} onMouseEnter={() => setHoveredOptionIndex(index)}
                  onMouseLeave={() => setHoveredOptionIndex(null)}>
                  {option?.addText && <IoChatboxEllipses className="dropdown-button-container" />}

                  <div className="input_image_container">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                      // placeholder={`Option ${index + 1}`}
                      readOnly={(option.hidden || option.text === "NA") ? true : false}
                      className={option.hidden ? "readOnly mt-2 form-control inputDecorator" : "mt-2 form-control inputDecorator"}
                    />

                    {url && <div style={{ width: "200px" }}>
                      <img src={mainURL} className="w-100" />
                    </div>}
                  </div>

                  {(hoveredOptionIndex === index && option.text !== "NA") && (
                    <div className="dropdown-button-container">
                      <DropdownButton onDelete={() => handleDeleteOption(index)} option={option} onOptionUpdate={(field, value) =>
                        handleOptionChange(index, field, value)
                      }
                      />
                    </div>
                  )}
                </div>
              })
            }

          </> :

            <div className="card flex justify-content-center">
              <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={options} optionLabel="text"
                placeholder="Select Cities" maxSelectedLabels={3} className="w-full md:w-20rem" />
            </div>}

          <div className="d-flex justify-content-between align-items-center mt-2">

            <div>
              {isEditing?.isEditing && <>    <button className="btn btn-secondary mb-2 btn-sm addMore"
                onClick={handleAddOption}
              >
                <FaPlus /> <span className="showAddMoreText m-0 p-0">Add More</span>
              </button> </>}

              <button className="btn btn-sm btn-secondary " onClick={() => {
                setIsEditing((prev) => {
                  return {
                    ...prev, isEditing: !prev.isEditing, questionID: question?.uuid
                  }
                })
              }}>
                {isEditing?.isEditing ? "Done Editing" : "Edit Options"}

              </button >
            </div>


            <span className="addoption"
              onClick={handleShow}
            >Add Bulk Options</span>

          </div>
        </div>;



      case "dropdown":
        return <>
          {(isEditing.questionID === question?.uuid && isEditing.isEditing === true) ? <>
            {
              question?.options?.row?.map((option, index) => {
                let text = option.text;
                let url = text?.split("https")[1];  // Extracts everything after "https"
                let mainURL = "https" + url;
                return <div className={`option-container`} onMouseEnter={() => setHoveredOptionIndex(index)}
                  onMouseLeave={() => setHoveredOptionIndex(null)}>

                  <div className="input_image_container">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                      // placeholder={`Option ${index + 1}`}
                      readOnly={(option.hidden || option.text === "NA") ? true : false}
                      className={option.hidden ? "readOnly mt-2 form-control inputDecorator" : "mt-2 form-control inputDecorator"}
                    />

                    {url && <div style={{ width: "200px" }}>
                      <img src={mainURL} className="w-100" />
                    </div>}

                  </div>



                  {(hoveredOptionIndex === index && option.text !== "NA") && (
                    <div className="dropdown-button-container">
                      <DropdownButton onDelete={() => handleDeleteOption(index)} option={option} onOptionUpdate={(field, value) =>
                        handleOptionChange(index, field, value)
                      }
                      />
                    </div>
                  )}
                </div>
              })
            }
          </> : <>
            <select name="" id="" className="w-100 mt-3 selectContainer">
              <option value="">Select from dropdown</option>

              {
                question?.options?.row?.map(item => {
                  return <>
                    <option value={item.text}>{item.text}</option>
                  </>
                })
              } </select>
          </>}

          <div className="d-flex justify-content-between align-items-center mt-2">

            <div>
              {isEditing?.isEditing && <>    <button className="btn btn-secondary mb-2 btn-sm addMore"
                onClick={handleAddOption}
              >
                <FaPlus /> <span className="showAddMoreText m-0 p-0">Add More</span>
              </button> </>}

              <button className="btn btn-sm btn-secondary " onClick={() => {
                setIsEditing((prev) => {
                  return {
                    ...prev, isEditing: !prev.isEditing, questionID: question?.uuid
                  }
                })
              }}>
                {isEditing?.isEditing ? "Done Editing" : "Edit Options"}

              </button >


            </div>

            <span className="addoption"
              onClick={handleShow}
            >Add Bulk Options</span>

          </div>

        </>
      default:
        return null;
    }
  };

  return (
    <div className="mt-2">
      <input className=" textBox  "
        value={textBoxquesText.quesText}
        text={question.questionText}
        onChange={(e) => settextBoxquesText((prev) => { return { ...prev, quesText: e.target.value } })}
        onBlur={() => { onUpdate(question.id, "questionText", textBoxquesText.quesText, question?.quesType) }}
        placeholder="Click to add question text"


      />

      {/* DISPLAYIG THIS DIV IF DESCRIPTION IS ENABLED */}
      {question?.description?.enabled ? <div className="mb-2">
        <input type="text" placeholder="Please type your answer" className="subtext textBox " />
      </div> : null}
      {renderTextbox()}





      <AddBulkOptions
        questions={questions}
        setQuestions={setQuestions}
        show={showModal}
        handleClose={handleClose}
        question={question}
        handleQuestionUpdate={handleQuestionUpdate}
        updateQuestions={updateQuestions}
      // handleCreateSurvey={handleCreateSurvey}
      />
    </div>
  );
}
