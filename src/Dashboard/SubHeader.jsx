import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CreateSurveyModal from "../components/CreateSurveyModal";
import "../styles/subHeader.css";
import { FaSearch } from "react-icons/fa";

export default function SubHeader({inputCHangeHandler}) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleCreateSurvey = (surveyData) => {
    handleClose();
  };

 

  return (
    <nav className="container w-100 mt-2 p-0">
      <ul className="w-60 d-flex flex-row justify-content-between align-items-center list-unstyled">
        <li className="nav-item">
          <p className="m-0" style={{ fontSize: "16px" }}> All Surveys</p>
        </li>
        <li className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center px-2" style={{ background: "rgb(247, 247, 249)" }}>
            <FaSearch />
            <input type="text" placeholder="Search" className="p-1 px-3 searchInput" onChange={inputCHangeHandler} />

          </div>

          <Button className="btn btn-sm btn-primary" onClick={handleShow}>
            Create Survey
          </Button>
        </li>
      </ul>

      <CreateSurveyModal
        show={showModal}
        handleClose={handleClose}
        handleCreateSurvey={handleCreateSurvey}
      />

    </nav>
  );
}
