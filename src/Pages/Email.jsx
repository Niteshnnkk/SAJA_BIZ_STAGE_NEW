import React, { useState } from 'react';

const EmailForm = () => {
    const [contactCount, setContactCount] = useState(0);

    const handleContactChange = (event) => {
        setContactCount(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Email sent successfully!');
    };

    return (
        <div className="container mb-5">
            <div className="form-container shadow p-5 rounded rounded-4 bg-white">
                <form onSubmit={handleSubmit}>
                    <div className='d-flex gap-3'>
                        <div className="mb-3 w-100">
                            <label htmlFor="selectContacts" className="form-label">Select Contacts</label>
                            <select className="form-select" id="selectContacts" onChange={handleContactChange}>
                                <option value="0" selected>Select Contacts</option>
                                <option value="1">Contact 1</option>
                            </select>
                        </div>
                        <div className="form-group w-100">
                            <label htmlFor="startDate" className="form-label">Start Date</label>
                            <input type="date" className="form-control" id="startDate" />
                        </div>
                        <div className="form-group w-100">
                            <label htmlFor="endDate" className="form-label">End Date</label>
                            <input type="date" className="form-control" id="endDate" />
                        </div>
                    </div>

                    <div class="col-md-12">
                        <p class="box">Count of Contacts Selected : <span id="counts_contact"></span></p>
                        <input type="hidden" value="0" id="counts_selected" />
                    </div>

                    <div className="mt-3">
                        <input type="text" className="form-control" id="emailSubject" placeholder="Email Subject" />
                    </div>
                    <div className="mt-3">
                        <textarea className="form-control" rows="4" placeholder="Email Message"></textarea>
                    </div>
                    <div className="d-grid mt-3" style={{width: "fit-content"}}>
                        <button type="submit" className="btn btn-primary px-3 p-2">Send Email</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailForm;
