import React, { useState } from 'react'
import "./rightbarlogic.css"
import Skiplogic from './Logicsmodalui/Skiplogic'
import Delayedbranching from './Logicsmodalui/Delayedbranching'
import Questiondisplaylogic from './Logicsmodalui/Questiondisplaylogic'
import Optionsdisplaylogic from './Logicsmodalui/Optionsdisplaylogic'
import Carryforwardlogic from './Logicsmodalui/Carryforwardlogic'


export default function RightbarLogic({setShowLogic}) {

    const [selectedLogic, setSelectedLogic] = useState("");

    return (
        <div className='p-0' style={{ cursor: "pointer" }}>
            <div className='d-flex justify-content-between'>
                <p className='fs-5 text-dark p-3 m-0 bg-light' >  Logic Settings  </p>
                <button type="button" className="btn-close text-reset m-2"  aria-label="Close" onClick={() =>{setShowLogic(false)}}></button>
            </div>

            <p className='fs-6 text-dark p-2 py-3 m-0 bg-white border-bottom'>  Create New Logic  </p>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Skip Logic") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "rgb(242, 242, 242)" }}>
                    SL
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Skip Logic  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Delayed Branching") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#ffeae9" }}>
                    BD
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Delayed Branching  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Question Display Logic") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#fcf4e8" }}>
                    DL
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Question Display Logic  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Options Display Logic") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#fcf4e8" }}>
                    DL
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Options Display Logic  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Carry Forward Logic") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#e9edff" }}>
                    CF
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Carry Forward Logic  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Embedded Data") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#effae7" }}>
                    ED
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Embeded Data  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Custom Logic") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#ffe1f0" }}>
                    CL
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Custom Logic  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Priority Logic") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#ffeae9" }}>
                    PL
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Priority Logic  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Auto Select Options") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#e4f7f5" }}>
                    AS
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Auto Select Options  </p>
            </div>

            <div className='p-2 py-2 m-0 bg-white border-bottom d-flex align-items-center gap-3'
                onClick={() => { setSelectedLogic("Conditional Validation") }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasBottom"
                aria-controls="offcanvasBottom">
                <div className='d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", background: "#e4f7f5" }}>
                    CV
                </div>
                <p className='fs-6 text-dark  p-0 m-0 '>  Conditional Validation </p>
            </div>


            {/* <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button> */}

            <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel" style={{ width: "90%", margin: "0 auto", height: "95%" }}>
                <div class="offcanvas-header  align-items-start">
                    <div className=''>
                        <h5 class="offcanvas-title" id="offcanvasBottomLabel">{selectedLogic}</h5>
                        <p className='p-0 m-0' s>On "Click to add question text"</p>
                    </div>


                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body small p-4" style={{ background: '#faf9fb', overflowY: "scroll" }}>

                    {selectedLogic === "Skip Logic" && <Skiplogic />}
                    {selectedLogic === "Delayed Branching" && <Delayedbranching />}
                    {selectedLogic === "Question Display Logic" && <Questiondisplaylogic />}
                    {selectedLogic === "Options Display Logic" && <Optionsdisplaylogic />}
                    {selectedLogic === "Carry Forward Logic" && <Carryforwardlogic />}
                </div>



                <div class="offcanvas-header  align-items-start w-100">
                    <div className=' d-flex justify-content-end gap-3 w-100'>
                        <button className='btn btn-secondary'>Reset</button>
                        <button className='btn btn-primary'>Apply</button>

                    </div>



                </div>
            </div>


        </div>
    )
}
