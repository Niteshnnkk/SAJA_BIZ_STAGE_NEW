import React, { useState } from 'react';
import { Form, Row, Col } from "react-bootstrap";
import { MultiSelect } from 'primereact/multiselect';
import "./Preview.css";

export default function Preview({ questions }) {
    const [currentPage, setCurrentPage] = useState(0);

    // Split questions based on separator (separation between pages)
    const pages = questions?.reduce((acc, item, index) => {
        if (item?.data?.separator) {
            // Start a new page after this item (separator).
            acc.push([item]);
        } else {
            // Add item to the current page
            acc[acc.length - 1].push(item);
        }
        return acc;
    }, [[]]); // Initializing with an empty first page

    // Get the questions for the current page
    const currentQuestions = pages[currentPage] || [];

    const renderNPS = (question) => {
        const ratings = Array.from({ length: 11 }, (_, i) => i);
        switch (question.quesType) {
            case "nps":
                return (
                    <Row className="mt-3 g-0 border border-1 rounded overflow-hidden text-center">
                        {ratings.map((rating) => (
                            <Col key={rating} className="p-0">
                                <Form.Check
                                    type="radio"
                                    id={`nps-${question.id}-${rating}`}
                                    name={`nps-${question.id}`}
                                    className="h-100 m-0 p-0"
                                >
                                    <Form.Check.Input type="radio" className="d-none" />
                                    <Form.Check.Label
                                        className={`d-flex justify-content-center align-items-center m-0 w-100 h-100 ${getBackgroundColor(rating)}`}
                                    >
                                        {rating}
                                    </Form.Check.Label>
                                </Form.Check>
                            </Col>
                        ))}
                    </Row>
                );
            default:
                return null;
        }
    };

    const getBackgroundColor = (rating) => {
        if (rating <= 6) return 'bg-danger bg-opacity-10';
        if (rating <= 8) return 'bg-warning bg-opacity-10';
        return 'bg-success bg-opacity-10';
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

    return (
        <div className="mainPreview">
            <div className="d-flex flex-column align-items-center gap-5 quesContainer">
                <p className="w-75 text-center d-none" style={{ fontSize: "24px", fontWeight: "600", borderBottom: "1px solid black" }}>
                    Technology
                </p>

                {/* Render current page's questions */}
                {currentQuestions?.map((item, index) => {
                    let { question } = item?.data;
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

                            <p className="questitle">
                                {question?.title} <label htmlFor="" className="text-danger">*</label>
                            </p>

                            {/* Render questions based on type */}
                            <div className="">
                                {
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
                                }

                                {
                                    question?.quesType === "multi-choice" && (
                                        <div className="d-flex flex-wrap gap-4 flex-column">
                                            {question?.options?.row?.filter((item) => !item?.hidden)?.map((item, index) => (
                                                <div className="form-check w-25" key={index}>
                                                    <input className="form-check-input" style={{ borderColor: 'black' }} type="checkbox" id={`flexCheckDefault-${index}`} />
                                                    <label className="form-check-label" htmlFor={`flexCheckDefault-${index}`}>
                                                        {item?.text}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }

                                {
                                    question?.quesType === "single-text" && (
                                        <div>
                                            <input type="text" placeholder="Enter your value" className="w-100 enterTextInput" />
                                        </div>
                                    )
                                }

                                {
                                    question?.quesType === "long-text" && (
                                        <div>
                                            <textarea rows={3} cols={3} placeholder="Enter your value" className="w-100 enterTextInput" />
                                        </div>
                                    )
                                }

                                {
                                    question?.quesType === "multi-select-dropdown" && (
                                        <div className="card flex justify-content-center">
                                            <MultiSelect
                                                options={question?.options?.row}
                                                optionLabel="text"
                                                placeholder="Select Options"
                                                maxSelectedLabels={3}
                                                className="w-full md:w-20rem"
                                            />
                                        </div>
                                    )
                                }

                                {
                                    question?.quesType === "multi-text" && (
                                        <div>
                                            <div>
                                                <label htmlFor="">Option 1</label>
                                                <input type="text" placeholder="Enter your value" className="w-100 enterTextInput" />
                                            </div>
                                            <div className="mt-3">
                                                <label htmlFor="">Option 2</label>
                                                <input type="text" placeholder="Enter your value" className="w-100 enterTextInput" />
                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    question?.quesType === "dropdown" && (
                                        <div>
                                            <select name="" id="" className="w-100 mt-3 selectContainer">
                                                <option value="">Select from dropdown</option>
                                                {question?.options?.row?.filter((item) => !item?.hidden)?.map((item, index) => (
                                                    <option value={item.text} key={index}>
                                                        {item.text}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )
                                }

                                {
                                    question?.quesType === "nps" && (
                                        <div>
                                            {renderNPS(question)}
                                            <div className="mt-2 text-muted small d-flex justify-content-between">
                                                <p>Least Likely</p>
                                                <p>Most Likely</p>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    );
                })}

                {/* Show the "Next" button only if there are more pages left */}

                <div className="d-flex justify-content-between mb-5 p-2 w-75">
                    {currentPage > 0 && (<button className="btn btn-secondary" onClick={goToPreviousPage}>
                        Previous
                    </button>)}
                    {currentPage < pages.length - 1 && (<button className="btn btn-primary" onClick={goToNextPage}>
                        Next
                    </button>)}

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
