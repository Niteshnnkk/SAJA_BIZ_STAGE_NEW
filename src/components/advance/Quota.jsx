import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FaPen, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { axiosWrapper } from "../../helpers/axiosWrapper";
import QuotaQuestionDetails from "./QuotaQuestionDetails";

import "react-datepicker/dist/react-datepicker.css";

const Quota = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [quotas, setQuotas] = useState([]);
  const [editingQuota, setEditingQuota] = useState(null);
  const params = useParams();
  const id = params?.surveyid;
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    quotaName: "",
    quotaType: "",
    duration: "",
    question: "",
  });
  const [isLive, setIsLive] = useState(false);

  const getAllQuotas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosWrapper.get(`sky/getAllQuota/${id}`);
      if (
        response === "something went wrong" ||
        !response ||
        !Array.isArray(response)
      ) {
        throw new Error("Failed to fetch quotas or invalid response");
      } else {
        setQuotas(response);
      }
    } catch (error) {
      console.error("Error fetching quotas:", error);
      setError(error.message);
      setQuotas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuota = async (quotaUuid) => {
    // Add confirmation step
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this quota?"
    );

    if (!isConfirmed) {
      return; // If not confirmed, exit the function
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosWrapper.deleteMethod(
        `sky/deleteQuotaById/${quotaUuid}`
      );
      if (response === "something went wrong") {
        throw new Error("Failed to delete quota");
      } else {
        getAllQuotas(); // Refresh the list after deletion
        toast.success("Quota deleted successfully!");
      }
    } catch (error) {
      toast.success("Failed to delete quota. Please try again.");
      console.error("Error deleting quota:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuotaById = async (quotaUuid) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosWrapper.get(
        `sky/getQuotaByQuotaId/${quotaUuid}`
      );
      if (response === "something went wrong" || !response) {
        throw new Error("Failed to fetch quota details or invalid response");
      } else {
        setEditingQuota(response);
        setFormData({
          quotaName: response.title || "",
          quotaType: response.type || "",
          duration: response.createdAt
            ? new Date(response.createdAt)
            : new Date(),
          question: response.questionId || "",
        });
        setOptions(
          Array.isArray(response.count)
            ? response.count.map((item) => ({
                id: item.optionId,
                text: item.optionText || "",
                quota: item.totalCount || "0",
              }))
            : []
        );
        setIsLive(response.status === "active");
        setShowForm(true);
      }
    } catch (error) {
      toast.success("Failed to fetch quota details. Please try again.");
      console.error("Error fetching quota details:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  async function getFormAllQuestions(id) {
    try {
      setIsLoading(true);
      setError(null);
      let response = await axiosWrapper.get(
        `sky/getAllOptionListBySurveyId?surveyId=${id}`
      );
      if (response === "something went wrong") {
        throw new Error("Failed to fetch questions");
      } else {
        const processedQuestions = response.surveyData.map((item) => ({
          id: item.data.question.uuid,
          title: item.data.question.title,
          rawTitle: item.data.question.rawTitle,
          description: item.data.question.description,
          helperText: item.data.question.helperText,
          quesType: item.data.question.quesType,
          quesFamily: item.data.question.quesFamily,
          options: item.data.question.options.row.map((opt) => ({
            id: opt.uuid,
            text: opt.text,
            rText: opt.rText,
            placeholder: opt.placeholder,
            required: opt.required,
            weight: opt.weight,
            addText: opt.addText,
            hideOptsText: opt.hideOptsText,
            quota: "",
          })),
          required: item.data.question.required,
          qCode: item.data.question.qCode,
          settings: item.data.question.settings,
        }));
        setQuestions(processedQuestions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.message);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getFormAllQuestions(id);
    }
    getAllQuotas();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "question") {
      const selectedQuestion = questions.find((q) => q.id === value);
      if (selectedQuestion && selectedQuestion.options) {
        const newOptions = selectedQuestion.options.map((opt) => ({
          id: opt.id || uuidv4(),
          text: opt.text,
          quota: "",
        }));
        setOptions(newOptions);
      } else {
        setOptions([]);
      }
    }
  };

  // const addRow = () => {
  //   const newId = uuidv4();
  //   setOptions((prevOptions) => [
  //     ...prevOptions,
  //     {
  //       id: newId,
  //       text: `Option ${prevOptions.length + 1}`,
  //       quota: "",
  //     },
  //   ]);
  // };

  const getTotal = () => {
    return options.reduce((sum, opt) => sum + (parseInt(opt.quota) || 0), 0);
  };

  const handleSave = async () => {
    try {
      const selectedQuestion = questions.find(
        (q) => q.id === formData.question
      );
      const apiPayload = {
        id: editingQuota ? editingQuota.id : "string",
        org: "Your Organization Name",
        version: editingQuota ? editingQuota.version + 1 : 0,
        quotaUuid: editingQuota ? editingQuota.quotaUuid : uuidv4(),
        surveyId: id,
        title: formData.quotaName,
        type: formData.quotaType,
        status: "active",
        questionId: selectedQuestion ? selectedQuestion.id : "",
        questionTitle: selectedQuestion ? selectedQuestion.title : "",
        createdBy: editingQuota ? editingQuota.createdBy : "User Name",
        updatedBy: "User Name",
        createdAt: editingQuota
          ? editingQuota.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        count: Array.isArray(options)
          ? options.map((option) => ({
              optionId: option.id,
              optionText: option.text,
              totalCount: option.quota || "0",
              currentCount:
                editingQuota && Array.isArray(editingQuota.count)
                  ? editingQuota.count.find((c) => c.optionId === option.id)
                      ?.currentCount || "0"
                  : "0",
            }))
          : [],
      };

      console.log("Payload:", apiPayload);

      let response;
      if (editingQuota) {
        response = await axiosWrapper.post("sky/updateQuota", apiPayload);
      } else {
        response = await axiosWrapper.post("sky/saveQuota", apiPayload);
      }

      if (response && response.quotaUuid) {
        toast.success("Quota saved successfully!");
        console.log("Quota saved successfully:", response);
        if (editingQuota) {
          // Update existing quota in the list
          setQuotas(
            quotas.map((q) =>
              q.quotaUuid === response.quotaUuid ? response : q
            )
          );
        } else {
          // Add new quota to the list
          setQuotas([...quotas, response]);
        }
        setShowForm(false);
        resetForm();
      } else {
        toast.success("Failed to save quota. Please try again.");
        console.error("Failed to save quota:", response);
        // setError("Failed to save quota. Please try again.");
      }
    } catch (error) {
      console.error("Error saving quota:", error);
      toast.success(
        "An error occurred while saving the quota. Please try again."
      );
      setError("An error occurred while saving the quota. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      quotaName: "",
      quotaType: "",
      duration: "",
      question: "",
    });
    setOptions([]);
    setIsLive(false);
    setEditingQuota(null);
    setStartDate(new Date());
  };

  const styles = {
    container: {
      backgroundColor: "#fff",
      minHeight: "100vh",
      padding: "20px",
    },
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
      padding: "8px 16px",
      backgroundColor: "#007bff",
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
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      textAlign: "left",
    },
    tableCell: {
      padding: "12px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
    },
    form: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "4px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    inputContainer: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    select: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    noData: {
      textAlign: "center",
      padding: "40px",
      color: "#666",
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

  return (
    <div style={styles.container}>
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          Error: {error}
        </div>
      )}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      )}
      {!showForm ? (
        <div style={styles.headerContent}>
          <h2 style={{ ...styles.title, fontSize: "18px" }}>Quota</h2>
          <div>
            <button
              style={styles.createButton}
              onClick={() => {
                setEditingQuota(null);
                resetForm();
                setShowForm(true);
              }}
            >
              Create New
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.headerContent}>
          <h2 style={{ ...styles.title, fontSize: "18px" }}>
            {editingQuota ? "Edit" : "Create New"} Quota
          </h2>
          <div>
            <button
              onClick={handleCancel}
              style={{
                ...styles.createButton,
                backgroundColor: "#6c757d",
                marginRight: "10px",
              }}
            >
              Cancel
            </button>
            <button onClick={handleSave} style={styles.createButton}>
              Save
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableCell}>S No</th>
                <th style={styles.tableCell}>Name</th>
                <th style={styles.tableCell}>Type</th>
                <th style={styles.tableCell}>Status</th>
                <th style={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(quotas) && quotas.length > 0 ? (
                quotas.map((quota, index) => (
                  <tr key={quota.quotaUuid || index}>
                    <td style={styles.tableCell}>{index + 1}</td>
                    <td style={styles.tableCell}>{quota.title || "N/A"}</td>
                    <td style={styles.tableCell}>{quota.type || "N/A"}</td>
                    <td style={styles.tableCell}>{quota.status || "N/A"}</td>
                    <td style={styles.tableCell}>
                      <button
                        style={styles.actionButton}
                        onClick={() => getQuotaById(quota.quotaUuid)}
                      >
                        <FaPen />
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        onClick={() => deleteQuota(quota.quotaUuid)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noData}>
                    No Quota created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div style={styles.form}>
          <hr style={styles.divider} />

          <h3
            style={{ ...styles.title, fontSize: "16px", marginBottom: "20px" }}
          >
            {editingQuota ? "Edit" : "Create New"} Quota
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Quota Name</label>
              <input
                type="text"
                name="quotaName"
                value={formData.quotaName}
                onChange={handleFormChange}
                placeholder="Enter Quota Name"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quota Type</label>
              <select
                name="quotaType"
                value={formData.quotaType}
                onChange={handleFormChange}
                style={styles.select}
              >
                <option value="">Select Quota Type</option>
                <option value="soft-quota">Soft Quota</option>
                <option value="hard-quota">Hard Quota</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duration Settings</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Add Question</label>
            <select
              name="question"
              value={formData.question}
              onChange={handleFormChange}
              style={styles.select}
              disabled={isLoading || questions.length === 0}
            >
              <option value="">
                {isLoading
                  ? "Loading questions..."
                  : questions.length === 0
                  ? "No questions available"
                  : "Select question"}
              </option>
              {questions.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.title}
                </option>
              ))}
            </select>
          </div>

          <hr style={styles.divider} />

          {formData.question && (
            <QuotaQuestionDetails
              question={questions.find((q) => q.id === formData.question)}
              options={options}
              setOptions={setOptions}
              // addRow={addRow}
              getTotal={getTotal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Quota;
