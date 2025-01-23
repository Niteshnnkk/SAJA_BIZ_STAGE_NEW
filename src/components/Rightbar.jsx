import React, { useEffect, useState } from "react";

export default function Rightbar({
  activeQuestionId,
  handleQuestionUpdate,
  setQuestions,
  questions,
}) {
  const [currentActiveQuestion, setcurrentActiveQuestion] = useState("");
  const [isCheckedNA, setisCheckedNA] = useState(false);
  const [isCheckedSubtext, setisCheckedSubtext] = useState(false);

  useEffect(() => {
    setisCheckedNA(false);
    setisCheckedSubtext(false);
    getCurrentQuestion();
  }, [activeQuestionId]);
  console.log("currentActiveQuestion-----", currentActiveQuestion);
  function getCurrentQuestion() {
    console.log("this run");
    const caq = questions.filter(
      (item) => item?.data?.question?.uuid === activeQuestionId
    );

    console.log(caq);
    const hna = caq[0]?.data?.question.options.row.some(
      (item) => item.text === "NA"
    );
    const subtextna = caq[0]?.data?.question.description.enabled;
    console.log(hna);
    if (hna) {
      setisCheckedNA(true);
    }

    if (subtextna) {
      setisCheckedSubtext(true);
    }

    setcurrentActiveQuestion(caq[0]);
    // return caq[0]
  }
  const [selectedquestype, setselectedquestype] = useState("textbox");

  const queTy = {
    textbox: ["Single Textbox", "Multiple Textbox", "Text Area"],
    choice: [
      "Single Choice",
      "Multiple Choice",
      "Dropdown",
      "Multiselect Dropdown",
    ],
    nps: ["Single NPS", "Multi NPS", "NPS Pro"],
  };

  function handleChangeIsNA() {
    let c = currentActiveQuestion?.data?.question.options.row;
    console.log("hello");
    console.log(c);
    console.log(currentActiveQuestion);
    let newOption;
    const hasNA = c.some((item) => item.text === "NA");
    if (hasNA) {
      const indexOfNA = c.findIndex((item) => item.text === "NA");
      c.splice(indexOfNA, 1);
      handleQuestionUpdate(
        currentActiveQuestion?.data?.question?.uuid,
        "options",
        { ...currentActiveQuestion?.data?.question.options, row: c },
        c?.data?.question?.quesType
      );
    } else {
      newOption = {
        text: `NA`,
        rText: "",
        placeholder: "Enter a Placeholder",
        required: false,
        weight: 1,
        addText: false,
        hideOptsText: false,
        textVald: {
          enabled: false,
          type: "text",
          subType: "alphaText",
          min: null,
          max: null,
          errMsg: "",
          textLabel: "",
          defCountry: "IN",
        },
        addTextVald: {
          enabled: false,
          type: "text",
          subType: "alphaText",
          min: null,
          max: null,
          errMsg: "",
          textLabel: "",
          defCountry: null,
        },
        prePopulateAnswer: "",
        uuid: "",
        statement: false,
        na: false,
        exclusive: false,
        mutualExclusive: false,
        hidden: false,
      };
      const newOptions = [...c, newOption];
      handleQuestionUpdate(
        currentActiveQuestion?.data?.question?.uuid,
        "options",
        { ...currentActiveQuestion?.data?.question.options, row: newOptions },
        c?.data?.question?.quesType
      );
    }

    setisCheckedNA(!isCheckedNA);
  }

  function handleAddSubtext(e) {
    handleQuestionUpdate(
      currentActiveQuestion?.data?.question?.uuid,
      "description",
      {
        enabled: e.target.checked,
        text: "Please type your answer",
      },
      currentActiveQuestion?.data?.question?.quesType
    );
    setisCheckedSubtext(e.target.checked);
  }

  return (
    <div
      className="p-0 rightBarComponent"
      style={{ height: "100%", overflowY: "scroll", scrollbarWidth: "thin" }}
    >
      <div className="accordion w-100 p-0" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Questions
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show m-0"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-2 py-4">
              <div>
                <h6>Question type</h6>
                <select
                  name=""
                  id=""
                  className="form-control"
                  onChange={(e) => {
                    setselectedquestype(e.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Select
                  </option>
                  <option value="choice">Choice</option>
                  <option value="textbox">Textbox</option>
                  <option value="nps">NPS</option>
                </select>
              </div>

              <div className="mt-3">
                <h6>Sub Question type</h6>
                <select name="" id="" className="form-control">
                  <option value="">Select</option>
                  {queTy[selectedquestype]?.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>

              <hr className="mt-4" />

              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p>Add Subtext</p>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      onChange={handleAddSubtext}
                      checked={isCheckedSubtext}
                    />
                  </div>
                </div>

                <p style={{ fontSize: "14px" }} className="text-secondary">
                  By enabling this, you can add supportive text to the question.
                </p>
              </div>

              <hr className="mt-4" />

              {currentActiveQuestion?.data?.question.quesType !==
                "single-text" && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between">
                    <p>Is N/A</p>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        onChange={handleChangeIsNA}
                        checked={isCheckedNA}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: "14px" }} className="text-secondary">
                    This will allow respondent to select this option in case
                    given choices are not applicable to him
                  </p>

                  <hr className="mt-4" />
                </div>
              )}

              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p>Enable search</p>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>

                <p style={{ fontSize: "14px" }} className="text-secondary">
                  By enabling this, you can add a search bar for browsing the
                  choices.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Validation
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse m-0"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-2 py-4">
              <div className="d-flex justify-content-between">
                <p>Mark Required Question</p>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </div>

              <p style={{ fontSize: "14px" }} className="text-secondary">
                By enabling this, make the question compulsory to answer..
              </p>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Settings
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse m-0"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-2 py-4">
              <div className="d-flex justify-content-between">
                <p>Select Alignment</p>
              </div>

              <select name="" id="" className="form-control">
                <option value="">Select</option>
                <option value="">Horizontal</option>
                <option value="">Vertical</option>
                <option value="">Matrix</option>
              </select>

              <hr className="mt-4" />

              <div className="d-flex justify-content-between">
                <p>Piping only plain text</p>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Behaviour
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse m-0"
            aria-labelledby="headingFour"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-2 py-4">
              <div className="d-flex justify-content-between">
                <p>No random choices</p>
              </div>

              <select name="" id="" className="form-control">
                <option value="">Select</option>
                <option value="">No randomization</option>
                <option value="">Randomize all choices</option>
                <option value="">Specific number of choices</option>
                <option value="">Advnaced Randomization</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
