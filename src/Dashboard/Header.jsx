import React from "react";
import { useLocation, useMatch } from "react-router-dom";
import logo from "../assets/Images/dashboardheader.png";

export default function Header() {
  const location = useLocation();
  const hideHeaderOnHomePage = location.pathname === "/";
  const hideHeaderOnsignPage = location.pathname === "/signup";
  const hideHeaderforgotPasswordPage = location.pathname === "/forgot-password";
  const isViewSurvey = useMatch("/view-survey/:id");
  const ViewReviews = useMatch("/view/:id?/:lang?");
  const PublishSurvey = useMatch("/surveyPublish/:surveyid?");
  const isPkliRatingRoute = useMatch("/pkli-rating-form/:id");
  const isThankyoupage = useMatch("/surveyPublish/:surveyid?/thankyou");

  if (isPkliRatingRoute) return null;
  if (isViewSurvey) return null;
  if (hideHeaderOnHomePage) return null;
  if (hideHeaderOnsignPage) return null;
  if (hideHeaderforgotPasswordPage) return null;
  if (ViewReviews) return null;
  if (PublishSurvey) return null;
  if (isThankyoupage) return null;

  return (
    <div className="w-100">
      <div className=" w-100 h-100 d-flex justify-content-end">
        <div style={{ width: "92%" }}>
          <img src={logo} alt="Form Builder" className="w-100" />
        </div>
      </div>
    </div>
  );
}
