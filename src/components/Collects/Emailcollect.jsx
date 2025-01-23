import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import { FaRegBell, FaRegClock, FaRegThumbsUp } from "react-icons/fa";
import { PieChart } from "react-minimal-pie-chart";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { axiosWrapper } from "../../helpers/axiosWrapper";
import "./collect.css";

function Emailcolect({ collectId }) {
  console.log("collectId----->", collectId);
  const [show, setShow] = useState(false);
  const [subjectEdit, setSubjectEdit] = useState({
    isEditing: false,
    content: "We want your opinion",
  });
  const params = useParams();
  const id = params?.surveyid;

  const [surveyBasicDestails, setSurveyBasicDetails] = useState({
    name: "Survey Title",
    image: "",
  });

  const [emailCollectList, setEmailCollectList] = useState([]);
  const [sendEmailContent, setsendEmailContent] = useState({
    senderEmailIds: [""],
    emailCollectId: `${collectId}`,
    mailSubject: "We want your opinion",
    mailBody: "",
    deliveryStatus: "sent",
    sentCount: "0",
    deliveredCount: "0",
    domainType: "string",
    createdDate: "",
  });

  useEffect(() => {
    if (id) {
      getSurveyDetails(id);
    }
  }, [id]);

  useEffect(() => {
    setsendEmailContent((prev) => ({
      ...prev,
      mailBody: `
        <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
          <div style="background-color: #007bff; padding: 20px; border-radius: 5px;">
            <p style="font-size: 20px; color: white; margin: 0;">
              ${surveyBasicDestails?.name}
            </p>
          </div>
          <p style="margin-top: 20px; font-size: 14px;">
            We are conducting a survey and your input would be appreciated.
            Click the button below to start the survey. Thank you for your participation!
          </p>
          <div style="margin-top: 20px;">
            <a 
              href="${mySurveyLink(collectId)}" 
              style="
                display: inline-block; 
                padding: 10px 20px; 
                background-color: #007bff; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                font-size: 16px;"
            >
              Begin Survey
            </a>
          </div>
        </div>
      `,
    }));
  }, [surveyBasicDestails, collectId]);

  async function getSurveyDetails(id) {
    let response = await axiosWrapper.get(
      `sky/getAllOptionListBySurveyId?surveyId=${id}`
    );
    if (response === "something went wrong") {
      setSurveyBasicDetails({});
      return;
    } else {
      setSurveyBasicDetails({
        name: response[0]?.surveyName,
        image: response[0]?.surveyImagePath,
      });
      // setAllCollects(response);
    }
  }

  async function getemailCollects() {
    try {
      const data = await axiosWrapper.get(`sky/getCollectById/${collectId}`);
      setEmailCollectList(data);
    } catch (error) {
      console.error("Error fetching email collects:", error);
    }
  }

  // Survey Link Set in Email
  function mySurveyLink(value) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    return `${baseUrl}/surveyPublish/${id}?collectId=${value}`;
  }

  // Data for pie chart
  const pieData = [
    { title: "Successfull", value: 5, color: "#007bff" },
    { title: "Failed", value: 1, color: "#555" },
  ];

  // async function getemailCollects() {
  //   const data = await axiosWrapper.get(`sky/getCollectById/${collectId}`);
  //   console.log(data);
  //   setEmailCollectList(data);
  // }

  useEffect(() => {
    getemailCollects();
  }, [collectId]);

  function emailModalChangeHandler(e) {
    if (e.target.name == "senderEmailIds") {
      setsendEmailContent((prev) => {
        return { ...prev, [e.target.name]: [e.target.value] };
      });

      return;
    }
    setsendEmailContent((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  // async function submitHandler() {
  //   const d = await axiosWrapper.post(
  //     `sky/addEmailCollect/${collectId}`,
  //     sendEmailContent
  //   );
  //   getemailCollects();
  //   toast.success("Mail Sent Successfully!");
  //   handleClose();
  // }

  function getCurrentTimestamp() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
    const formattedDate = `${day}-${month}-${year}`;
    return `${formattedDate} ${formattedTime}`;
  }

  async function submitHandler() {
    try {
      // Generate the timestamp and update sendEmailContent
      const timestamp = getCurrentTimestamp();
      setsendEmailContent((prev) => ({
        ...prev,
        createdDate: timestamp,
      }));

      // Send the email with the updated content
      const d = await axiosWrapper.post(`sky/addEmailCollect/${collectId}`, {
        ...sendEmailContent,
        createdDate: timestamp,
      });

      toast.success("Mail Sent Successfully!");
      getemailCollects();
      handleClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  }

  console.log(sendEmailContent);

  function handleOpen(type) {
    setShow(true);
  }
  function handleClose() {
    setShow(false);
  }

  function subjectChangeHandler(e) {
    setSubjectEdit((prev) => {
      return { ...prev, content: e.target.value };
    });
  }
  const percent = 0.5; // Example value, adjust based on your logic

  return (
    <div className="dashboard">
      <ToastContainer />
      {/* Top Navigation Tabs */}
      <div className="tabs">
        <div className="tab active">Overview</div>
        <div className="tab">Recipients</div>
        <div className="tab">Options</div>
        <button
          className="create-button"
          onClick={() => {
            handleOpen();
          }}
        >
          {" "}
          + Create Email
        </button>
      </div>

      {/* Graph Section */}
      <div className="graphs">
        <div className="graph">
          <h4>Email Invitations</h4>
          <div className="chart">
            {/* [Pie Chart Placeholder] */}
            <PieChart
              className="pie-chart"
              data={pieData}
              lineWidth={40}
              radius={30}
              animate
              label={({ dataEntry }) => dataEntry.value}
              //   label={({ dataEntry }) => `${dataEntry.value}%`}
              labelStyle={{
                fontSize: "5px",
                fontFamily: "sans-serif",
                fill: "#fff",
              }}
              labelPosition={78}
            />
            <div className="pointer">
              <div className="successful-pointer">
                <div className="pointer-color"></div>
                <div className="pointer-text">Successful</div>
              </div>
              <div className="failed-pointer">
                <div className="pointer-color"></div>
                <div className="pointer-text">Failed</div>
              </div>
            </div>
          </div>
          <p>Total Invitations: </p>
        </div>
        <div className="graph">
          <h4>Email Responses</h4>
          <div className="chart">
            {/* [Gauge Chart Placeholder] */}
            <GaugeChart
              id="gauge-chart2"
              nrOfLevels={1}
              percent={0.86}
              width={200}
              height={200}
              textColor="black"
              hideText={true}
              colors={["#FF5F6D", "#FFC371"]}
            />
          </div>
          <p>Total Responses: </p>
        </div>
      </div>

      {/* Message History */}
      <div className="message-history">
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "15px" }}
        >
          <h4>Message History </h4>
          <button className="download-button">
            Download Collector Statistics
          </button>
        </div>

        <table
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Responses</th>
              <th>Sent Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emailCollectList[0]?.emailCollect?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.createdDate}</td>
                  <td>Invitation</td>
                  <td>{item.deliveryStatus}</td>
                  <td>
                    Sent: {item.sentCount}, Delivered: {item.deliveredCount}
                  </td>
                  <td>
                    <button className="action-button orange">
                      {" "}
                      <FaRegClock />{" "}
                    </button>
                    <button className="action-button blue">
                      {" "}
                      <FaRegBell />{" "}
                    </button>
                    <button className="action-button green">
                      {" "}
                      <FaRegThumbsUp />{" "}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* <tbody>
            {emailCollectList[0]?.emailCollect?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>28/12/24, 9:31 pm</td>
                  <td>Invitation</td>
                  <td>0</td>
                  <td>
                    Sent: {item.sentCount}, Delivered: {item.deliveredCount}
                  </td>
                  <td>
                    <button className="action-button orange">
                      {" "}
                      <FaRegClock />{" "}
                    </button>
                    <button className="action-button blue">
                      {" "}
                      <FaRegBell />{" "}
                    </button>
                    <button className="action-button green">
                      {" "}
                      <FaRegThumbsUp />{" "}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody> */}
        </table>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="custom-modal bulkedit my-modal"
      >
        <Modal.Header closeButton style={{ background: "#0054b9" }}>
          <Modal.Title style={{ color: "white" }}>Compose Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="w-100"
            style={{
              height: "500px",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <div className="d-flex gap-5 justify-content-around">
              <label htmlFor="">Send to:</label>

              <div className="w-75 d-flex gap-3 align-items-center">
                <input
                  type="text"
                  className="form-control"
                  name="senderEmailIds"
                  value={sendEmailContent?.senderEmailIds[0]}
                  onChange={emailModalChangeHandler}
                />
                <button
                  className="btn btn-primary"
                  style={{ width: "200px", fontSize: "14px" }}
                >
                  {" "}
                  + Add Recipients
                </button>
              </div>
            </div>

            <div className="d-flex gap-5 justify-content-around mt-3">
              <label htmlFor="">Subject :</label>

              <div className="w-75 d-flex gap-3 align-items-center">
                {subjectEdit?.isEditing ? (
                  <input
                    type="text"
                    name="mailSubject"
                    className="form-control"
                    value={sendEmailContent?.mailSubject}
                    onChange={emailModalChangeHandler}
                  />
                ) : (
                  <p className="w-100">{sendEmailContent?.mailSubject}</p>
                )}
                {!subjectEdit?.isEditing && (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100px", fontSize: "14px" }}
                    onClick={() => {
                      setSubjectEdit((prev) => {
                        return { ...prev, isEditing: true };
                      });
                    }}
                  >
                    {" "}
                    Edit
                  </button>
                )}
                {/* {subjectEdit?.isEditing && (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100px", fontSize: "14px" }}
                    onClick={() => {
                      // submitHandler()
                    }}
                  >
                    {" "}
                    Save
                  </button>
                )} */}
                {subjectEdit?.isEditing && (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100px", fontSize: "14px" }}
                    onClick={() => {
                      setSubjectEdit((prev) => {
                        return { ...prev, isEditing: false };
                      });
                    }}
                  >
                    {" "}
                    Save
                  </button>
                )}
              </div>
            </div>

            <div className=" mt-3">
              <label htmlFor="">Email Message</label>
            </div>

            <div className="d-flex gap-5 justify-content-around mt-3">
              <label htmlFor="">Edit Type :</label>

              <div className="w-75 d-flex gap-3 align-items-center">
                <select name="" id="" className="form-control">
                  <option value="">Edit Email Directly</option>
                  <option value="">Use Email Templates</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-between gap-5  mt-3">
              <label htmlFor="">Email</label>

              <div className=" d-flex gap-3 align-items-center">
                <select name="" id="" className="form-control">
                  <option value="">Edit</option>
                  <option value="">Use Email Templates</option>
                </select>
              </div>
            </div>

            <div className="d-flex  justify-content-center mt-3 p-3 bg-primary">
              <p className="fs-4 text-white text-center">
                {surveyBasicDestails?.name}
              </p>
            </div>

            <p className="text-center mt-3" style={{ fontSize: "14px" }}>
              We are conducting a survey and your input would be appreciated.
              Click the button below to start the survey. Thank you for your
              participation!
            </p>

            <div className="d-flex justify-content-center  mt-4">
              <button className="btn btn-primary" href={mySurveyLink(id)}>
                Begin Survey
              </button>
            </div>
            <div className="d-flex justify-content-center  mt-4">
              <p style={{ fontSize: "11px" }}>
                Please do not forward this email as its associated link is
                unique to you.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitHandler();
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Emailcolect;
