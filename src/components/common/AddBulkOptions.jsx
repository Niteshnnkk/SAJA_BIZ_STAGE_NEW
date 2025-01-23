import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "./common.css"

function AddBulkOptions({ show, handleClose, handleCreateSurvey, question, setQuestions, questions, handleQuestionUpdate, updateQuestions }) {

    const [allOptionTexts, setAllOptionsTexts] = useState(getAllText());

    function getAllText() {
        return question.options.row.map(option => option.text).join("\n");
    }

    function onChangeHandler(e) {
        setAllOptionsTexts(e.target.value);
    }

    function OnAddBulkOptions() {
        console.log("allOptionTexts------", allOptionTexts)
        const updatedOptions = allOptionTexts.split("\n").map(text => ({
            text,
            getrText: "string",
            placeholder: "string",
            required: false,
            weight: 0,
            addText: false,
            hideOptsText: false,
            textVald: {
                enabled: false,
                type: "string",
                subType: "string",
                min: 0,
                max: 0,
                errMsg: "string",
                textLabel: "string",
                defCountry: "string"
            },
            addTextVald: {
                enabled: false,
                type: "string",
                subType: "string",
                min: 0,
                max: 0,
                errMsg: "string",
                textLabel: "string",
                defCountry: "string"
            },
            prePopulateAnswer: "string",
            uuid: "string",
            statement: false,
            na: false,
            exclusive: false,
            mutualExclusive: true,
            hidden: false
        }));
        console.log("updatedOptions------", updatedOptions)

        // Update the specific question by id
        const updatedQuestions = questions.map(item => {

            return {
                ...item,
                data: {
                    ...item.data,
                    question: {
                        ...item.data.question,
                        options: {
                            ...item.data.question.options,
                            row: updatedOptions
                        }
                    }
                }
            };
        }

        );

        setQuestions(updatedQuestions); // Ensure React recognizes a state update
        updateQuestions();
        handleClose()
    }

    return (
      
            <Modal show={show} onHide={handleClose} centered className="custom-modal bulkedit" >
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Answer Options - One per line</p>
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="10"
                        value={allOptionTexts}
                        onChange={onChangeHandler}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={OnAddBulkOptions}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

    );
}

export default AddBulkOptions;
