import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";
import Background from "../Pages/bg";

function MainLayout() {
  const location = useLocation();
  const routeName = location.pathname;
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (routeName.includes("new-survey")) {
      setIsActive(false);
    }
  }, [window.location.pathname]);
  const toggleClass = () => {
    setIsActive(!isActive);
  };

  const PublishSurvey = useMatch("/surveyPublish/:surveyid?");
  const AnalyzeSajaSkySurvey = useMatch("/skyanalyze/:surveyid?");

  // console.log("routeName ::>>", routeName);
  return (
    <section style={{ marginTop: "4%" }}>
      <div className="container p-0 position-relative">
        <div class="row position-absolute" style={{ top: "-40px" }}>
          {PublishSurvey || AnalyzeSajaSkySurvey ? null : (
            <div class="col-md-2">
              <span
                className="toggleBar mb-4"
                style={{ cursor: "pointer", fontSize: "22px" }}
              >
                <FaBars
                  onClick={toggleClass}
                  style={{ top: "5%", left: "0%" }}
                />
              </span>
            </div>
          )}
        </div>
        <div
          className="d-flex container-fluid justify-content-center scrollBar p-0"
          style={{
            marginTop: PublishSurvey || AnalyzeSajaSkySurvey ? "1%" : "0%",
          }}
        >
          {routeName == "/" ||
          routeName == "/signup" ||
          routeName == "/forgot" ||
          routeName == "/view-survey/:id"
            ? null
            : ""}
          {PublishSurvey || AnalyzeSajaSkySurvey ? null : (
            <div
              style={{
                width: isActive ? "20%" : "0",
                transition: "width 0.3s ease",
                overflow: "hidden",
                marginLeft: "0%",
              }}
            >
              <Sidebar />
            </div>
          )}
          <main
            role="main"
            className="content mt-4"
            style={{
              width: isActive ? "80%" : "100%",
              justifyContent: "center",
              margin: "revert",
            }}
          >
            <Outlet />
          </main>
        </div>
        {/* {PublishSurvey ? null : <Footer />} */}
      </div>
      {PublishSurvey ? null : (
        <div>
          <Background />
        </div>
      )}
    </section>
  );
}

export default MainLayout;
