import React from 'react';
import { IoMdArchive } from "react-icons/io";

const ArchiveSurvey = () => {
    return (
        <div className="container p-0 mb-5" >
            <div className='d-flex gap-2 align-items-center'>
                <div style={{ borderLeft: "3px solid #0066ff", height: "25px" }}></div>
                <h4 className='m-0' style={{ color: "#0066ff" }}>Archived Survey</h4>
            </div>
            <div className='rounded rounded-4 p-4 mt-3' style={{ boxShadow: "0 0 10px #0002" }}>
                <div className='mt-2'>
                    <table className="tableData table table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Business Name</th>
                                <th>Branch</th>
                                <th>City</th>
                                <th>Unarchive</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Eng Business</td>
                                <td>Eng Branch</td>
                                <td>Noida</td>
                                <td>
                                    <IoMdArchive className="text-dark iconSize" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ArchiveSurvey;