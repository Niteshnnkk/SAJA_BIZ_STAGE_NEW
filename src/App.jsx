import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loader from "../src/assets/Images/loader.gif";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
const Login = lazy(() => import("./Pages/Login"));
const Forgot = lazy(() => import("./Pages/Forgot"));
const Register = lazy(() => import("./Pages/Register"));
const ViewSurvey = lazy(() => import("./Pages/ViewSurvey"));
const PublisedSurvey = lazy(() => import("./Pages/PublishedSurvey"));
const SajaskyThankYou = lazy(() => import("./Pages/SajaskyThankYou"));
const SurveyReviewsUrdu = lazy(() => import("./Pages/SurveyReviewUrdu"));
const SurveyReviewsArabic = lazy(() => import("./Pages/SurveyReviewArabic"));
const SurveyReviews = lazy(() => import("./Pages/SurveyReviews"));
const SurveyReviewsHindi = lazy(() => import("./Pages/SurveyReviewHindi"));
const SurveyReviewsTurkey = lazy(() => import("./Pages/SurveyReviewTurkey"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Home = lazy(() => import("./Pages/Home"));
const Survey = lazy(() => import("./Pages/Survey"));
const SajaSkySurvey = lazy(() => import("./Pages/SajaSkySurvey"));
const CreateSurvey = lazy(() => import("./Pages/createSurvey"));
const ManageServey = lazy(() => import("./Pages/Manageservey"));
const AnalyzeResult = lazy(() => import("./Pages/AnalyzeResult"));
const ArchiveSurvey = lazy(() => import("./Pages/ArchivedSurvey"));
const EmailForm = lazy(() => import("./Pages/Email"));
const CustomerDatabase = lazy(() => import("./Pages/CustomerDatabase"));
const LotteryForm = lazy(() => import("./Pages/LotteryForm"));
const BusinessCategory = lazy(() => import("./Pages/BusinessCategory"));
const SubCategory = lazy(() => import("./Pages/SubCategory"));
const BusinessAttribute = lazy(() => import("./Pages/BusinessAttribute"));
const ChooseServey = lazy(() => import("./Pages/ChooseServey"));
const Surveytype = lazy(() => import("./Pages/Surveytype"));
const CreateSmileSurvey = lazy(() => import("./Pages/CreateSmileSurvey"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));
const EditProfile = lazy(() => import("./Pages/UpdateProfile"));
const BusinessSummary = lazy(() => import("./Pages/BusinessSummary"));
const ViewRating = lazy(() => import("./Pages/ViewRating"));
const AnalyzeSajaSurvey = lazy(() => import("./Pages/AnalyzeSajaSurvey"));
const NotFound = lazy(() => import("./Pages/Pagenotfound"));
const Header = lazy(() => import("./Dashboard/Header"));

const routeData = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <Forgot />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/view-survey/:id",
    element: <ViewSurvey />,
  },
  {
    path: "surveyPublish/:surveyid?",
    element: <PublisedSurvey />,
  },
  {
    path: "surveyPublish/:surveyid?/thankyou",
    element: <SajaskyThankYou />,
  },
  {
    path: "/view/:id?/Urdu",
    element: <SurveyReviewsUrdu />,
  },
  {
    path: "/view/:id?/Arabic",
    element: <SurveyReviewsArabic />,
  },
  {
    path: "/view/:id?/English",
    element: <SurveyReviews />,
  },
  {
    path: "/view/:id?/Hindi",
    element: <SurveyReviewsHindi />,
  },
  {
    path: "/view/:id?/Turkey",
    element: <SurveyReviewsTurkey />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "survey", element: <Survey /> },
      { path: "saja-sky-survey", element: <SajaSkySurvey /> },
      { path: "new-survey/:surveyid?", element: <CreateSurvey /> },
      { path: "manage-survey", element: <ManageServey /> },
      { path: "analyze-result", element: <AnalyzeResult /> },
      { path: "archive-survey", element: <ArchiveSurvey /> },
      { path: "email", element: <EmailForm /> },
      { path: "customer-database", element: <CustomerDatabase /> },
      { path: "lottery", element: <LotteryForm /> },
      { path: "business-category", element: <BusinessCategory /> },
      { path: "business-sub-category", element: <SubCategory /> },
      { path: "business-attribute", element: <BusinessAttribute /> },
      { path: "choose-survey-type", element: <ChooseServey /> },
      { path: "survey-type", element: <Surveytype /> },
      { path: "create-survey", element: <CreateSmileSurvey /> },
      { path: "edit-survey-with-multibranch/:id", element: <CreateSmileSurvey /> },
      { path: "my-profile", element: <UserProfile /> },
      { path: "edit-Profile/:id", element: <EditProfile /> },
      // { path: "business-summary/:id", element: <BusinessSummary /> },
      { path: "view-ratings", element: <ViewRating /> },
      { path: "skyanalyze/:id?", element: <AnalyzeSajaSurvey /> },
    ],
  },
];

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="loader d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <img src={loader} alt="loader" style={{ width: "100px" }} />
      </div>
    );
  }

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Suspense
          fallback={
            <div
              className="loader d-flex align-items-center justify-content-center"
              style={{ height: "100vh" }}
            >
              <img src={loader} alt="loader" style={{ width: "100px" }} />
            </div>
          }
        >
          <Header />
          <Routes>
            {routeData.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children?.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
              </Route>
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
