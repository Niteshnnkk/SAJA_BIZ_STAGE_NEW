import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/createSurveyModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosWrapper } from "../helpers/axiosWrapper";
import { getDecodedToken } from "../helpers/authFunctions";
import { toast, ToastContainer } from "react-toastify";
import Config from "../config/config";

const surveyCategories = [
  "Airline",
  "Automotive",
  "Banking",
  "Education",
  "Healthcare",
  "Retail",
  "Technology",
  "Other",
];

function CreateSurveyModal({ show, handleClose, handleCreateSurvey }) {
  const baseUrl = Config.baseUrl;
  const [surveyTitle, setSurveyTitle] = useState("");
  const [newFormData, setNewFormData] = useState({
    surveyTitle: '',
    surveyDesc: "",
    category: "",
    surveyLogo: ""
  });
  const [surveyCategory, setSurveyCategory] = useState("");
  const [titleError, setTitleError] = useState("");
  const [creatingForm, setCreatingForm] = useState(false);
  const navigate = useNavigate();

  const validateTitle = () => {
    if (!surveyTitle.trim()) {
      setTitleError("Survey title is required");
      return false;
    }
    setTitleError("");
    return true;
  };

 

  function getCurrentDateTimeISO() {
    const now = new Date();

    // Get the individual components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format to the desired string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  const handleFormSubmit = async (e) => {

    if (newFormData.surveyTitle === '' || newFormData.surveyDesc === "" || newFormData.category === "") {
      toast.error("Please fill all details")
      return;
    }
    setCreatingForm(true);
    try {
      const payload = {
        "surveyName": newFormData.surveyTitle,
        "surveyDescription": newFormData.surveyDesc,
        "surveyCategory": newFormData.category,
        "createdDate": getCurrentDateTimeISO(),
        "createdBy": getDecodedToken()?.email,
        "surveyImagePath": newFormData?.surveyLogo,
        "status": "Active"
      }

      try {
        const response = await axiosWrapper.post("sky/saveSurveyMaster", payload);
        console.log(response);

        navigate(`/new-survey/${response?.surveyId}?uuid=${response.uuid}`);
      } catch (err) {
        alert(JSON.stringify(err))
      }



      // if (template?.surveyId && template.uuid) {
      //   navigate(`/formbuilder/${template.surveyId}?uuid=${template.uuid}`);
      // }

    } catch (ex) {
      console.log(ex)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function ImageHandler(event) {
    const file = event.target.files[0];
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)
    try {
      const { data } = await axios({
        url: `${baseUrl}/api/files/upload`,
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log("data-------", data)
      setNewFormData((prev) => {
        return { ...prev, surveyLogo: data }
      })
      // setPreview(URL.createObjectURL(file));
      // toast.success("File uploaded successfully!");
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }


  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Start from scratch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="surveyTitle">
            <Form.Label>Survey Title</Form.Label>
            <Form.Control
              type="text"
              name="surveyTitle"
              placeholder="Enter survey title"
              value={newFormData?.surveyTitle}
              onChange={handleInputChange}
              isInvalid={!!titleError}
            />
            <Form.Control.Feedback type="invalid">
              {titleError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="surveyLogo">

            <label for="formFile" class="form-label">Survey Logo</label>
            {newFormData?.surveyLogo && <a  target="_blank"  href={newFormData.surveyLogo} style={{ fontSize: "13px",  color: "blue",marginLeft: "10px" }}>View Logo</a>}
            <input class="form-control" type="file" id="formFile" onChange={ImageHandler} />

          </Form.Group>



          <Form.Group className="mb-3" controlId="surveyTitle">
            <Form.Label>Survey Description</Form.Label>
            <Form.Control
              type="text"
              name="surveyDesc"
              placeholder="Enter survey title"
              value={newFormData?.surveyDesc}
              onChange={handleInputChange}
              isInvalid={!!titleError}
            />
            <Form.Control.Feedback type="invalid">
              {titleError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="surveyCategory">
            <Form.Label>Survey Category</Form.Label>
            <Form.Select
              name="category"
              value={newFormData?.surveyCategory}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              {surveyCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-sm btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-sm btn-primary" onClick={handleFormSubmit}>
          Start Creating
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateSurveyModal;
