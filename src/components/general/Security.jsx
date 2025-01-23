import React from 'react'

export default function Security() {
  return (
    <div className='container'>

      <div className='bg-white p-2 rounded'>

        <div className='mb-4 container pt-3 bg-white rounded rounded-3'>
          <div className='d-flex justify-content-between align-items-center'>
            <h4>Security</h4>
            {/* <button className='btn btn-secondary btn-sm' >Create New</button> */}
          </div>

          <hr className='p-0 m-0' />
        </div>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="questionNumber" />
          <label className="form-check-label" htmlFor="questionNumber">
            Prevent Indexing
          </label>
          <p className='m-0'>Block search engines from including your survey in their search results.</p>
        </div>
      </div>
      <div className='bg-white p-2 rounded mt-3'>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="questionNumber" />
          <label className="form-check-label" htmlFor="questionNumber">
            Prevent Indexing
          </label>
          <p className='m-0'>Block search engines from including your survey in their search results.</p>
        </div>
      </div>
    </div>
  )
}
