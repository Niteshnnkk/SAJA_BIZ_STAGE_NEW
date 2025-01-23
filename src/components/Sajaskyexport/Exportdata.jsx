import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import Config from "../../config/config";
import { getDecodedToken } from "../../helpers/authFunctions";
import { axiosWrapper } from "../../helpers/axiosWrapper";
import "./exportdata.css";

export default function Exportdata({ id }) {
  const userId = getDecodedToken().userId;
  console.log(getDecodedToken());
  useEffect(() => {
    getData();
  }, []);
  const { baseUrl } = Config;
  const [exportFileType, setexportFileType] = useState("");
  const [renderComponent, setrenderComponent] = useState("ex_now");
  const [list, setlist] = useState({
    isLoading: "",
    data: [],
  });
  const labels = {
    width: "120px",
  };
  const selects = {
    border: "0.5px solid lightgrey",
    padding: "5px",
  };

  const tableStyle = {
    background: "#e9ecfc",
    color: "#555555",
  };

  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}-${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][date.getMonth()]
    }-${date.getFullYear()} ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;

  async function getExportData(type) {
    let response;
    try {
      if (type === "csv") {
        response = await axiosWrapper.post(`sky/saveExportData`, {
          userId: userId,
          documentType: type,
          surveyId: id,
          createdDate: formatDate(new Date()),
          downloadUrl: "",
          status: "Completed",
        });
      }
      if (type === "xls") {
        response = await axiosWrapper.post(`sky/saveExportData`, {
          userId: userId,
          documentType: type,
          surveyId: id,
          createdDate: formatDate(new Date()),
          downloadUrl: "",
          status: "Completed",
        });
      }
      if (type === "sav") {
        response = await axiosWrapper.post(`sky/saveExportData`, {
          userId: userId,
          documentType: type,
          surveyId: id,
          createdDate: formatDate(new Date()),
          downloadUrl: "",
          status: "Completed",
        });
      }

      // console.log("Response Download------>", response);

      if (response) {
        toast.success("Export has been initiated successfully!");
      }
      getData();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  }

  // async function fileTypeExportHandler(e) {
  //   try {
  //     const response = await axios.get(
  //       `http://13.201.250.38:8000/api/export-surveys/?surveyId=${id}`
  //     );

  //     const { data } = response;
  //     const fileResponse = await axios.get(data?.file_url, {
  //       responseType: "blob",
  //     });
  //     const fileBlob = fileResponse.data;
  //     const fileURL = window.URL.createObjectURL(fileBlob);
  //     const link = document.createElement("a");
  //     link.href = fileURL;
  //     link.download = "exported_file.sav";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     toast.success("File exported successfully!");
  //   } catch (err) {
  //     toast.error("Error in generating file!");
  //     console.log("Something went wrong!", err);
  //   }
  // }

  async function getData() {
    try {
      const response = await axiosWrapper.get(`sky/exportData/${id}`);
      console.log(response);
      let reversedResponse = response.reverse();
      setlist((prev) => {
        return { ...prev, data: [...reversedResponse] };
      });
    } catch (err) {
      toast.error("Error in loading list!");
    }
  }

  async function downloadHandler(fileurl, type) {
    let vvv;
    // fileurl = `https://saja.biz/exported-reports/survey_testSurveyId_20250111102528.xlsx`;
    window.location.href = fileurl;
    toast.success("File exported successfully!");
    // if (type === "sav") {
    //   const data = await axios.get(fileurl);
    //   console.log(data);
    //   vvv = data?.data?.file_url;
    //   const fileResponse = await axios.get(vvv, { responseType: "blob" });
    //   const fileBlob = fileResponse.data;
    //   const fileURL = window.URL.createObjectURL(fileBlob);
    //   const link = document.createElement("a");
    //   link.href = fileURL;
    //   link.download = "exported_file.sav";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   toast.success("File exported successfully!");
    // } else {
    //   vvv = fileurl;
    //   const fileResponse = await axios.get(vvv, { responseType: "blob" });
    //   const fileBlob = fileResponse.data;
    //   const fileURL = window.URL.createObjectURL(fileBlob);
    //   const link = document.createElement("a");
    //   link.href = fileURL;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   toast.success("File exported successfully!");
    // }
    // alert(vvv);
  }
  // Test function for fileTypeExportHandler
  // async function fileTypeExportHandler() {
  //   try {
  //     // Fetching the export file URL
  //     const response = await axios.get(
  //       `http://103.50.161.67:8000/api/export-surveys/?surveyId=${id}&format=`,
  //       {
  //         headers: {
  //           // Add necessary headers if required (e.g., Authorization)
  //           Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Replace with actual token if needed
  //         },
  //       }
  //     );

  //     const { data } = response;

  //     console.log("Response Download------>", data);

  //     if (!data?.file_url) {
  //       throw new Error("File URL is missing in the response!");
  //     }

  //     // Fetching the actual file
  //     const fileResponse = await axios.get(data.file_url, {
  //       responseType: "blob", // Ensures the response is treated as a file
  //     });

  //     // Creating a downloadable link for the file
  //     const fileBlob = fileResponse.data;
  //     const fileURL = window.URL.createObjectURL(fileBlob);
  //     const link = document.createElement("a");
  //     link.href = fileURL;
  //     link.download = "exported_file.sav"; // Set appropriate file name and extension
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     toast.success("File exported successfully!");
  //   } catch (err) {
  //     // Error handling
  //     toast.error("Error in generating file!");
  //     console.error("Something went wrong!", err);
  //   }
  // }

  return (
    <div>
      <ToastContainer />

      <div className="d-flex bg-white gap-2" style={{ minHeight: "65vh" }}>
        <div className="" style={{ width: "18%" }}>
          <div className="p-3">
            <h5 className="fs-4 text-bold ">Export Data</h5>
            <div>
              <div className="fs-6 text-bold leftBarlist w-100">
                <p
                  onClick={() => setrenderComponent("ex_now")}
                  className={renderComponent === "ex_now" ? "activeee" : ""}
                >
                  Export Now
                </p>
                <p
                  onClick={() => setrenderComponent("ex_list")}
                  className={renderComponent === "ex_list" ? "activeee" : ""}
                >
                  Export History
                </p>
                <p>Data Settings</p>
              </div>
            </div>
          </div>
        </div>

        {renderComponent === "ex_now" && (
          <div className="d-flex flex-column gap-4 mt-3 w-100">
            <h4 className="mb-0 mt-4">Export Now</h4>
            <div className="bg-white rounded p-2 ">
              <h6>Export Settings</h6>
              <div className="">
                <div className="d-flex gap-3 ">
                  <label htmlFor="" style={labels}>
                    Format
                  </label>
                  <select
                    name=""
                    id=""
                    style={selects}
                    onChange={(e) => {
                      setexportFileType(e.target.value);
                    }}
                  >
                    <option value="" selected disabled hidden>
                      Choose here
                    </option>
                    <option value="xls"> Microsoft excel (.xlsx)</option>
                    <option value="csv">
                      {" "}
                      CSV - Comma Separated Values (.csv)
                    </option>
                    <option value="sav">
                      {" "}
                      Statistical Package Export(sav)
                    </option>
                  </select>
                </div>
                <div>
                  <div className="d-flex gap-3 mt-3 ">
                    <label htmlFor="" style={labels}>
                      Dates
                    </label>
                    <div className="d-flex flex-column">
                      <select name="" id="" style={selects}>
                        <option value=""> Start Date</option>
                        <option value=""> End Date </option>
                        <option value=""> Submitted Date </option>
                      </select>

                      <div className="mt-3 d-flex gap-2 ">
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                          />
                        </div>{" "}
                        Notify when export is ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>

            <div className="bg-white rounded p-2">
              <h6>Optional Settings</h6>
              <div className="d-flex gap-2">
                Show Codes (Default Labels):{" "}
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
              </div>
              <div className="mt-3 d-flex gap-4">
                <span>
                  <input type="radio" /> <label htmlFor="">Saved Filter</label>{" "}
                </span>
                <span>
                  <input type="radio" /> <label htmlFor="">Custom</label>{" "}
                </span>
              </div>
              <div className="d-flex gap-3 mt-3">
                <label htmlFor="" style={labels}>
                  Collector
                </label>
                <select name="" id="" style={selects}>
                  <option value=""> Select Fields</option>
                  {/* <option value=""> CSV - Comma Separated Values (.csv)</option> */}
                </select>
              </div>
              <div className="d-flex gap-3 mt-3">
                <label htmlFor="" style={labels}>
                  Response Status
                </label>
                <select name="" id="" style={selects}>
                  <option value="">Select Fields</option>
                </select>
              </div>
            </div>
            <hr className="m-0" />
            <div className="mb-3 mt-0 d-flex gap-3">
              {exportFileType === "csv" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    getExportData("csv");
                  }}
                >
                  Export
                </button>
              )}

              {exportFileType === "sav" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    getExportData("sav");
                  }}
                >
                  Export
                </button>
              )}

              {exportFileType === "xls" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    getExportData("xls");
                  }}
                >
                  Export
                </button>
              )}
              <button className="btn btn-primary bg-white text-black">
                Reset
              </button>
            </div>
          </div>
        )}

        {renderComponent === "ex_list" && (
          <>
            <div className="d-flex flex-column gap-2 mt-3 w-100">
              <h4 className="mb-0 mt-4 px-2 d-flex justify-content-between">
                <span>Showing Exported Files</span>

                <span
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "150px",
                    color: "white",
                    background: "blue",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={getData}
                >
                  Refresh
                </span>
              </h4>
              <div className="bg-white rounded p-2 w-100 ">
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
                      <th style={tableStyle}>File Name </th>
                      <th style={tableStyle}>Created Date </th>
                      <th style={tableStyle}>Status </th>
                      <th style={tableStyle}>Exported By </th>
                      <th style={tableStyle}>Export Type</th>
                      <th style={tableStyle}>Actions </th>
                    </tr>
                  </thead>

                  <tbody>
                    {list.data?.map((item, i) => (
                      <tr
                        key={i}
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        <td>{item?.fileName}</td>
                        <td>{item?.fileName.split("_")[1]}</td>
                        <td>
                          <span
                            style={{
                              width: "200px",
                              color: "rgb(34, 129, 26)",
                              padding: "5px 10px",
                              borderRadius: "20px",
                              background: "rgb(228, 240, 231)",
                            }}
                          >
                            {item?.status}
                          </span>
                        </td>
                        <td>{item?.requestedBy}</td>
                        <td>{item?.documentType}</td>
                        <td>
                          <span
                            onClick={() => {
                              downloadHandler(
                                item?.downloadUrl,
                                item?.documentType
                              );
                            }}
                          >
                            Download <FaDownload />{" "}
                          </span>

                          <span className="ms-2">
                            Delete <IoTrashOutline />{" "}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
