import React from "react";
import { Link } from "react-router-dom";

const ChooseServey = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="" style={{width: '60%', margin: "auto"}}>
                    <h4 className="text-center fs-2 fw-bold" style={{color: "#007bff"}}>Choose Survey</h4>
                    <div class="borders mt-3">
                        <Link to="/saja-sky-survey"><p className="m-0"><b className="fs-5 fw-bold">Saja Sky</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Do it yourself surveys)</p></Link>
                    </div>
                    <div class="borders mt-3">
                        <Link to="/survey-type"><p className="m-0"><b className="fs-5 fw-bold">Saja Smile</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Customer Satisfaction Surveys)</p></Link>
                    </div>
                    {/* <div class="borders mt-3">
                        <Link to="/pkli-survey-manage"><p className="m-0"><b className="fs-5 fw-bold">Healthcare Template</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Create a New Survey)</p></Link>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
export default ChooseServey;