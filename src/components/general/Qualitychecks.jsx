import React, { useState } from 'react'
import "../Settingscomp.css"

export default function Qualitychecks() {

  const [isVisible, setIsVisible] = useState(false);

  const shoData = (e) => {
    const checkValue = e.target.checked;
    setIsVisible(checkValue);
  }

  return (
    <div>

      <div className='container mb-4 bg-white rounded rounded-3'>
        <div className='d-flex  pt-4 justify-content-between align-items-center p-2'>
          <h4>Quality Checks</h4>
          {/* <button className='btn btn-secondary btn-sm' >Create New</button> */}
        </div>

        <hr className='p-0 m-0' />

        <ul className="nav nav-pills mt-4 mb-2 d-flex gap-4" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <p className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Home</p>
          </li>
          <li className="nav-item" role="presentation">
            <p className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</p>
          </li>
          <li className="nav-item" role="presentation">
            <p className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</p>
          </li>
        </ul>
      </div>

      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" style={{ borderLeft: "none !important" }}>
          <div className='bg-white p-2 rounded'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white mt-3 p-2 rounded'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
          <div className='bg-white p-2 rounded'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
          <div className='bg-white p-2 rounded'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white p-2 rounded mt-3'>
            <input type='checkbox' onChange={shoData} />
            <label className='text-dark fw-bold mx-1'>Duration</label>
            <p className='text-muted m-0 mx-3'>On enabling this check, the system will raise a flag if the total interview duration is not within the specified limit</p>
            {isVisible && (
              <div className='d-flex flex-column gap-3 mt-3 mx-3'>
                <div className='d-flex align-items-center'>
                  <div>
                    <input type='radio' />
                    <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <input type='number' className='form-control' style={{ width: "100px" }} />
                    <label className='text-dark'>Minus</label>
                  </div>
                </div>
                <div>
                  <input type='radio' />
                  <label className='text-dark mx-2'>Raise a flag if user take More Than</label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
