import React from 'react'
import "./advance.css"


export default function FieldForce() {
    return (
        <>
            <div className='d-flex flex-column gap-1 admain'>
                <div className='container px-5 pt-4 pb-4 bg-white rounded rounded-3'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4>FieldForce</h4>
                        <button className='btn btn-secondary btn-sm' >Create New</button>
                    </div>


                    <hr className='p-0 m-0' />
                </div>


                <div className='p-2   px-5' >

                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Type </th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>


                        </tbody>
                    </table>

                    <div className='d-flex justify-content-center p-5'>
                        <p>No FieldForce created yet</p>
                    </div>


                </div>
            </div>

        </>
    )
}
