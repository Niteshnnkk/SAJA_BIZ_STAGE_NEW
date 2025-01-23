import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useParams } from "react-router-dom";
import Config from "../config/config";

const BusinessSummary = () => {
  const { id: surveyId } = useParams();
  const baseUrl = Config.baseUrl;
  const [businessSummary, setBusinessSummary] = useState({});

  const getSurveyById = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/survey/${surveyId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setBusinessSummary(data);
    } catch (error) {
      console.log("Error ::>>", error);
    }
  };

  useEffect(() => {
    if (surveyId) {
      getSurveyById();
    }
  }, [surveyId]);

  return (
    <div className="container d-flex justify-content-center mb-5">
      <div
        className="card shadow p-4 rounded-lg rounded rounded-4"
        style={{ width: "78%" }}
      >
        <div className="card-body">
          <div className="row gap-2">
            <div className="d-flex">
              <div className="col-lg-6">Is Multi Branch :</div>
              <div className="">
                {businessSummary.isMultiBranch === "Yes" ? "Yes" : "No"}
              </div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Chosen Language:</div>
              <div className="">{businessSummary.languages || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Primary Language :</div>
              <div className="">{businessSummary.primaryLanguage || "N/A"}</div>
            </div>
            <div className="d-flex align-items-center">
              <div className="col-lg-6">Business Logo :</div>
              <div
                className="border"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "100px",
                }}
              >
                <img
                  src={businessSummary.bussLogoUrl || "your-logo-url.jpg"}
                  alt="Business Logo"
                  className="business-logo w-100 p-1 h-100"
                />
              </div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Business Name :</div>
              <div className="">{businessSummary.businessName || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Choose Country :</div>
              <div className="">{businessSummary.countryId || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Choose State :</div>
              <div className="">{businessSummary.stateId || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">City :</div>
              <div className="">{businessSummary.cityName || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Branch :</div>
              <div className="">{businessSummary.branch || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Business Sector :</div>
              <div className="">{businessSummary.busSubSector || "N/A"}</div>
            </div>
            <div className="d-flex">
              <div className="col-lg-6">Business Slogan :</div>
              <div className="">{businessSummary.businessSlogan || "N/A"}</div>
            </div>
          </div>
        </div>
        <div className="text-right mt-3 fw-bold d-flex justify-content-end">
          <button className="btn btn-primary fw-bold">
            Next
            <MdOutlineNavigateNext style={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessSummary;
