import React from 'react'

export default function Footer() {
  return (
    <div style={{ borderTop: '1px solid rgb(191 187 187)', width: "100%", margin: "auto" }}>
      <div className='container d-flex mt-2'>
        <div className="row align-items-center">
          <div className="col-md-9 p-0">
            <p className="netPromoter">Net Promoter<sup>®</sup> and NPS<sup>®</sup> are registered trademarks of Bain &amp; Company, Inc., Satmetrix Systems, Inc., and Fred Reichheld. Net Promoter Score<sup>SM</sup> and Net Promoter System<sup>SM</sup> are service marks of Bain &amp; Company, Inc., Satmetrix Systems, Inc., and Fred Reichheld.</p>
          </div>
          <div className="col-md-3 text-end p-0">
            <p className="right_reserved m-0">© 2024. All rights reserved</p>
          </div>
        </div>
      </div>
      {/* <div className='bg-primary p-2'></div> */}
    </div>
  )
}
