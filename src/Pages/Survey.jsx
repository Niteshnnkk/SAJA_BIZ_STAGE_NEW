import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaPen, FaSort, FaTelegramPlane } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import SubHeader from "../Dashboard/SubHeader";
import { getDecodedToken } from "../helpers/authFunctions";
import { axiosWrapper } from "../helpers/axiosWrapper";
import "../styles/survey.css";

const Survey = () => {
  const userEmail = getDecodedToken().email;
  const navigate = useNavigate();
  const [templates, setallTemplates] = useState([]);
  const [templatesfs, setallTemplatesfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [SurveyState, setSurveyState] = useState({
    isDeleting: false,
    deletingid: "",
    isLoadingList: null
  })
  const [searchedText, setSearchedText] = useState("")

  useEffect(() => {
    getAllSurvey();
  }, [])

  async function getAllSurvey() {
    setSurveyState((prev) => {
      return { ...prev, isLoadingList: true }
    })
    let data = await axiosWrapper.get(`sky/findByCreatedBy?createdBy=${userEmail}`);
    console.log("data------->", data)
    if(data ==="something went wrong"){
      setSurveyState((prev) => {
        return { ...prev, isLoadingList: false }
      })
      return
    }
    setallTemplates(data)
    setallTemplatesfs(data);
    setSurveyState((prev) => {
      return { ...prev, isLoadingList: false }
    })

  }

  function inputCHangeHandler(e) {
    if (e.target.value === "") {
      getAllSurvey()
    } else {
      let z = templatesfs.filter(item => item.surveyName.toLowerCase().trim().includes(e.target.value));
      setallTemplates(z)

    }
  }

  function stateUpdater(key, value) {
    setSurveyState(prev => {
      return { ...prev, [key]: value }
    })

  }

  function getSurveyForm(surveyId, uuid, e) {

    if (e.target.className === "btn btn-sm btn-danger") {
      stateUpdater("deletingid", surveyId)
      return
    }
    navigate(`/new-survey/${surveyId}?uui=${uuid}`)
  }

  async function deleteHAndler() {
    if (SurveyState.deletingid === "") {
      toast.error("Survey ID not present!")
    }
    const deleteResponse = await axiosWrapper.putMethod(`sky/removeSurveyById/${SurveyState?.deletingid}`, "")
    console.log(deleteResponse);
    if (deleteResponse === "Survey deleted successfully") {
      toast.success("Survey Deleted!");
      getAllSurvey()
    } else {
      toast.error("Error in deleting, please try later");
    }
    handleClose();
    stateUpdater("deletingid", "")
  }

  const tableStyle = {
    background: "#e9ecfc", color: "#555555"
  }
  const sortStyle = {
    fontSize: "10px", cursor: "pointer"
  }

  function sortHandler(sortType) {
    let allData = [...templates];

    if (sortType === "alpha") {
      allData.sort(function (a, b) {
        if (a.surveyName < b.surveyName) {
          return -1;
        }
        if (a.surveyName > b.surveyName) {
          return 1;
        }
        return 0;
      });

    }

    setallTemplates(allData)

  }

  return (
    <>
      <ToastContainer />
      <SubHeader inputCHangeHandler={inputCHangeHandler} />

      <>

        <div className="mt-2">

          {(SurveyState?.isLoadingList) ? <Loader /> : <table className="table table-hover mb-4 bg-white" style={{ border: '1px solid #c1c1c1' }}>
            <thead className="thead-light"  >
              <tr style={{ fontSize: "13px", textAlign: "center", color: "grey" }}>
                <th style={tableStyle}>Survey Name  <FaSort style={sortStyle} onClick={() => { sortHandler("alpha") }} /> </th>
                <th style={tableStyle}>Status  <FaSort style={sortStyle} /></th>
                <th style={tableStyle}>Responses  <FaSort style={sortStyle} /></th>
                <th style={tableStyle}>Owner  </th>
                <th style={tableStyle}>Created <FaSort style={sortStyle} /></th>
                <th style={tableStyle}>Action  </th>
              </tr>
            </thead>

            <tbody >

              {templates?.map((template) => (

                <tr onClick={(e) => getSurveyForm(template?.surveyId, template?.uuid, e)} key={template?.surveyId} style={{ cursor: "pointer", fontSize: "13px", textAlign: "center" }}>
                  <td style={{ fontWeight: "700" }}>{template?.surveyName}</td>
                  <td style={{ color: "green", fontWeight: "600" }}>{template?.status}</td>
                  <td >2</td>
                  <td>{template?.createdBy}</td>
                  <td>{moment(template?.createdDate).format('L')}</td>

                  <td className="d-flex gap-2 justify-content-center gap-3">
                    {/* import { FaPen } from "react-icons/fa";
                    import { FaRegCircle } from "react-icons/fa";
                    import { FaTelegramPlane } from "react-icons/fa"; */}
                    <span className="d-flex align-items-center gap-1">
                      <FaPen />  Edit
                    </span>
                    {/* <span className="d-flex align-items-center gap-1">
                      <FaRegCircle /> Collect
                    </span> */}
                    <span className="d-flex align-items-center gap-1" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/skyanalyze/${template?.surveyId}`)

                    }}>
                      <FaTelegramPlane /> Analyze
                    </span>

                    <IoTrashOutline className="deleteIcon" style={{ color: "red", cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        stateUpdater("deletingid", template?.surveyId);
                        handleShow();
                      }}
                    />
                  </td>

                </tr>
              ))}

            </tbody>


          </table>}


          <Modal show={showModal} onHide={handleClose} centered className="custom-modal">
            {/* <ToastContainer /> */}
            <Modal.Header closeButton>
              <Modal.Title>Delete Survey</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure?</p>

            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-sm btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => { deleteHAndler() }}>
                Delete
              </button>
            </Modal.Footer>
          </Modal>

        </div>
      </>
    </>
  );
};
export default Survey;
