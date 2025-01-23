import React from 'react'
import { Link } from 'react-router-dom';

const Healthcare = () => {
    return (
        <div className="container">
            <div className="row" style={{ width: "60%", margin: 'auto' }}>
                <div className="text-center">
                    <div>
                        <button className="btn btn-primary">PKLI Survey Manage</button>
                    </div>

                    <div className='d-flex justify-content-between gap-3 mt-4'>
                        <Link to="/create-department" className='w-50'>
                            <div className="borders w-100" style={{ padding: "12px" }}>
                                <p className="m-0"><b className="fs-5">Department</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Create/View Department)</p>
                            </div>
                        </Link>
                        <Link to="/create-physician" className='w-50'>
                            <div className="borders w-100" style={{ padding: "12px" }}>
                                <p className="m-0"><b className="fs-5">Physician</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Create/View Physician)</p>
                            </div>
                        </Link>
                    </div>

                    <Link to="/Pkli-survey">
                        <div className="borders mt-3">
                            <p className="m-0"><b className="fs-5">New Survey</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Create Custom survey)</p>
                        </div>
                    </Link>

                    <Link to="/Pkli-manage-survey">
                        <div className="borders mt-3">
                            <p className="m-0"><b className="fs-5">My Surveys</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Manage - Edit, Copy, View Surveys)</p>
                        </div>
                    </Link>

                    <div className="borders mt-3">
                        <p className="m-0"><b className="fs-5">Archived Surveys</b></p><p className="m-0" style={{ fontSize: '14px' }}>(Manage - Archived Surveys)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Healthcare;