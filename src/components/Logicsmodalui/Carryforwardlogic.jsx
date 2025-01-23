import React from 'react'
import "../rightbarlogic.css"
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Carryforwardlogic() {
    return (
        <div className=' w-100 '>
            <div className="branching-container border shadow p-0 gap-0">
                <p className='p-3 fs-5 text-bold'>Carry Forward Choices</p>
                <div className=" px-3  py-1 ">

                    <div className='border p-3 branching-action bg-light flex-column align-items-start w-100'>
                        <div className='d-flex gap-3 w-100 align-items-center'>
                            <p className='fs-6 p-0 text-bold ' style={{ width: "10%" }}>From</p>
                            <select name="" id="" className='dropdown border w-75 p-2'>
                                <option value="">Search Question</option>
                                <option value="">Use Existing</option>
                            </select>
                        </div>

                        <div className='d-flex gap-3 w-100 align-items-center'>
                            <p className='fs-6 p-0 text-bold ' style={{ width: "10%" }}>Carry</p>
                            <select name="" id="" className='dropdown border w-75 p-2'>
                                <option value="">Select what you want to carry forward</option>
                                <option value="">Use Existing</option>
                            </select>
                        </div>

                        <div className='d-flex gap-3 w-100 align-items-center'>
                            <p className='fs-6 p-0 text-bold' style={{ width: "10%" }}>Including</p>
                            <select name="" id="" className='dropdown border w-75 p-2'>
                                <option value="">Select choice</option>
                                <option value="">Use Existing</option>
                            </select>
                        </div>
                    </div>


                    <div className='d-flex align-items-center gap-4 my-3'>
                        <p className='m-0 p-0'>Settings For Carried Choices:</p>

                        <div className='d-flex align-items-center gap-2'>
                            <input type="checkbox" />
                            <label htmlFor="">Carry Codes</label>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            <input type="checkbox" />
                            <label htmlFor="">Carry At Top</label>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            <input type="checkbox" />
                            <label htmlFor="">Carry As Plain Text</label>
                        </div>
                    </div>




                </div>



            </div>



        </div>
    )
}
