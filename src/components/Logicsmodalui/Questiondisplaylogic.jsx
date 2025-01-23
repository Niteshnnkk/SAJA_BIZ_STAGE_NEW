import React from 'react'
import "../rightbarlogic.css"
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
export default function Questiondisplaylogic() {
    return (
        <div className=' w-100 '>
            <p className='fs-6 text-bold'>This question will be displayed if the below criteria is met</p>
            <div className="branching-container border shadow p-0 gap-0">

                <div className="branching-action bg-white flex-column align-items-start">
                    <div className='d-flex gap-3 w-100'>
                        <select name="" id="" className='dropdown border w-25'>
                            <option value="">Create Criteria</option>
                            <option value="">Use Existing</option>
                        </select>

                        <input type="text" placeholder='Criteria 1 v' className='dropdown border w-25' />


                    </div>


                    <div className='w-100 p-0 d-flex w-100 justify-content-between bg-white'>
                        <div className='d-flex gap-3 w-75'>

                            <span>If</span>

                            <select name="" id="" className='dropdown border w-25'>
                                <option value="">Questions</option>
                                <option value="">Count</option>
                                <option value="">Variable</option>
                                <option value="">Contact</option>
                            </select>
                            <select name="" id="" className='dropdown border w-50'>
                                <option value="">Select Question</option>
                                <option value="">Count</option>
                                <option value="">Variable</option>
                                <option value="">Contact</option>
                            </select>

                        </div>

                        
                        <div className='d-flex gap-3'>
                            <FaPlusCircle />
                            <FaMinusCircle />


                        </div>


                    </div>
                </div>


            </div>

           

        </div>
    )
}
