import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { axiosWrapper } from "../../helpers/axiosWrapper";

export default function CompletionRule() {
  const styles = {
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      margin: "0",
      fontSize: "24px",
      color: "#333",
    },
    createButton: {
      padding: "2px 10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    updateButton: {
      padding: "2px 10px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    resetButton: {
      padding: "2px 10px",
      backgroundColor: "#6c757d",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    divider: {
      marginBottom: "20px",
      border: "none",
      borderTop: "1px solid #eee",
    },
    actionButton: {
      padding: "4px 8px",
      marginRight: "4px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
    },
  };

  const [isVisible, setIsVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const params = useParams();
  const surveyId = params?.surveyid;

  // console.log("Survey ID:", surveyId);

  const initialFormData = {
    surveyCompletionUuid: "",
    surveyName: "",
    surveyId: surveyId,
    createdDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    createdBy: "",
    status: "",
    completionRule: {
      logicMeet: { type: "Message", value: "", eData: null },
      endPage: { type: "Embedded Data", value: "", eData: null },
      exitPage: { url: "", eData: null },
      quotaFull: { type: "URL", value: "", eData: null },
      quotaMeet: { type: "Message", value: "", eData: null },
      revisitingRespondent: { value: "" },
    },
  };

  console.log("Initial Form Data:", initialFormData);

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedData();
  }, [surveyId]);

  const fetchSavedData = async () => {
    try {
      setIsLoading(true);

      // Fetch data from API
      const response = await axiosWrapper.get(
        `sky/getCompletionRuleBySurveyId/${surveyId}`
      );

      console.log("Response from server Outside:", response);

      if (response && Array.isArray(response) && response.length > 0) {
        // Assuming you need the first object from the array
        const firstRecord = response[0];

        console.log("Response from server Inside:", firstRecord);

        // Map the first object to the form data
        const updatedFormData = {
          ...initialFormData, // Ensure default values are preserved
          ...firstRecord, // Merge response with initial form data
          completionRule: {
            ...initialFormData.completionRule, // Preserve default structure
            ...firstRecord.completionRule, // Overwrite with response completionRule
          },
        };

        // Update state with mapped data
        setFormData(updatedFormData);
        console.log("Fetched and updated form data:", updatedFormData);
        setIsModified(false);
      } else {
        toast.error("No completion rules found for the survey.");
        console.error("No valid data received from the server.");
        setError("No completion rules found for the survey.");
      }
    } catch (error) {
      toast.error("Failed to fetch saved data. Please try again.");
      console.error("Error fetching saved data:", error);
      setError("Failed to fetch saved data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      completionRule: {
        ...prevState.completionRule,
        [section]: {
          ...prevState.completionRule[section],
          [field]: value,
        },
      },
    }));
    setIsModified(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log("Sending data to server:", JSON.stringify(formData, null, 2));
      let response;
      if (formData.surveyCompletionUuid) {
        response = await axiosWrapper.putMethod(
          `sky/updateRules/${surveyId}`,
          formData
        );
      } else {
        formData.surveyCompletionUuid = "";
        response = await axiosWrapper.post("sky/addCompletionRule", formData);
      }

      console.log(
        "Received response from server:",
        JSON.stringify(response, null, 2)
      );

      if (
        response &&
        (response.surveyId || response === "Document updated successfully!")
      ) {
        console.log("Rule saved successfully:", response);
        if (response.surveyId) {
          setFormData(response);
        } else if (response.message === "Document updated successfully!") {
          // If it's an update, we don't get a new surveyId, so we keep the existing formData
          // but we should mark it as not modified
          setIsModified(false);
        }
        setSuccessMessage("Rule saved successfully!");
        toast.success("Rule saved successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error saving rule:", error);
      setError("Failed to save rule. Please try again.");
      toast.error("Failed to save rule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setIsModified(true);
  };

  const showData = () => {
    setIsVisible((prev) => !prev);
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="row">
          <div className="bg-white p-4 px-4">
            <div className="container mb-4 bg-white rounded rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4>Completion Rule</h4>
                {/* <p>Survey ID: {surveyId}</p> */}
                <div className="buttons d-flex gap-3">
                  <button style={styles.resetButton} onClick={handleReset}>
                    Reset
                  </button>
                  <button
                    style={
                      formData.surveyCompletionUuid
                        ? styles.updateButton
                        : styles.createButton
                    }
                    onClick={handleSave}
                    disabled={!isModified}
                  >
                    {formData.surveyCompletionUuid ? "Update" : "Save"}
                  </button>
                </div>
              </div>
              <hr className="p-0 m-0" />
            </div>
            <p>On Completion via Exit Button</p>
            <label>
              Take your respondents to your desired URL when they exit the
              survey by clicking on the exit button
            </label>
            <div className="form-group">
              <input
                type="text"
                name="exitPage"
                value={formData.completionRule.exitPage.url || ""}
                onChange={(e) => handleInputChange(e, "exitPage", "url")}
                placeholder="Enter URL"
                className="form-control"
              />
            </div>
            <div className="showField">
              <p
                className="mt-3 m-0"
                style={{ cursor: "pointer" }}
                onClick={showData}
              >
                Show More
              </p>
              {isVisible && (
                <div className="d-flex gap-3 align-items-center">
                  <div className="w-100">
                    <input
                      type="text"
                      name="logicMeetType"
                      value={formData.completionRule.logicMeet.value}
                      onChange={(e) =>
                        handleInputChange(e, "logicMeet", "value")
                      }
                      placeholder="Key"
                      className="form-control"
                    />
                  </div>
                  <div className="w-100">
                    <select
                      name="logicMeetValue"
                      value={formData.completionRule.logicMeet.type}
                      onChange={(e) =>
                        handleInputChange(e, "logicMeet", "type")
                      }
                      className="form-select"
                    >
                      <option value="Select Type">Select Type</option>
                      <option value="Embedded Data">Embedded Data</option>
                      <option value="Contact Data">Contact Data</option>
                    </select>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      name="logicMeetGeteData"
                      value={formData.completionRule.logicMeet.eData || ""}
                      onChange={(e) =>
                        handleInputChange(e, "logicMeet", "eData")
                      }
                      placeholder="Enter value"
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex gap-3">
                    <span>+</span>
                    <span>Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white mt-3 p-4 px-4">
            <p>On Completion via End Page</p>
            <label>
              Take your respondents to your desired page or URL post completion
              of a survey
            </label>
            <div className="d-flex gap-3 justify-content-between">
              <div className="w-25">
                <select
                  name="endPageType"
                  value={formData.completionRule.endPage.type}
                  onChange={(e) => handleInputChange(e, "endPage", "type")}
                  className="form-select"
                >
                  <option value="Embedded Data">Embedded Data</option>
                  <option value="Contact Data">Contact Data</option>
                </select>
              </div>
              <div className="form-group w-75">
                <input
                  type="text"
                  name="endPageValue"
                  value={formData.completionRule.endPage.value}
                  onChange={(e) => handleInputChange(e, "endPage", "value")}
                  className="form-control"
                  placeholder="https://sky.saja.biz/thankyou"
                />
              </div>
            </div>

            <div className="showField">
              <p
                className="mt-3"
                style={{ cursor: "pointer" }}
                onClick={showData}
              >
                Show More
              </p>
              {isVisible && (
                <div className="d-flex gap-3 align-items-center">
                  <div className="w-100">
                    <input
                      type="text"
                      name="endPageGeteData"
                      value={formData.completionRule.endPage.eData || ""}
                      onChange={(e) => handleInputChange(e, "endPage", "eData")}
                      placeholder="Key"
                      className="form-control"
                    />
                  </div>
                  <div className="w-100">
                    <select
                      name="endPageType"
                      value={formData.completionRule.endPage.type}
                      onChange={(e) => handleInputChange(e, "endPage", "type")}
                      className="form-select"
                    >
                      <option value="Select Type">Select Type</option>
                      <option value="Embedded Data">Embedded Data</option>
                      <option value="Contact Data">Contact Data</option>
                    </select>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      name="endPageValue"
                      value={formData.completionRule.endPage.value}
                      onChange={(e) => handleInputChange(e, "endPage", "value")}
                      placeholder="Enter value"
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex gap-3">
                    <span>+</span>
                    <span>Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 bg-white p-4">
            <h5 className="mb-3">On Custom Disqualification</h5>
            <p className="text-muted mb-4">
              Take your respondents to a desired URL or Show them a custom
              message when they are disqualified from the survey
            </p>
            <div className="mb-3">
              <label className="form-label">via Logic Meet</label>
              <div className="d-flex gap-3">
                <select
                  name="logicMeetType"
                  value={formData.completionRule.logicMeet.type}
                  onChange={(e) => handleInputChange(e, "logicMeet", "type")}
                  className="form-select w-25"
                >
                  <option value="Message">Message</option>
                  <option value="URL">URL</option>
                </select>
                <input
                  type="text"
                  name="logicMeetValue"
                  value={formData.completionRule.logicMeet.value}
                  onChange={(e) => handleInputChange(e, "logicMeet", "value")}
                  className="form-control"
                  placeholder="Your profile does not fit our criteria. Thank you for your time."
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">via Quota Meet</label>
              <div className="d-flex gap-3">
                <select
                  name="quotaMeetType"
                  value={formData.completionRule.quotaMeet.type}
                  onChange={(e) => handleInputChange(e, "quotaMeet", "type")}
                  className="form-select w-25"
                >
                  <option value="Message">Message</option>
                  <option value="URL">URL</option>
                </select>
                <input
                  type="text"
                  name="quotaMeetValue"
                  value={formData.completionRule.quotaMeet.value}
                  onChange={(e) => handleInputChange(e, "quotaMeet", "value")}
                  className="form-control"
                  placeholder="Thank you for your time but we have already received the required responses."
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">via Quota Full</label>
              <div className="d-flex gap-3">
                <select
                  name="quotaFullType"
                  value={formData.completionRule.quotaFull.type}
                  onChange={(e) => handleInputChange(e, "quotaFull", "type")}
                  className="form-select w-25"
                >
                  <option value="URL">URL</option>
                  <option value="Message">Message</option>
                </select>
                <input
                  type="text"
                  name="quotaFullValue"
                  value={formData.completionRule.quotaFull.value}
                  onChange={(e) => handleInputChange(e, "quotaFull", "value")}
                  className="form-control"
                  placeholder="https://sky.saja.biz/thankyou"
                />
              </div>
            </div>

            <p className="text-primary mt-3" style={{ cursor: "pointer" }}>
              Show More
            </p>
          </div>

          <div className="bg-white p-4 mt-3">
            <div>
              <p>Message For A Revisiting Respondent</p>
              <label>
                Add a message for respondents that select a personalized link to
                a survey they've already completed.
              </label>
              <div className="form-group">
                <input
                  type="text"
                  name="revisitingRespondent"
                  value={formData.completionRule.revisitingRespondent.value}
                  onChange={(e) =>
                    handleInputChange(e, "revisitingRespondent", "value")
                  }
                  className="form-control"
                  placeholder="The survey owner doesn't want respondents to answer the survey more than once. We've already got your response."
                />
              </div>
            </div>
          </div>
        </div>
        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </>
  );
}
