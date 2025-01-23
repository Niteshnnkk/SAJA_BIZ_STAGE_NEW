import React from 'react'
import "../rightbarlogic.css"


export default function Skiplogic() {
    return (
        <div className='border w-100  p-4'>
            <div className="branching-container">
                <div className="branching-condition">
                    <p>
                        If <span className="highlighted-text">Option 1</span> is selected,
                    </p>
                </div>
                <div className="branching-action">
                    <span>Then Skip To</span>
                    <select
                        className="dropdown"
                    // value={selectedOption}
                    // onChange={handleSelectChange}
                    >
                        <option value="No Branching">No Branching</option>
                        <option value="Question 2">Question 2</option>
                        <option value="Question 3">Question 3</option>
                    </select>
                </div>
            </div>
            <div className="branching-container">
                <div className="branching-condition">
                    <p>
                        If <span className="highlighted-text">Option 2</span> is selected,
                    </p>
                </div>
                <div className="branching-action">
                    <span>Then Skip To</span>
                    <select
                        className="dropdown"
                    // value={selectedOption}
                    // onChange={handleSelectChange}
                    >
                        <option value="No Branching">No Branching</option>
                        <option value="Question 2">Question 2</option>
                        <option value="Question 3">Question 3</option>
                    </select>
                </div>
            </div>
            <div className="branching-container">
                <div className="branching-condition">
                    <p>
                        If <span className="highlighted-text">Option 3</span> is selected,
                    </p>
                </div>
                <div className="branching-action">
                    <span>Then Skip To</span>
                    <select
                        className="dropdown"
                    // value={selectedOption}
                    // onChange={handleSelectChange}
                    >
                        <option value="No Branching">No Branching</option>
                        <option value="Question 2">Question 2</option>
                        <option value="Question 3">Question 3</option>
                    </select>
                </div>
            </div>

        </div>
    )
}
