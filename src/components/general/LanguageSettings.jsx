import React from "react";
const LanguageSettings = () => {
    return (
        <div className="container">

            <div className="row">

              

                <div className="col-lg-12 bg-white rounded rounded-3 p-4">

                <div className='mb-4 bg-white rounded rounded-3'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4>Languages</h4>
                        {/* <button className='btn btn-secondary btn-sm' >Create New</button> */}
                    </div>

                    <hr className='p-0 m-0' />
                </div>  
                    <form className="col-lg-6">
                        <div className="form-group">
                            <label className="fw-bold">Primary Language</label>
                            <select className="form-select mt-3">
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Arabic</option>
                            </select>
                        </div>
                        <div className="form-group mt-4">
                            <label className="fw-bold">Screener Question Text</label>
                            <input type="text" className="form-control mt-3" placeholder="Which language do you prefer to take the survey in?" />
                        </div>
                        <div className="form-check form-switch mt-4">
                            <input className="form-check-input" type="checkbox" checked id="changeLanguage" />
                            <label className="form-check-label fw-bold" htmlFor="changeLanguage">
                                Change language within survey
                            </label>
                        </div>
                    </form>
                </div>

                <div className="col-lg-12 bg-white rounded rounded-3 p-4 mt-5">
                    <div className="d-flex justify-content-between">
                        <label className="fw-bold">All Languages</label>
                        <label className="fw-bold">+ Add Another Language</label>
                    </div>
                    <div className="" style={{ border: "1px solid #dddddf" }}>
                        <div className="d-flex justify-content-between p-2" style={{ background: "#eff1fb" }}>
                            <label className="fw-bold" style={{ fontSize: "14px" }}>LANGUAGES NAME</label>
                            <label className="fw-bold" style={{ fontSize: "14px" }}>ACTIONS</label>
                        </div>
                        <div className="d-flex justify-content-between p-2 align-items-center">
                            <div className="d-flex gap-2 align-items-center">
                                <span className="    fw-bold p-2" style={{ background: "#e7f4fb" }}>En</span>
                                <span className="fw-bold">English</span>
                            </div>
                            <div className="d-flex gap-3" style={{ marginRight: "120px" }}>
                                <label htmlFor="autoSelect">Auto Select</label>
                                <input className="form-check-input" type="checkbox" id="autoSelect" />
                                <label htmlFor="show">Show</label>
                                <input className="form-check-input" type="checkbox" id="show" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LanguageSettings;