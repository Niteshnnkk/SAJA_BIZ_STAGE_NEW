import React, { useState } from "react";
import {
  FaChartPie,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaLanguage,
  FaMobile,
  FaRecycle,
  FaShieldAlt,
  FaSitemap,
  FaToolbox,
} from "react-icons/fa";
import "./Settingscomp.css";
import Criteria from "./advance/Criteria";
import FieldForce from "./advance/FieldForce";
import Looping from "./advance/Looping";
import Mapping from "./advance/Mapping";
import Quota from "./advance/Quota";
import Timer from "./advance/Timer";
import Variables from "./advance/Variables";
import Analytics from "./general/Analytics";
import CompletionRule from "./general/CompletionRule";
import GeneralSettings from "./general/GeneralSettings";
import LanguageSettings from "./general/LanguageSettings";
import Qualitychecks from "./general/Qualitychecks";
import Security from "./general/Security";

export default function Settingscomp() {
  const [show, setShow] = useState("General");
  const [tab, settab] = useState("basic");
  function changeCOmponentHandler(comp) {
    setShow(comp);
  }

  const sideBarMenus = [
    {
      label: "General",
      desc: "Manage general settings for yur survey",
      imgUrl: <FaToolbox style={{ fontSize: "23px" }} />,
    },
    {
      label: "Languages",
      desc: "Convert your survey into multiple languages",
      imgUrl: <FaLanguage style={{ fontSize: "23px" }} />,
    },
    {
      label: "Quality Checks",
      desc: "Manage timing, device and response quality",
      imgUrl: <FaCheckCircle style={{ fontSize: "23px" }} />,
    },
    {
      label: "Security",
      desc: "Configure security of the survey",
      imgUrl: <FaShieldAlt style={{ fontSize: "23px" }} />,
    },
    {
      label: "Completion Rule",
      desc: "Redirect respondent to desired location",
      imgUrl: <FaClipboardList style={{ fontSize: "23px" }} />,
    },
    {
      label: "Analytics",
      desc: "Configure analytics rules for the survey",
      imgUrl: <FaChartPie style={{ fontSize: "23px" }} />,
    },
  ];
  const advancesideBarMenus = [
    {
      label: "Criteria",
      desc: "Manage and create criteria to collect responses",
      imgUrl: <FaClock style={{ fontSize: "23px" }} />,
    },
    {
      label: "Quota",
      desc: "Limit the number of responses for your survey",
      imgUrl: <FaChartPie style={{ fontSize: "23px" }} />,
    },
    {
      label: "Timer",
      desc: "Manage timers multiple question blocks",
      imgUrl: <FaClock style={{ fontSize: "23px" }} />,
    },
    {
      label: "Looping",
      desc: "Dynamically loop through a set of questions",
      imgUrl: <FaRecycle style={{ fontSize: "23px" }} />,
    },
    {
      label: "Maping",
      desc: "Mapping for carry forward logic",
      imgUrl: <FaSitemap style={{ fontSize: "23px" }} />,
    },
    {
      label: "Variables",
      desc: "Pass additional information to your survey",
      imgUrl: <FaClock style={{ fontSize: "23px" }} />,
    },
    {
      label: "FieldForce Recording",
      desc: "Record audio for the FieldForce app",
      imgUrl: <FaMobile style={{ fontSize: "23px" }} />,
    },
  ];
  return (
    <div className="d-flex gap-4 main">
      <div className="leftPart">
        <div className="d-flex gap-3 justify-content-start  tabsContainer">
          <p
            className=" m-0 tabs"
            style={{
              padding: "13px",
              cursor: "pointer",
              borderBottom: tab === "basic" ? "2px solid black" : "",
            }}
            onClick={() => {
              settab("basic");
              setShow("General");
            }}
          >
            Basic
          </p>

          <p
            className=" m-0 tabs"
            style={{
              padding: "13px",
              cursor: "pointer",
              borderBottom: tab === "advance" ? "2px solid black" : "",
            }}
            onClick={() => {
              settab("advance");
              setShow("Criteria");
            }}
          >
            Advance
          </p>
        </div>

        {tab === "basic" && (
          <div>
            {sideBarMenus?.map((item) => {
              return (
                <>
                  <div
                    className="leftPartDivs"
                    onClick={() => {
                      changeCOmponentHandler(item?.label);
                    }}
                    style={{
                      backgroundColor:
                        show === item?.label ? "rgb(237, 232, 232)" : "",
                    }}
                  >
                    <div className="iconsContainer">
                      {item?.imgUrl}
                      {/* <img src={item.imgUrl} alt="" /> */}
                    </div>
                    <div>
                      <p className="m-0 p-0 settingHeading"> {item?.label}</p>
                      <p className="SettinglongText m-0 p-0">{item?.desc}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}

        {tab === "advance" && (
          <div>
            {advancesideBarMenus?.map((item) => {
              return (
                <>
                  <div
                    className="leftPartDivs"
                    onClick={() => {
                      changeCOmponentHandler(item?.label);
                    }}
                    style={{
                      backgroundColor:
                        show === item?.label ? "rgb(237, 232, 232)" : "",
                    }}
                  >
                    <div className="iconsContainer">{item?.imgUrl}</div>
                    <div>
                      <p className="m-0 p-0 settingHeading"> {item?.label}</p>
                      <p className="SettinglongText m-0 p-0">{item?.desc}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>

      {tab === "basic" && (
        <div className="rightPart">
          {show === "General" ? (
            <>
              <GeneralSettings />
            </>
          ) : null}
          {show === "Languages" ? (
            <>
              <LanguageSettings />
            </>
          ) : null}
          {show === "Quality Checks" ? (
            <>
              <Qualitychecks />
            </>
          ) : null}
          {show === "Security" ? (
            <>
              <Security />
            </>
          ) : null}
          {show === "Completion Rule" ? (
            <>
              <CompletionRule />
            </>
          ) : null}
          {show === "Analytics" ? (
            <>
              <Analytics />
            </>
          ) : null}
        </div>
      )}

      {tab === "advance" && (
        <div className="rightPart">
          {show === "Criteria" ? (
            <>
              <Criteria />
            </>
          ) : null}
          {show === "FieldForce Recording" ? (
            <>
              <FieldForce />
            </>
          ) : null}
          {show === "Looping" ? (
            <>
              <Looping />
            </>
          ) : null}
          {show === "Timer" ? (
            <>
              <Timer />
            </>
          ) : null}
          {show === "Quota" ? (
            <>
              <Quota />
            </>
          ) : null}
          {show === "Variables" ? (
            <>
              <Variables />
            </>
          ) : null}
          {show === "Maping" ? (
            <>
              <Mapping />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
