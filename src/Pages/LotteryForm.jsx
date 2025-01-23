import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';

const LotteryForm = () => {
    const [date, setDate] = useState(null);

  return (
    <div className="container mb-5">
      <div className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <select className="form-select" aria-label="Select Database">
              <option value="" disabled selected>
                Select Database
              </option>
              <option value="db1">Database 1</option>
              <option value="db2">Database 2</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              placeholder="Survey date to"
            />
          </div>

          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              placeholder="Survey date to"
            />
          </div>
        </div>

        <div className="text-center my-3">
          <span className="text-muted">OR</span>
        </div>

        <div className="row">
          <div className="col">
             <div className="card flex justify-content-center">
            <Calendar value={date} onChange={(e) => setDate(e.value)} />
        </div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-primary p-2 px-4" style={{borderRadius: "100px"}}>Run Lottery</button>
          <button className="btn btn-primary p-2 px-4" style={{borderRadius: "100px"}}>Re-run Lottery</button>
        </div>
      </div>
    </div>
  );
};

export default LotteryForm;
