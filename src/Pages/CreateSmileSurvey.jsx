import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
import { MdOutlineChevronRight } from "react-icons/md";
import { useLocation, useParams } from 'react-router-dom';
import AddNewAttribute from "./../Pages/AddNewAttribute";
import placeholder from "../../src/assets/Images/placeholder.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config/config";
import InputField from "./InputField";
import uploadImg from "../../src/assets/Images/img_upload_icon.png";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dropdown } from 'primereact/dropdown';

const CreateSmileSurvey = () => {
  const baseUrl = Config.baseUrl;
  const [isVisible, setIsVisible] = useState(true);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const surveyType = searchParams.get('type');
  const [allCountry, setAllCountry] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [manualCityName, setManualCityName] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState({
    "countryId": "101",
    "countryName": "India",
    "code1": "IN",
    "code2": "IND"
  });
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [payload, setPayload] = useState(null);
  const [bussSubSector, setbussSubSector] = useState([]);
  const [languages, setLanguages] = useState([
    { languageId: "English", languageLabel: "English" },
    { languageId: "Arabic", languageLabel: "Arabic" },
    { languageId: "Hindi", languageLabel: "Hindi" },
    { languageId: "Urdu", languageLabel: "Urdu" },
    { languageId: "Turkey", languageLabel: "Turkey" }
  ]);
  const [preview, setPreview] = useState(null);
  const maxSize = 150 * 1024;
  const [selectedSubSector, setSelectedSubSector] = useState("");
  const [sector, setSector] = useState([]);
  const [subSector, setSubSector] = useState([]);
  const [selectPrimaryLang, setselectPrimaryLang] = useState("");
  const [selectedSector, setSelectedSector] = useState('');
  const [file, setFile] = useState(null);
  const [canProceed, setCanProceed] = useState(false);
  const [errors, setErrors] = useState({});
  const englishLanguage = languages.filter(lang => lang.languageLabel === "English");
  const languageId = englishLanguage[0]['languageId'];
  const languageLabel = englishLanguage[0]['languageLabel'];
  const [selectedLanguage, setSelectedLanguage] = useState(englishLanguage);
  const [inputData, setInputData] = useState([{
    inputName: languageLabel,
    languageId: languageId
  }]);
  const [businessNames, setBusinessNames] = useState([{ languageId: languageId, value: '' }]);
  const [branchNames, setBranchNames] = useState([{ languageId: languageId, value: '' }]);
  const [businessSlogans, setBusinessSlogans] = useState([{ languageId: languageId, value: '' }]);
  const { id } = useParams();
  console.log("selectedSubSector----->", selectedSubSector)
  const languageHandler = (event) => {
    const selectedLanguages = event.target.value;
    setSelectedLanguage(selectedLanguages);
    selectedLanguages.forEach(language => {
      if (language.languageName === 'English') {
        getAllBusinessSector(language.languageId);
      }
    });

    if (!selectedLanguages.some(language => language.languageName === 'English')) {
      setSector([]);
    }

    const updateOrAddField = (fieldsArray, language) => {
      const index = fieldsArray.findIndex(item => item.languageId === language.languageId);
      if (index === -1) {
        fieldsArray.push({ languageId: language.languageId, value: '' });
      }
    };

    const updatedBusinessNames = [...businessNames];
    const updatedBranchNames = [...branchNames];
    const updatedBusinessSlogans = [...businessSlogans];
    selectedLanguages.forEach(language => {
      updateOrAddField(updatedBusinessNames, language);
      updateOrAddField(updatedBranchNames, language);
      updateOrAddField(updatedBusinessSlogans, language);
    });

    const filteredBusinessNames = updatedBusinessNames.filter(item =>
      selectedLanguages.some(language => language.languageId === item.languageId)
    );
    const filteredBranchNames = updatedBranchNames.filter(item =>
      selectedLanguages.some(language => language.languageId === item.languageId)
    );
    const filteredBusinessSlogans = updatedBusinessSlogans.filter(item =>
      selectedLanguages.some(language => language.languageId === item.languageId)
    );

    setBusinessNames(filteredBusinessNames);
    setBranchNames(filteredBranchNames);
    setBusinessSlogans(filteredBusinessSlogans);

    const tempInputData = selectedLanguages.map(language => ({
      inputName: language.languageLabel,
      languageId: language.languageId
    }));
    setInputData(tempInputData);
  };

  const inpuFieldHandler = (e, languageId, fieldName) => {
    const { value } = e.target;
    if (fieldName === 'Business Name') {
      setBusinessNames(prev => prev.map(field =>
        field.languageId === languageId ? { ...field, value } : field
      ));
      setErrors({
        ...errors,
        businessNames: '',
      })
    }

    if (fieldName === 'Branch Name') {
      setBranchNames(prev => prev.map(field =>
        field.languageId === languageId ? { ...field, value } : field
      ));
      setErrors({
        ...errors,
        branchNames: '',
      })
    }

    if (fieldName === 'Add your business slogan') {
      setBusinessSlogans(prev => prev.map(field =>
        field.languageId === languageId ? { ...field, value } : field
      ));
      setErrors({
        ...errors,
        businessSlogans: '',
      })
    }
  };

  const getAllCountry = async () => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/getAllCountry`,
        method: "GET",
        headers: {
          "Content-Type": "application/josn"
        }
      })
      setAllCountry(data);
    } catch (error) {
      console.log("Something went wrong ::>>", error);
    }
  }

  const getStateByCountryId = async (countryId) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/getStateByCountryId/${countryId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      setAllState(data);
    } catch (error) {
      console.log("Something went wrong ::>>", error);
    }
  }

  const getCityByStateId = async (stateId) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/getCityByStateId/${stateId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      setAllCity(data);
      if (data.length > 0) {
        setSelectedCityId(data[0].cityId);
      }
    } catch (error) {
      console.log("Something went wrong ::>>", error);
    }
  }

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountryId(country);
    getStateByCountryId(country.countryId);
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedStateId(stateId);
    getCityByStateId(stateId);
    setErrors({
      ...errors,
      selectedStateId: '',
    });
  }

  useEffect(() => {
    if (selectPrimaryLang && selectPrimaryLang.languageId) {
      getAllBusinessSector(selectPrimaryLang.languageId);
    }
  }, [selectPrimaryLang]);
  useEffect(() => {
    const englishLanguage = languages.find(lang => lang.languageLabel === "English");
    if (englishLanguage) {
      getAllBusinessSector(englishLanguage.languageId);
    }
  }, []);
  useEffect(() => {
    getAllCountry();
    if (selectedCountryId.countryId === "101") {
      getStateByCountryId("101");
    } else {
      setAllState([]);
    }
  }, [selectedCountryId])

  const getAllBusinessSector = async (languageId) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/getBusinessCategoryByLangId/${languageId}`,
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      setSector(data);
    } catch (error) {
      setSector([]);
      console.log("Error ::>>", error);
    }
  }
  const [selectedBusinessName, setSelectedBusinessName] = useState([]);
  const handleSectorChange = (e) => {
    const selectedBusinessId = e.value;
    const selectedBusinessName = sector.find((item) => item.businessCategoryId === selectedBusinessId)?.businessCategoryName;
    setSelectedSector(selectedBusinessId);
    setSelectedBusinessName(selectedBusinessName);
    getSubSectorByBusinessId(selectedBusinessId);
    setErrors({
      ...errors,
      selectedSector: '',
    });
  };

  const getSubSectorByBusinessId = async (businessCategoryId) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/getSubCategoryByBusinessId/${businessCategoryId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      setSubSector(data);
    } catch (error) {
      console.log("Something went wrong ::>>", error);
    }
  }

  const handleSubSectorChange = (e) => {
    const selectedSubSectorId = e.value;
    setSelectedSubSector(selectedSubSectorId);

    const selectedSubSectorNames = selectedSubSectorId
      .map((id) => {
        const subSectorItem = subSector.find(item => item.businessSubCategoryId === id);
        return subSectorItem ? subSectorItem.businessSubCategoryName : null;
      })
      .filter(name => name)
      .join(", ");
    setbussSubSector(selectedSubSectorNames)
    console.log('Selected Sub-Sector Names:', selectedSubSectorNames);
  };

  const handleShowPage = () => {
    const newErrors = {};
    if (!id) {
      if (!selectedLanguage || selectedLanguage.length === 0) {
        newErrors.selectedLanguage = "Please choose at least one language.";
      }
      if (selectedLanguage.some(lang => lang.languageLabel !== "English") && !selectPrimaryLang) {
        newErrors.selectPrimaryLang = "Please select a primary language.";
      }
      if (!businessNames || businessNames.every(name => !name.value)) {
        newErrors.businessNames = "Please provide a business name.";
      }
      if (!branchNames || branchNames.every(name => !name.value)) {
        newErrors.branchNames = "Please provide a branch name.";
      }
      // if (!businessSlogans || businessSlogans.every(slogan => !slogan.value)) {
      //     newErrors.businessSlogans = "Please provide a business slogan.";
      // }
      if (!selectedCountryId) {
        newErrors.selectedCountryId = "Please select a country.";
      }
      // if (!selectedStateId) {
      //   newErrors.selectedStateId = "Please select a state.";
      // }
      if (!selectedSector) {
        newErrors.SectorName = "Please select a business sector.";
      }
      if (!preview) {
        newErrors.file = "Please upload a business logo.";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCanProceed(true);
    const languageIds = selectedLanguage?.map(lang => lang?.languageId);
    const primaryLanguageId = selectPrimaryLang && selectPrimaryLang.languageId ? selectPrimaryLang.languageId : "English";
    const bussLogoUrl = preview;
    const selectedCountry = allCountry.find(country => country.countryId === selectedCountryId || country.countryId === englishLanguage);
    const countryName = selectedCountryId ? selectedCountryId.countryName : '';
    const selectedState = allState.find(state => state.stateId === selectedStateId);
    const selectedCity = allCity.find(city => city.cityId === selectedCityId);
    const stateName = selectedState ? selectedState.stateName : manualStateName;
    const cityName = selectedCity ? selectedCity.cityName : manualCityName;

    const newPayload = {
      languageIds,
      primaryLanguage: primaryLanguageId,
      bussLogoUrl,
      businessName: businessNames.map(name => ({
        languageId: name.languageId,
        name: name.value
      })),
      countryId: selectedCountryId.countryId,
      countryName: countryName,
      stateId: selectedStateId,
      stateName,
      cityId: selectedCityId,
      cityName,
      businessBranch: branchNames.map(branch => ({
        languageId: branch.languageId,
        name: branch.value
      })),
      businessSlogan: businessSlogans.map(slogan => ({
        languageId: slogan.languageId,
        name: slogan.value
      })),
      businessSector: selectedBusinessName,
      busSubSector: bussSubSector,
    };
    setPayload(newPayload);
    setIsVisible(true);
  };

  const backPage = () => {
    setCanProceed(false);
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > maxSize) {
      toast.error("File size should not exceed 150KB");
      fileInputRef.current.value = '';
      return;
    } else {
      setErrors({
        ...errors,
        file: '',
      });
    }

    if (selectedFile) {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const { data } = await axios({
          url: `${baseUrl}/api/files/upload`,
          method: 'POST',
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        console.log("upload data ::>>", data);
        setPreview(URL.createObjectURL(selectedFile));
        setFormData((prevData) => ({
          ...prevData,
          bussLogoUrl: data,
        }));
        console.log("setPreview ::>>", preview);
        toast.success("File uploaded successfully!");
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const fileDelete = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Image deleted successfully!");
  };

  const handlePrimaryLanguage = (e) => {
    const selectPrimaryLangId = (e.target.value);
    const selectedLanguage = languages.find(lang => lang.languageId === selectPrimaryLangId);
    if (selectedLanguage) {
      setselectPrimaryLang(selectedLanguage);
    } else {
      console.warn(`No language found for ID: ${selectPrimaryLangId}`);
    }
  };


  // -------------------------------------SECOND AND THIRD PAGE STATE -------------------------------------------
  const [attributes, setAttributes] = useState([]);
  const [attrData, setAttrData] = useState([]);
  const [showbackPage, setShowBackPage] = useState(true);
  const [showLaunchSurvey, setLaunchSurvey] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [data, setData] = useState(null);
  const [defaultAttr, setDefaultAttr] = useState([]);
  const [filteredDefaultAttr, setFilteredDefaultAttr] = useState([]);
  const [showfield, setShowField] = useState(false);
  const [showEmpField, setShowEmpField] = useState(false);
  const [formData, setFormData] = useState({
    alertEmailIds: "",
    employeesName: [""],
    reviewLink: "",
    surveySuggestion: "Improved Service",
    custSatisfactionSurvey: "Excellent service, friendly staff.",
    anySuggestion: "Consider offering new products.",
    qrCodeUrl: "",
    userId: 10,
    isCollectBillInfo: "No",
    isSourceAwarness: "No",
    isGoogleReview: "No",
    isTakeFoodSugg: "No",
    status: "Active",
    createdOn: new Date().toISOString(),
    multiLanguageId: "",
    multiLangOrder: 1,
    isMultiBranch: "No",
    isMultiLanguage: "Yes",
    multibranchParentId: 0,
    typeOfOrder: "",
    feedbackOnEmployee: "No",
    suggestionForFoodMenu: false,
  })

  useEffect(() => {
    setSelectedSubSector([]);
    setSubSector([]);
  }, [selectPrimaryLang, selectedLanguage]);

  // const [customcheck, setCustomcheck] = useState(false);
  // const customCheckbox = (e) => {
  //   const customCheckValue = e.target.checked ? "Yes" : "No";
  //   // setCustomcheck(customCheckValue);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     isCollectBillInfo: customCheckValue,
  //   }));
  // };

  // const [customchecks, setCustomchecks] = useState(false);
  // const customCheckboxs = (e) => {
  //   const customCheckValue = e.target.checked ? "Yes" : "No";
  //   // setCustomchecks(customCheckValue);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     isSourceAwarness: customCheckValue,
  //   }));
  // };

  const [restaurantCheck, setrestaurantCheck] = useState(false);
  const restaurantCheckBox = (e) => {
    const customRestaurantValue = e.target.checked ? "Yes" : "No";
    setFormData((prevFormData) => ({
      ...prevFormData,
      isTakeFoodSugg: customRestaurantValue,
    }));
  };

  const [manualStateName, setManualStateName] = useState("");
  const [surveyData, setSurveyData] = useState([]);
  const getAllSurveyById = async () => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/api/survey/getSurveyDetails/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      setFormData((prevData) => ({
        ...prevData,
        isCollectBillInfo: data?.isCollectBillInfo || "No",
        isSourceAwarness: data?.isSourceAwarness || "No",
        // suggestionForFoodMenu: data?.suggestionForFoodMenu || "No"
      }));
      console.log("selectedSubSectordata----->", data)
      if (data.cityName) {
        const cityObj = allCity.find(city => city.cityName === data.cityName);
        if (cityObj) {
          setSelectedCityId(cityObj.cityId);
        } else {
          setManualCityName(data.cityName);
        }
      }
      if (data.stateName) {
        const stateObj = allState.find(state => state.stateName === data.stateName);
        console.log("stateObj ::>>", stateObj);
        if (stateObj) {
          setSelectedStateId(stateObj.stateId);
        } else {
          setManualStateName(data.stateName);
          console.log("data.stateName", data.stateName);
        }
      }

      if (data.businessName) {
        setBusinessNames([{ languageId, value: data.businessName }]);
      }
      if (data.branch) {
        setBranchNames([{ languageId, value: data.branch }]);
      }
      if (data.businessSlogan) {
        setBusinessSlogans([{ languageId, value: data.businessSlogan }]);
      }
      if (data?.bussLogoUrl) {
        setPreview(data?.bussLogoUrl);
      }
      if (data?.bussLogoUrl) {
        setPreview(data?.bussLogoUrl);
      }

      if (data?.busSubSector) {
        setbussSubSector(data?.busSubSector);
      }
      setSurveyData(data);
    } catch (error) {
      console.log("Error ::>>", error);
    }
  }

  useEffect(() => {
    if (surveyData) {
      // if (surveyData?.isSourceAwarness) {
      //   setCustomchecks(true);
      // }
      // if (surveyData?.isCollectBillInfo) {
      //   setCustomcheck(true);
      // }
      // if (surveyData?.isTakeFoodSugg) {
      //   setrestaurantCheck(true);
      // }
      // if(surveyData?. sourceOfInformation: false,
      //   `billNumber`: false,
      //   feedbackOnEmployee: false,
      //   suggestionForFoodMenu: false,)

      if (surveyData?.sourceOfInformation) {
        setFormData(true);
      }
    }
  }, [surveyData]);

  useEffect(() => {
    if (id) {
      getAllSurveyById();
    }
  }, [id])

  console.log("allCity ::>>", allCity);
  return (
    <div className="container mb-5">
      <ToastContainer />
      {isVisible && !canProceed ? (
        <div className="row">
          <div className="bg-white p-5 border boxShadow" style={{ width: "78%", margin: "auto", borderRadius: "15px" }}>
            {surveyType === 'multi-branch-survey' && (
              <div className="row mb-3 align-items-center">
                <div className="col-lg-4">
                  <label className="m-0">Multi Branch<span className="text-danger fw-bold">*</span></label>
                </div>
                <div className="col-lg-8 p-0 padding">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="ismultibranch"
                    onChange={(e) => setFormData({ ...formData, isMultiBranch: e.target.value })}
                  >
                    <option selected disabled>Choose</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

              </div>
            )}

            <div className="row mb-3 align-items-center">
              <div className="col-lg-4">
                <label className="m-0">Choose Language<span className="text-danger fw-bold">*</span></label>
              </div>
              {id ? (
                <div className="col-lg-8 padding card flex justify-content-center p-0 form-group">
                  <input type="text" className="form-control" disabled value={surveyData?.languages} />
                </div>
              ) : (
                <div className="col-lg-8 padding card flex justify-content-center p-0">
                  <MultiSelect
                    value={selectedLanguage}
                    onChange={languageHandler}
                    options={languages}
                    optionLabel="languageLabel"
                    showSelectAll={true}
                    placeholder="Choose Language"
                    maxSelectedLabels={3}
                    className="w-100"
                  />
                  {errors.selectedLanguage && <span className="errorText">{errors.selectedLanguage}</span>}
                </div>
              )}
            </div>

            {id ? (
              <div className="d-flex mb-3 align-items-center gap-5">
                <div className="col-lg-3">
                  <label className="m-0">
                    Primary Language<span className="text-danger fw-bold">*</span>
                  </label>
                </div>
                <div className="col-lg-8 padding card flex justify-content-center p-0 form-group" style={{ width: "425px" }}>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={surveyData?.primaryLanguage || ""}
                  />
                </div>
              </div>
            ) : (
              selectedLanguage.some(lang => lang.languageLabel !== "English") && (
                <div className="row mb-3 align-items-center">
                  <div className="col-lg-4">
                    <label className="m-0">
                      Primary Language<span className="text-danger fw-bold">*</span>
                    </label>
                  </div>
                  <div className="col-lg-8 padding card flex justify-content-center p-0">
                    <select
                      className="form-select"
                      value={selectPrimaryLang?.languageId || ""}
                      onChange={handlePrimaryLanguage}
                    >
                      <option value="" disabled>
                        Choose primary language
                      </option>
                      {selectedLanguage.map((item, index) => (
                        <option key={index} value={item.languageMasterId}>
                          {item.languageLabel}
                        </option>
                      ))}
                    </select>
                    {errors.selectPrimaryLangId && (
                      <span className="errorText">{errors.selectPrimaryLangId}</span>
                    )}
                  </div>
                </div>
              )
            )}

            <div className="row mb-2 align-items-center">
              <div className="col-lg-4">
                <label className="m-0">Business Logo<span className="fw-bold text-danger">*</span></label>
              </div>

              <div className="col-lg-8 padding p-0 d-flex justify-content-between position-relative align-items-center">
                <div className="d-flex flex-column">
                  <input type="file" className="form-control w-50" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  <div className="d-flex gap-2 align-items-center" style={{ cursor: "pointer" }}>
                    <img onClick={handleButtonClick} src={uploadImg} style={{ objectFit: "contain", width: "35px", height: "35px", }} />
                    <span className="pt-1" style={{ fontSize: "13px" }}>Maximum size should be 150kb.</span>
                  </div>
                  {errors.file && <span className="errorText">{errors.file}</span>}
                </div>
                <div style={{ width: '40px', height: '40px', border: "1px solid #ddd", borderRadius: "100px" }}>
                  {preview ? (
                    <div style={{ width: '40px', height: "40px", objectFit: "cover" }}>
                      <img className="w-100 h-100" src={id ? surveyData?.bussLogoUrl : preview} alt="Preview" style={{ borderRadius: "100px" }} />
                      <span onClick={fileDelete} className="position-absolute" style={{ fontWeight: '600', lineHeight: "0", color: "red", cursor: "pointer" }}>x</span>
                    </div>
                  ) : (
                    <img className="w-100 h-100" src={placeholder} alt="placeholder Image" style={{ borderRadius: "100px" }} />
                  )}
                </div>
              </div>
            </div>

            <div className="row mb-1">
              <div className="col-lg-4">
                <label className="mt-4">Business Name<span className="text-danger fw-bold">*</span></label>
              </div>

              <div className="col-lg-8 padding p-0">
                <InputField
                  inpuFieldHandler={inpuFieldHandler}
                  inputFieldName={businessNames}
                  inputData={inputData}
                  fieldName="Business Name"
                  value={id ? surveyData?.businessName : ""}
                />
                {errors.businessNames && <span className="errorText">{errors.businessNames}</span>}
              </div>
            </div>

            <div className="row mt-3 mb-3 align-items-center">
              <div className="col-lg-4">
                <label className="m-0">Choose Country<span className="fw-bold text-danger">*</span></label>
              </div>
              <div className="col-lg-8 card padding px-0">
                <Dropdown value={selectedCountryId} onChange={handleCountryChange} options={allCountry} optionLabel="countryName" placeholder={
                  selectedCountryId === '101' ? "India" : "Select a Country"}
                  filter className="w-full md:w-14rem" />
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <div className="col-lg-4">
                <label className="m-0">Choose State<span className="fw-bold text-danger">*</span></label>
              </div>
              {!selectedCountryId || allState.length > 0 ? (
                <div className="col-lg-8 padding card p-0" style={{ border: "none" }}>
                  <Dropdown
                    value={selectedStateId}
                    onChange={(e) => handleStateChange(e)}
                    options={allState}
                    optionLabel="stateName"
                    optionValue="stateId"
                    placeholder="Choose State"
                    filter
                    className="w-full md:w-14rem"
                  />
                  {errors.selectedStateId && <span className="errorText mt-1">{errors.selectedStateId}</span>}
                </div>
              ) : (
                <div className="col-lg-8 padding card p-0">
                  <input
                    type="text"
                    className="w-full md:w-14rem form-control"
                    placeholder="Enter State"
                    value={manualStateName}
                    onChange={(e) => setManualStateName(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="row mb-2 align-items-center">
              <div className="col-lg-4">
                <label className="m-0">City</label>
              </div>

              {!selectedStateId || allCity.length > 0 ? (
                <div className="col-lg-8 padding card p-0">
                  <Dropdown value={selectedCityId} onChange={(e) => setSelectedCityId(e.value)} options={allCity} optionLabel="cityName" optionValue="cityId"
                    placeholder="Choose City"
                    // disabled={!selectedStateId}
                    filter
                    className="w-full md:w-14rem"
                  />
                </div>
              ) : (
                <div className="col-lg-8 padding card p-0">
                  <input
                    type="text"
                    className="w-full md:w-14rem form-control"
                    placeholder="Enter city"
                    value={manualCityName}
                    onChange={(e) => setManualCityName(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="row mb-3">
              <div className="col-lg-4 mt-4">
                <label>Branch<span className="fw-bold text-danger">*</span></label>
              </div>

              <div className="col-lg-8 padding p-0">
                <InputField
                  inpuFieldHandler={inpuFieldHandler}
                  inputFieldName={branchNames}
                  inputData={inputData}
                  fieldName="Branch Name"
                  value={id ? surveyData?.branch : ""}
                />
                {errors.branchNames && <span className="errorText">{errors.branchNames}</span>}
              </div>
            </div>

            <div className="row mb-2 align-items-center">
              <div className="col-lg-4">
                {!id ? (
                  <label className="m-0">Business Sector<span className="text-danger fw-bold">*</span></label>
                ) : null}
              </div>
              {id ? (
                <div className="col-lg-8 padding p-0 mt-2">
                  {/* <input type="text" className="form-control" disabled value={surveyData?.businessSector} /> */}
                </div>
              ) : (
                <div className="col-lg-8 padding p-0">
                  <Dropdown
                    value={selectedSector}
                    onChange={handleSectorChange}
                    options={sector}
                    optionLabel="businessCategoryName"
                    optionValue="businessCategoryId"
                    placeholder="Choose Option"
                    filter
                    className="w-100"
                  />
                  {errors.SectorName && <span className="errorText">{errors.SectorName}</span>}
                </div>
              )}
            </div>

            {selectedSector === "" ? null : <div className="row mb-2 align-items-center">
              <div className="col-lg-4">
                {!id ? (
                  <label className="m-0">Sub Sector</label>
                ) : null}

              </div>

              <div className="col-lg-8 padding p-0 mt-2">
                {!id ? (
                  <div className="checkboxNone">
                    <MultiSelect
                      value={selectedSubSector}
                      optionValue="businessSubCategoryId"
                      onChange={handleSubSectorChange}
                      options={subSector}
                      optionLabel="businessSubCategoryName"
                      placeholder="None Selected"
                      maxSelectedLabels={1}
                      className="w-100"
                      showSelectAll={false}
                      display="multiple"
                    />
                    {errors.selectedSubSector && <span className="errorText">{errors.selectedSubSector}</span>}
                  </div>
                ) : null}
              </div>
            </div>}

            {/* {id ? (
              <div className="d-flex mb-3 align-items-center gap-5">
                <div className="col-lg-3">
                  <label className="m-0">Sub Sector</label>
                </div>
                <div className="col-lg-8 padding p-0 mt-2">
                  <input style={{ width: "425px" }}
                    type="text"
                    className="form-control"
                    value={surveyData?.busSubSector || ""}
                    disabled
                  />
                </div>
              </div>
            ) : null} */}

            <div className="row">
              <div className="col-lg-4 mt-3">
                <label>Business Slogan</label>
              </div>
              <div className="col-lg-8 padding p-0">
                <InputField
                  inpuFieldHandler={inpuFieldHandler}
                  inputFieldName={businessSlogans}
                  inputData={inputData}
                  fieldName="Add your business slogan"
                  value={id ? surveyData?.businessSlogan : ""}
                />
                {errors.businessSlogans && <span className="errorText">{errors.businessSlogans}</span>}
              </div>
            </div>

            {surveyType === 'stand-alone-survey' && (
              <div className="row mb-3">
                <div className="col-lg-4 mt-2">
                  <label>Survey Type<span className="fw-bold text-danger">*</span></label>
                </div>
                <div className="col-lg-8 padding mt-3 p-0">
                  <select className="form-control">
                    <option selected>Customer Satisfaction Survey</option>
                  </select>
                </div>
              </div>
            )}

            <div className="row align-items-center">
              <div className="col-lg-4"></div>
              <div className="col-lg-8 d-flex justify-content-end mt-4 p-0">
                <button className="btn btn-primary mb-0" onClick={handleShowPage}>Next<span className="fw-bold" style={{ fontSize: "18px" }}><MdOutlineChevronRight /></span></button>
              </div>
            </div>
          </div>
        </div>
      ) : canProceed ? (
        <AddNewAttribute changePageHandler={backPage}
          selectedSector={selectedSector}
          selectedCityId={selectedCityId}
          businessNames={businessNames}
          allCity={allCity}
          businessSlogans={businessSlogans}
          handleSubSectorChange={handleSubSectorChange}
          selectPrimaryLangId={selectPrimaryLang}
          englishLanguage={englishLanguage}
          selectedLanguages={selectedLanguage}
          payload={payload}
          // setCustomcheck={setCustomcheck}
          // customcheck={customcheck}
          // customCheckbox={customCheckbox}
          // setCustomchecks={setCustomchecks}
          restaurantCheckBox={restaurantCheckBox}
          restaurantCheck={restaurantCheck}
          setrestaurantCheck={setrestaurantCheck}
          // customchecks={customchecks}
          // customCheckboxs={customCheckboxs}
          getAllSurveyById={getAllSurveyById}
          surveyData={surveyData}
          allState={{
            attributes, setAttributes,
            attrData, setAttrData,
            showbackPage, setShowBackPage,
            showLaunchSurvey, setLaunchSurvey,
            selectedAttributes, setSelectedAttributes,
            data, setData,
            defaultAttr, setDefaultAttr,
            filteredDefaultAttr, setFilteredDefaultAttr,
            showfield, setShowField, formData, setFormData,
            showEmpField, setShowEmpField
          }}
        />
      ) : (
        <h3>Please complete the form to proceed.</h3>
      )
      }
    </div >
  )
}

export default CreateSmileSurvey;