import React from "react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosWrapper } from "../../helpers/axiosWrapper";
import { toast, ToastContainer } from "react-toastify";
import "../Settingscomp.css"
 

const GeneralSettings = () => {

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


    const params = useParams();
    const surveyId = params?.surveyid;
    const [isModified, setIsModified] = useState(false);


    const initialFormData = {
        surveyId: surveyId,
        basicSetting: {
          buttons: {
            prev: { text: "", enabled: true },
            okay: { text: "Ok" },
            next: { text: "Next", enabled: true },
            submit: { text: "Submit" },
            exit: { text: "Exit", enabled: false },
            navigations: { enabled: true },
          },
          questions: {
            numbers: true,
            qSymbol: true,
            reqAstrick: true,
            codes: true,
          },
          googleAnalytics: { enabled: false },
          questionView: { type: "one", autoAdvance: true },
          showBlockTitle: false,
          trackLocation: false,
          audioRecording: false,
          preventIndexing: false,
          anonymiseResponses: false,
          exitLink: true,
          buttonLayout: "setting3",
        },
      };
    

 // Initialize state with the given initial data
 const [formData, setFormData] = useState(initialFormData);

 // Handle checkbox and text input changes
 const handleInputChange = (e, path) => {
   const { name, value, type, checked } = e.target;
   const updatedValue = type === "checkbox" ? checked : value;
 
   setFormData((prevData) => {
     const keys = path.split(".");
     let data = { ...prevData };

     // Deep update logic
     keys.reduce((acc, key, index) => {
       if (index === keys.length - 1) {
         acc[key] = updatedValue;
       } else {
         acc[key] = { ...acc[key] };
       }
       return acc[key];
     }, data);

     return data;
   });
 };
      console.log("Initial Form Data:", initialFormData);
    

      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
       const [isChecked, setIsChecked] = useState(true);


    useEffect(() => {
        fetchSavedData();
      }, [surveyId]);
    
 

      const fetchSavedData = async () => {
        try {
          setIsLoading(true);
    
          // Fetch data from API
          const response = await axiosWrapper.get(
            `sky/getBasicSettingBySurveyId/${surveyId}`
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
              
            };
           // debugger;
          //  alert("Check-"+response[0].basicSetting.questions.numbers);
           // setIsChecked(response[0].basicSetting.questions.numbers);
            // Update state with mapped data
            setFormData(updatedFormData);
            console.log("Fetched and updated form data:", updatedFormData);
            setIsModified(false);
          } else {
            console.error("No valid data received from the server.");
            setError("No completion rules found for the survey.");
          }
        } catch (error) {
          console.error("Error fetching saved data:", error);
          setError("Failed to fetch saved data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
 

      const handleSave = async () => { 
        console.log("Updated Form Data:", formData[0]);
        //setIsLoading(true);
        setError(null);
         
          console.log("Sending data to server:", JSON.stringify(formData, null, 2));
          let response = await axiosWrapper.putMethod(
              `sky/updateBasicSetting/${surveyId}`,
              formData
            );
          
          console.log(
            "Received response from server:",
            JSON.stringify(response, null, 2)
          );
          toast.success("Record saved succesfully")
           
      //  setIsLoading(false);

      };




      if (isLoading) {
        return <div>Loading...</div>;
      }
     ; 
 


    return (

        <>

<ToastContainer />
            <div className='d-flex flex-column gap-4'>
                <div className=' px-5 pt-4 pb-4 bg-white rounded rounded-3'>

                    <div className='mb-4 bg-white rounded rounded-3'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h4>General</h4>
                            {/* <button className='btn btn-secondary btn-sm' >Create New</button> */}
                            <div className="buttons d-flex gap-3">
                <button style={styles.resetButton}>
                  Reset
                </button>
                <button
                  style={
                    formData.surveyCompletionUuid
                      ? styles.updateButton
                      : styles.createButton
                  }
                  onClick={handleSave}
                  
                >
                  {formData.surveyCompletionUuid ? "Update" : "Save"}
                </button>
              </div>
                        </div>

                        <hr className='p-0 m-0' />
                    </div>
                    <div className="toggle-group">
                        <div className="form-check form-switch">
                        <input
                className="form-check-input"
                type="checkbox"
                id="questionNumber"
                checked={formData.basicSetting.questions.numbers}
                onChange={(e) => handleInputChange(e, "basicSetting.questions.numbers")}
              />
                            <label className="form-check-label" htmlFor="questionNumber">
                                Show Question Number
                            </label>
                        </div>
                        <div className="form-check form-switch">
                        <input
                className="form-check-input"
                type="checkbox"
                id="navigationButtons"
                checked={formData.basicSetting.buttons.navigations.enabled}
                onChange={(e) => handleInputChange(e, "basicSetting.buttons.navigations.enabled")}
              />
                            <label className="form-check-label" htmlFor="navigationButtons">
                                Show Navigation Buttons
                            </label>
                        </div>
                        <div className="form-check form-switch">
                        <input
                className="form-check-input"
                type="checkbox"
                id="exitLink"
                checked={formData.basicSetting.exitLink}
                onChange={(e) => handleInputChange(e, "basicSetting.exitLink")}
              />
                            <label className="form-check-label" htmlFor="exitLink">
                                Exit Link
                            </label>
                        </div>
                        <div className="form-check form-switch">
                        <input
                className="form-check-input"
                type="checkbox"
                id="requiredAsterisk"
                checked={formData.basicSetting.questions.reqAstrick}
                onChange={(e) => handleInputChange(e, "basicSetting.questions.reqAstrick")}
              />
                            <label className="form-check-label" htmlFor="requiredAsterisk">
                                (*) Required Asterisk
                            </label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="blockTitle" />
                            <label className="form-check-label" htmlFor="blockTitle">
                                Show Block Title
                            </label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="previousButton"
                              checked={formData.basicSetting.buttons.prev.enabled}
                              onChange={(e) => handleInputChange(e, "basicSetting.questions.prev.enabled") }/>
                            <label className="form-check-label" htmlFor="previousButton">
                                Previous button
                            </label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="nextButton" defaultChecked 
                            checked={formData.basicSetting.buttons.next.enabled}
                            onChange={(e) => handleInputChange(e, "basicSetting.questions.next.enabled") }/>
                            <label className="form-check-label" htmlFor="nextButton">
                                Next button
                            </label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="questionCode" />
                            <label className="form-check-label" htmlFor="questionCode">
                                Display Question Code
                            </label>
                        </div>
                    </div>
                </div>
                <div className="container px-4 pt-4 pb-4 rounded rounded-4 px-3 bg-white">



                <div className="form-group row mb-3">
                        <label className="col-sm-3 col-form-label">
                        Previous button
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="preButton"
                                placeholder="Previous"
                                defaultValue="Previous"
                                value={formData.basicSetting.buttons.prev.text}
                                onChange={(e) => handleInputChange(e, "basicSetting.buttons.prev.text")}
                            />
                        </div>
                    </div>


 
                    <div className="form-group row mb-3">
                        <label className="col-sm-3 col-form-label">
                            Next button
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="nextButton"
                                placeholder="Next"
                                defaultValue="Next"
                                value={formData.basicSetting.buttons.next.text}
                                onChange={(e) => handleInputChange(e, "basicSetting.buttons.next.text")}
                            />
                        </div>
                    </div>
                    <div className="form-group row mb-3">
                        <label htmlFor="submitButton" className="col-sm-3 col-form-label">
                            Submit button
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="submitButton"
                                placeholder="Submit"
                                defaultValue="Submit"
                                value={formData.basicSetting.buttons.submit.text}
                                onChange={(e) => handleInputChange(e, "basicSetting.buttons.submit.text")}
                            />
                        </div>
                    </div>




                    <div className="form-group row mb-3">
                        <label htmlFor="okButton" className="col-sm-3 col-form-label">
                            Exit button
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="okButton"
                                placeholder="Exit"
                                defaultValue="Exit"
                                value={formData.basicSetting.buttons.exit.text}
                                onChange={(e) => handleInputChange(e, "basicSetting.buttons.exit.text")}
                            />
                        </div>
                    </div>







                    
                    <div className="form-group row mb-3">
                        <label htmlFor="okButton" className="col-sm-3 col-form-label">
                            Ok button
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="okButton"
                                placeholder="Ok"
                                defaultValue="Ok"
                                value={formData.basicSetting.buttons.okay.text}
                                onChange={(e) => handleInputChange(e, "basicSetting.buttons.okay.text")}
                            />
                        </div>
                    </div>
                    <div className="form-group row mb-3">
                        <label htmlFor="browserTitle" className="col-sm-3 col-form-label">
                            Browser title
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="browserTitle"
                                placeholder="Browser title"
                                defaultValue="dfghjk"
                            />
                        </div>
                    </div>
                    <div className="form-group row mb-3">
                        <label htmlFor="interaction" className="col-sm-3 col-form-label">
                            Interaction
                        </label>
                        <div className="col-sm-9">
                            <select className="form-control" id="interaction">
                                <option value="One Question View">One Question View</option>
                                <option value="All Questions View">All Questions View</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default GeneralSettings;