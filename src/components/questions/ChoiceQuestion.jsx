import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import DropdownButton from "../DropdownButton";
import AddBulkOptions from "../common/AddBulkOptions";
import "../../styles/ChoiceQuestion.css";
import "./questions.css"
import { FaPlus } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaShareSquare } from "react-icons/fa";
import { Modal } from "react-bootstrap";

export function ChoiceQuestion({ question, onUpdate, isActive, setQuestions, questions, handleQuestionUpdate, updateQuestions, activeQuestionId }) {
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showPiping, setShowPiping] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [choosenOptionForPiping, setChoosenOptionForPiping] = useState({
    quesId: "",
    text: ""
  })
  //console.log("questions---->", questions)
  const [textBoxquesText, settextBoxquesText] = useState({
    quesText: question?.title
  })

  const pippingQuestionIndex = questions.findIndex(item => item.data.question.uuid === activeQuestionId);
  //console.log(pippingQuestionIndex)
  const pippingQuestionList = questions.slice(0, pippingQuestionIndex);
  //console.log(pippingQuestionList)


  const handleQuestionTextChange = (e) => {
    //console.log(question)
    onUpdate(question.uuid, "title", e.target.value, "single-choice");
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...question.options.row];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdate(question.uuid, "options", { ...question.options, row: newOptions }, question?.quesType);
  };

  const handleAddOption = () => {
    //console.log(question);
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

  const addBorder = () => {
    setIsClicked(true);
    setShowPiping(question.uuid);
  };

  const removeBorder = () => {
    setIsClicked(false);
  };

  const renderOptions = () => {
    return question.options.row.map((option, index) => {
      // //console.log("optiossssssssssss----------", option)
      let text = option.text;
      let url = text?.split("https")[1];  // Extracts everything after "https"
      let mainURL = "https" + url;

      return <div
        key={index}
        className={`option-container`}
        onMouseEnter={() => setHoveredOptionIndex(index)}
        onMouseLeave={() => setHoveredOptionIndex(null)}
      >
        {option?.addText && <IoChatboxEllipses className="dropdown-button-container" />}

        <div className="input_image_container">


          <input
            type="text"
            // value={text?.split("https")[0]}
            value={option.text}
            onChange={(e) => handleOptionChange(index, "text", e.target.value)}
            placeholder={`Option ${index + 1}`}
            readOnly={(option.hidden || option.text === "NA") ? true : false}
            className={option.hidden ? "readOnly form-control inputDecorator" : "form-control inputDecorator"}
          // style={{ background: url ? `url(${mainURL}) no-repeat center center` : "", backgroundSize: url ? "400px" : "", height: url ? "200px" : "" }}

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
    });
  };

  function pipeSaveQuestion() {
    let t = questions.filter(item => item.data.question.uuid === choosenOptionForPiping?.quesId);
    
    let text = `${question.title} {{p://${t[0]?.data?.question.title}}}`;
    //console.log(text)
    // return
    onUpdate(question.uuid, "title", text, "single-choice");

  }

  function changeHandlerOfPippingQues(e) {
    //console.log(e.target.value)
    setChoosenOptionForPiping({
      quesId: e.target.value,
      text: ""
    })
  }

  return (
    <div>
      <Form.Group className="mb-3 mt-4 px-0 topInput position-relative">
        {/* <span>*</span> */}
        <Form.Control
          type="text"
          value={question.title}
          onClick={addBorder}
          onBlur={removeBorder}
          onChange={handleQuestionTextChange}
          className={isClicked ? 'borderClass' : ''}
          placeholder="Enter question text"
          style={{ fontSize: "22px" }}
        />

        {showPiping === activeQuestionId && <div className="piping_main" >
          <span onClick={() => { setShow(true); }}>Piping</span>
          {/* <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">
            Launch demo modal
          </button> */}
          <FaShareSquare />

        </div>}

      </Form.Group>

      {/* DISPLAYIG THIS DIV IF DESCRIPTION IS ENABLED */}
      {question?.description?.enabled ? <div className="mb-2">
        <input type="text" placeholder="Please type your answer" className="subtext textBox " />
      </div> : null}

      {/* OPTIONS ARE REDENDERD FROM BELOW */}
      {renderOptions()}

      <div className="d-flex  justify-content-between align-items-center">

        <button className="btn btn-secondary btn-sm addMore" onClick={handleAddOption} >
          <FaPlus /> <span className="showAddMoreText m-0 p-0">Add More</span>
        </button>

        <span className="addoption" onClick={handleShow}>Add Bulk Options</span>
      </div>


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

      {/* <!-- Modal --> */}
      <Modal show={show} onHide={() => { setShow(false) }} centered className="custom-modal">
        {/* <ToastContainer /> */}
        <Modal.Header closeButton>
          <Modal.Title>Add Piping</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Select an option</p>
            <select name="" className="form-control" id="">
              <option value="">Question</option>
              <option value="">Contact</option>
            </select>
            <select name="" className="form-control mt-3" id="" onChange={changeHandlerOfPippingQues}>
              <option value="" selected disabled>Select a question</option>
              {
                pippingQuestionList.map((item, i) => {
                  return <option value={item?.data?.question?.uuid} key={i}>{item?.data?.question?.title}</option>
                })
              }
            </select>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-sm btn-primary" onClick={() => { setShow(false) }}>
            Cancel
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => { pipeSaveQuestion() }}>
            Save
          </button>

        </Modal.Footer>
      </Modal>
    </div>
  );
}
