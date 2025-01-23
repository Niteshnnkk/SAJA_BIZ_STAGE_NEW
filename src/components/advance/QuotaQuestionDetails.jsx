import React from "react";

const QuotaQuestionDetails = ({
  question,
  options,
  setOptions,
  // addRow,
  getTotal,
}) => {
  const handleQuotaChange = (id, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((opt) => (opt.id === id ? { ...opt, quota: value } : opt))
    );
  };

  const styles = {
    container: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "4px",
      marginTop: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    questionText: {
      fontSize: "16px",
      color: "#666",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    row: {
      borderBottom: "1px solid #eee",
    },
    cell: {
      padding: "12px 8px",
      textAlign: "left",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
    },
    totalRow: {
      backgroundColor: "#f9f9f9",
      fontWeight: "bold",
    },
    actions: {
      marginTop: "20px",
      display: "flex",
      gap: "10px",
    },
    addButton: {
      padding: "8px 16px",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      cursor: "pointer",
      color: "#666",
    },
  };

  if (!Array.isArray(options)) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.questionText}>
          Selected Question: <b>{question ? question.title : "Question"}</b>
        </h3>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.row}>
              <th style={styles.cell}>
                {question ? question.title : "Question"}
              </th>
              <th style={styles.cell}>Type Quota Count</th>
              {/* <th>Option ID</th> */}
            </tr>
          </thead>
          <tbody>
            {options.map((option) => (
              <tr key={option.id} style={styles.row}>
                <td style={styles.cell}>{option.text}</td>
                <td style={styles.cell}>
                  <input
                    type="number"
                    value={option.quota || ""}
                    onChange={(e) =>
                      handleQuotaChange(option.id, e.target.value)
                    }
                    placeholder="Type Quota Count"
                    style={styles.input}
                    min="0"
                  />
                </td>
                {/* <td>{option.id}</td> */}
              </tr>
            ))}
            <tr style={{ ...styles.row, ...styles.totalRow }}>
              <td style={styles.cell}>Total</td>
              <td style={styles.cell}>{getTotal()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div style={styles.actions}>
        <button onClick={addRow} style={styles.addButton}>
          + Add Row
        </button>
      </div> */}
    </div>
  );
};

export default QuotaQuestionDetails;
