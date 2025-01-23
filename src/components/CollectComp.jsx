import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { FaCopy, FaEdit, FaQrcode } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import QRCode from "react-qr-code";
import { toast, ToastContainer } from "react-toastify";
import Email from "../assets/Images/Collect/Email.PNG";
import Weblink from "../assets/Images/Collect/Weblink.PNG";
import { axiosWrapper } from "../helpers/axiosWrapper";
import Emailcollect from "./Collects/Emailcollect";
import "./rightbarlogic.css";

export default function CollectComp({ surveyId, userFname }) {
  useEffect(() => {
    getCollects();
    console.log(getFormattedDate());
  }, []);
  const [allCollects, setAllCollects] = useState([]);
  const [show, setShow] = useState(false);
  const [QRshow, setQRShow] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [modalFormData, setFormData] = useState({
    collectId: "",
    collectName: "",
    collectType: "",
    collectSurveyUrl: `/surveyPublish/${surveyId}`,
    surveyId: surveyId,
    totalResponses: "",
    createdDate: "",
    createdBy: userFname,
    modifiedDate: "",
    modifiedBy: userFname,
    status: "active",
  });

  const [screen, setScreen] = useState("defaultcollect");

  //   function myFunction(value) {
  //     const fullUrl = window.location.href;
  //     const url = new URL(fullUrl);
  //     const baseUrl = `${url.protocol}//${url.host}`;
  //     navigator.clipboard.writeText(`${baseUrl}${value}`);
  //     console.log(`${baseUrl}/${value}`);
  //     toast.success("Link copied");
  //     // alert("Copied the text: " + `${baseUrl}${value}`);
  //   }

  function myFunction(value) {
    try {
      // Get the base URL
      const fullUrl = window.location.href;
      const url = new URL(fullUrl);
      const baseUrl = `${url.protocol}//${url.host}`;

      // Construct the desired URL
      const fullLink = `${baseUrl}/surveyPublish/${allCollects[value].surveyId}?collectId=${allCollects[value].collectId}`;
      // Use the Clipboard API to copy the constructed URL
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(fullLink)
          .then(() => {
            console.log(fullLink);
            toast.success("Link copied successfully!");
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy link. Please try again.");
          });
      } else {
        // Fallback for browsers that don't support navigator.clipboard
        console.warn("Clipboard API not supported");
        alert(
          "Copy not supported in your browser. Here is the link: " + fullLink
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while copying the link.");
    }
  }

  function getFormattedDate() {
    return new Date().toISOString();
  }

  async function getCollects() {
    // const response = await axiosWrapper.get("sky/getAllCollectData");
    const response = await axiosWrapper.get(
      `sky/getCollectBySurveyId/${surveyId}`
    );
    console.log(response);
    setAllCollects(response);
  }

  async function deleteCollectHandler(id) {
    const response = await axiosWrapper.deleteMethod(`sky/deleteCollect/${id}`);
    getCollects();
  }
  const collectArray = [
    { imageSrc: Weblink, label: "Weblink" },
    { imageSrc: Email, label: "Email" },
    // { imageSrc: Manualentry, label: "Manual Entry" },
    // { imageSrc: SMS, label: "SMS" },
    // { imageSrc: Whatsapp, label: "Whatsapp" },
    // { imageSrc: Conversational, label: "Conversational" },
    // { imageSrc: API, label: "API" },
    // { imageSrc: Embeded, label: "Embeded" },
    // { imageSrc: Fieldforce, label: "Fieldforce" },
    // { imageSrc: Audience, label: "Audience" },
  ];

  const tableStyle = {
    background: "#e9ecfc",
    color: "#555555",
  };

  function handleClose() {
    setShow(false);
  }
  function handleQRClose() {
    setQRShow(false);
    setQrUrl("");
  }

  function handleOpen(type) {
    setShow(true);
    setFormData((prev) => {
      return { ...prev, collectType: type };
    });
  }

  function handleQROpen(value) {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Construct the desired URL
    const qrfullLink = `${baseUrl}/surveyPublish/${allCollects[value].surveyId}?collectId=${allCollects[value].collectId}`;
    setQrUrl(qrfullLink);
    setQRShow(true);
  }

  async function handleSubmit() {
    const response = await axiosWrapper.post("sky/addCollect", modalFormData);
    getCollects();
    handleClose();
  }

  function changeHandler(e) {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
        createdDate: getFormattedDate(),
        modifiedDate: getFormattedDate(),
      };
    });
  }
  const [collectId, setCollectId] = useState("");
  function changeScreen(type, id) {
    if (type === "Email") {
      setScreen("emailcollect");
      setCollectId(id);
    }
  }

  const iConStyle = {
    fontSize: "22px",
    marginLeft: "10px",
  };

  function formatTo12Hour(dateInput) {
    const date = new Date(dateInput);

    // Extract date components
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format the final string
    return `${month}/${day}/${year}, ${hours}:${minutes} ${amPm}`;
  }

  return (
    <>
      {screen === "defaultcollect" ? (
        <div className="mt-4">
          <div className=" d-flex gap-4 flex-wrap">
            {collectArray?.map((item, i) => {
              return (
                <img
                  className="collectIcon"
                  key={i}
                  src={item.imageSrc}
                  alt="Img"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleOpen(item.label);
                  }}
                />
              );
            })}
          </div>
          <ToastContainer />
          <p
            className="w-100 mt-5"
            style={{ border: "1px dotted lightgrey  " }}
          ></p>

          <div>
            <table
              className="table table-hover mb-4 bg-white"
              style={{ border: "1px solid #c1c1c1" }}
            >
              <thead className="thead-light">
                <tr
                  style={{
                    fontSize: "13px",
                    textAlign: "center",
                    color: "grey",
                  }}
                >
                  <th style={tableStyle}>Collect Name </th>
                  <th style={tableStyle}>Modified Date </th>
                  <th style={tableStyle}>Created Date </th>
                  <th style={tableStyle}> Type </th>
                  <th style={tableStyle}>Status </th>
                  <th style={tableStyle}>Survey Id </th>
                  <th style={tableStyle}>Collect id </th>
                  {/* <th style={tableStyle}>Created </th> */}

                  <th style={tableStyle}>Action </th>
                </tr>
              </thead>

              <tbody>
                {allCollects?.map((item, i) => {
                  return (
                    <>
                      <tr
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                        key={i}
                      >
                        <td
                          style={{ fontWeight: "700" }}
                          onClick={() =>
                            changeScreen(item?.collectType, item?.collectId)
                          }
                        >
                          {item?.collectName}
                        </td>
                        <td style={{ fontWeight: "700" }}>
                          {formatTo12Hour(item?.modifiedDate)}
                        </td>
                        <td style={{ fontWeight: "700" }}>
                          {formatTo12Hour(item?.createdDate)}
                        </td>
                        <td style={{ fontWeight: "700" }}>
                          {item?.collectType}
                        </td>
                        <td style={{ color: "green", fontWeight: "600" }}>
                          {item?.status}
                        </td>
                        <td> {item.surveyId}</td>
                        <td>{item.collectId}</td>
                        {/* <td>pointer</td> */}

                        <td>
                          <FaEdit style={iConStyle} />
                          <IoTrashOutline
                            style={iConStyle}
                            onClick={() => {
                              deleteCollectHandler(item.collectId);
                            }}
                          />
                          <FaCopy
                            style={iConStyle}
                            onClick={() => {
                              myFunction(i);
                            }}
                          />
                          <FaQrcode
                            style={iConStyle}
                            onClick={() => {
                              handleQROpen(i);
                            }}
                          />
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {screen === "emailcollect" ? (
        <div>
          <Emailcollect collectId={collectId} />
        </div>
      ) : null}

      <Modal show={show} onHide={handleClose} centered className="custom-modal">
        {/* <ToastContainer /> */}
        <Modal.Header closeButton>
          <Modal.Title>Create Collector</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "auto" }}>
          <Form>
            <Form.Group className="mb-3" controlId="surveyTitle">
              <Form.Label>Please Enter Collector Name:</Form.Label>
              <Form.Control
                type="text"
                name="collectName"
                onChange={changeHandler}
                // placeholder="Enter survey title"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-sm btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleSubmit}>
            OK
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={QRshow}
        onHide={handleQRClose}
        centered
        className="custom-modal"
      >
        {/* <ToastContainer /> */}
        <Modal.Header closeButton>
          <Modal.Title>Scan QR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="d-flex justify-content-center"
            style={{ height: "auto", margin: "0 auto", width: "100%" }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "50%", width: "100%" }}
              value={qrUrl}
              viewBox={`0 0 256 256`}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
