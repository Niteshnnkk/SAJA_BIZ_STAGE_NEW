import axios from "axios";
import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineChevronRight } from "react-icons/md";
import { toast } from "react-toastify";
import Config from "../config/config";
import CreateSmileSurvey from "./CreateSmileSurvey";
import LaunchSurvey from "./LauncheSurvey";

const AddNewAttribute = ({ changePageHandler, payload, selectedSector, selectedLanguages, surveyData, selectedCityId, businessNames, businessSlogans, allCity, selectPrimaryLangId, englishLanguage, allState, getAllSurveyById, setCustomcheck, customcheck, customCheckbox, setCustomchecks, customchecks, customCheckboxs, restaurantCheckBox, setrestaurantCheck, restaurantCheck }) => {
  const selectedCity = allCity?.find(city => city.cityId === selectedCityId);
  const baseUrl = Config.baseUrl;
  const {
    attributes, setAttributes,
    attrData, setAttrData,
    showbackPage, setShowBackPage,
    showLaunchSurvey, setLaunchSurvey,
    selectedAttributes, setSelectedAttributes,
    data, setData,
    defaultAttr, setDefaultAttr,
    filteredDefaultAttr, setFilteredDefaultAttr,
    showfield, setShowField, formData, setFormData,
    showEmpField, setShowEmpField,
  } = allState;
  const languageKeyMap = {
    "English": "attEng",
    "Hindi": "attHin",
    "Arabic": "attAra",
    "Urdu": "attUrdu",
    "Turkish": "attTurk"
  };

  const showEmployeeField = (e) => {
    const isChecked = e.target.checked;
    setShowEmpField(isChecked);
    setFormData((prevData) => ({
      ...prevData,
      feedbackOnEmployee: isChecked ? "Yes" : "No",
    }));
  };

  const showReviewField = (e) => {
    setShowField(e.target.checked);
  };

  const formattedAttributes = attributes.map((attribute, index) => ({
    surveyTermId: 0,
    surveyId: 0,
    termName: attribute.values.map((value, langIndex) => ({
      language: selectedLanguages[langIndex].languageLabel,
      name: value,
    })),
    termType: null,
    language: selectedLanguages[0].languageLabel,
    status: 0,
  }));

  const updatedPayload = {
    ...payload,
    attributes: formattedAttributes,
  };
  console.log("Formatted Payload:", updatedPayload);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { values: selectedLanguages.map((lang) => "") },
    ]);
  };
  console.log("attributes-------", attributes);

  const handleAttributeChange = (index, langIndex, event) => {
    const newAttributes = [...attributes];
    newAttributes[index].values[langIndex] = event.target.value;
    setAttributes(newAttributes);
    console.log("newAttributes", newAttributes);
  };

  const deleteAttribute = (i) => {
    const removeItem = attributes.filter((item, index) => index !== i);
    setAttributes(removeItem);
  };

  const [newAttributes, setnewAttributes] = useState()
  const nextPageHandler = () => {
    const hasDefaultSelected = selectedAttributes.length > 0;
    const hasCustomSelected = attributes.some(attribute =>
      attribute.values.some(value => value)
    );
    if (!hasDefaultSelected && !hasCustomSelected) {
      toast.error("Please choose at least one attribute before proceeding.");
      return;
    }

    const output = { attributes: [] };
    attributes.forEach((attribute, attrIndex) => {
      attribute.values.forEach((value, langIndex) => {
        if (value) {
          output.attributes.push({
            termName: value,
            termType: "NewAttribute",
            language: selectedLanguages[langIndex].languageLabel,
          });
        }
      });
    });

    console.log(JSON.stringify(output, null, 2));
    const combinedAttributes = [...selectedAttributes, ...output.attributes];
    setnewAttributes({ attributes: combinedAttributes });
    setShowBackPage(false);
    setLaunchSurvey(true);
  };

  useEffect(() => {
    if (defaultAttr.length > 0) {
      const languageKey = selectPrimaryLangId?.languageId
        ? languageKeyMap[selectPrimaryLangId.languageId]
        : "englishLanguage";

      const filtered = defaultAttr.map(item => ({
        ...item,
        label: item[languageKey] || item.attEng
      }));
      setFilteredDefaultAttr(filtered);
    }
  }, [defaultAttr, selectPrimaryLangId]);

  useEffect(() => {
    fetchDefaultAttribute();
  }, []);

  useEffect(() => {
    getAllBusinessAttribute(selectedSector);
  }, [selectedSector]);

  useEffect(() => {
    if (selectedSector) {
      getAllBusinessAttribute(selectedSector);
    }
  }, []);

  const getAllBusinessAttribute = async (id) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/getBusinessAttributeById/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAttrData(data);
    } catch (error) {
      console.log("Error ::>>", error);
    }
  };

  const handleSubSectorChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedAttributes((prev) => [
        ...prev,
        {
          termName: value,
          termType: "Indb",
          language:
            selectPrimaryLangId?.languageLabel ||
            englishLanguage?.languageLabel,
        },
      ]);
    } else {
      setSelectedAttributes((prev) =>
        prev.filter((attr) => attr.termName !== value)
      );
    }
    console.log("Selected Attributes:", selectedAttributes);
  };

  const back = () => {
    setShowBackPage(true);
  };

  const fetchDefaultAttribute = async () => {
    const mapIds = [60, 61, 62, 63, 64];
    try {
      const { data } = await axios.get(
        `${baseUrl}/getDefaultAttributes?mapIds=${mapIds}`
      );
      setDefaultAttr(data);
    } catch (error) {
      console.error("Error fetching default attributes:", error);
    }
  };

  function ichangeHandler(inputIndex, attributeIndex, e) {
    console.log(inputIndex, attributeIndex);
    const b = [...attributes];
    b[attributeIndex].values[inputIndex] = e.target.value;
    setAttributes(b)
  }

  const handleFetchSurvey = async () => {
    await getAllSurveyById();
    setAttrData(surveyData?.attributes || []);
    setSelectedAttributes(surveyData?.attributes || []);
    setDefaultAttr(surveyData?.label || []);
  };

  useEffect(() => {
    if (surveyData?.surveyId) {
      handleFetchSurvey();
    }
  }, [surveyData?.surveyId])

  return (
    <div className="container">
      {showbackPage ? (
        <div className="row justify-content-center">
          <div className="border p-5 bg-white boxShadow" style={{ width: "78%", margin: "", borderRadius: "15px" }}>
            <div className="d-flex justify-content-between">
              <b className="textSize">
                {businessNames && businessNames.map((businessName, index) => (
                  <span className="text-dark" key={businessNames.languageMasterId || index}>{businessName.value}</span>
                ))}
                <b className="text-dark">{selectedCity ? selectedCity.cityName : ""}</b>
              </b>
              <b className="textSize">
                {businessSlogans && businessSlogans.map((slogan, index) => (
                  <span className="text-dark" key={slogan.languageMasterId || index}>{slogan.value}</span>
                ))}
              </b>
            </div>
            <h5 className="mb-3">Customer Satisfaction Survey</h5>
            <p className="fw-bold text-dark pt-3 pb-3 m-0" style={{ fontSize: "14px", borderTop: "1px solid #ddd" }}>Q1: On a scale of 0 to 10 how likely are you to recommend our business to your friends or family members, where 0 means "Not at all likely" and 10 means "Very likely"?</p>
            <p className="fw-bold text-dark pt-3 pb-3 m-0" style={{ fontSize: "14px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Q2: How do you rate us on the following attributes on a five point scale where 5 means excellent and 1 means very bad?</p>
            <div className="mt-3">
              <p className="text-dark mb-2">Please select attributes from the list below. You can also add your own attributes.</p>
              <div className="d-flex flex-column">
                <div className="formCheck gap-2 align-items-center">
                  {attrData.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        value={surveyData?.surveyId ? item?.termName : item?.attributeName}
                        checked={!!selectedAttributes.find(attr => surveyData?.surveyId
                          ? attr?.termName === item?.termName
                          : attr?.termName === item?.attributeName
                        )
                        }
                        onChange={handleSubSectorChange}
                      />
                      <label htmlFor={`checkbox-${index}`}>
                        {surveyData?.surveyId ? item?.termName : item?.attributeName}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="formCheck gap-2 align-items-center">
                  {filteredDefaultAttr.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        value={item.label}
                        checked={!!selectedAttributes.find(attr => attr.termName === item.label)}
                        onChange={handleSubSectorChange}
                      />
                      <label>{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <div className="mb-3">
                {attributes.map((attribute, index) => (
                  <div className="border mb-3" style={{ borderRadius: "8px" }} key={index}>
                    <div className="border d-flex justify-content-between p-1 px-2" style={{ background: "rgba(5, 99, 255, 0.17)", borderRadius: "8px" }}>
                      <span>Attribute #{index + 1}</span>
                      <span className="fw-bold text-danger" onClick={() => deleteAttribute(index)} style={{ cursor: "pointer", fontSize: '11px', lineHeight: '2' }}><ImCross /></span>
                    </div>
                    <div className="px-3 pb-3 mt-2">
                      {selectedLanguages.map((language, langIndex) => (
                        <div key={langIndex} className="d-flex flex-column">
                          <label className="mb-0">{language.languageLabel}</label>
                          <input
                            type="text"
                            value={attribute.values[langIndex]}
                            onChange={(e) => { ichangeHandler(langIndex, index, e) }}
                            className="form-control"
                            placeholder={`Write your attribute in ${language.languageLabel}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {surveyData?.surveyId && (
                <button className="btn btn-primary px-3" onClick={addAttribute}>Add a New Attribute</button>
              )}
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button className="px-3 border text-muted" onClick={changePageHandler} style={{ background: "#0563ff2b", borderRadius: "5px" }} ><IoChevronBack />Back</button>
              <button className="btn btn-primary mb-0" onClick={nextPageHandler}>Next<span className="fw-bold" style={{ fontSize: "18px" }}><MdOutlineChevronRight /></span></button>
            </div>
          </div>
        </div>
      ) : showLaunchSurvey ? (
        <LaunchSurvey
          pageChangeHandler={back}
          formData={formData}
          setFormData={setFormData}
          showReviewField={showReviewField}
          showEmployeeField={showEmployeeField}
          setShowEmpField={setShowEmpField}
          showEmpField={showEmpField}
          showfield={showfield}
          setShowField={setShowField}
          setCustomcheck={setCustomcheck}
          customcheck={customcheck}
          customCheckbox={customCheckbox}
          setCustomchecks={setCustomchecks}
          customchecks={customchecks}
          customCheckboxs={customCheckboxs}
          restaurantCheck={restaurantCheck}
          restaurantCheckBox={restaurantCheckBox}
          setrestaurantCheck={setrestaurantCheck}
          getAllSurveyById={getAllSurveyById}
          surveyData={surveyData}
          payloads
          updatedPayload={{ ...updatedPayload, attributes: [...newAttributes?.attributes] }}
        />
      ) : (
        <CreateSmileSurvey setShowBackPage={setShowBackPage} />
      )}
    </div>
  );
};

export default AddNewAttribute;
