import React from 'react'
import { Link } from 'react-router-dom';

const SajaSkyServey = () => {
    return (
        <div className="container mt-4">
            <div className="row" style={{ width: "60%", margin: 'auto' }}>
                <div className="text-center">
                    <button className="btn btn-primary">Saja Sky Survey</button>
                    <Link to="/survey">
                        <div className="borders mt-3">
                            <p className="m-0"><b className="fs-5">New Survey</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Create Custom survey)</p>
                        </div>
                    </Link>
                    <div className="borders mt-3">
                        <p className="m-0"><b className="fs-5">My Surveys</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Manage - Edit, Copy, View Surveys)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SajaSkyServey;