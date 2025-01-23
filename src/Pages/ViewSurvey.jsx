import React, { useEffect, useState } from 'react';
import logo from '../../src/assets/Images/logo.png'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/config';
import ManageSurvey from './Manageservey';

const ViewSurvey = () => {
    const { id } = useParams();
    const baseUrl = Config.baseUrl;
    const [data, setData] = useState([]);
    const [selectedValue, setSelectedValue] = useState([]);
    const [selectedLang, setSelectedLang] = useState();
    const [selectedLangText, setSelectedLangText] = useState();

    const getMultiLanguageSurvey = async () => {
        try {
            const { data } = await axios({
                url: `${baseUrl}/api/survey/multiLanguage/${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setData(data);
        } catch (error) {
            console.log("Error ::>>", error);
        }
    }

    const languageChangeHandler = (e) => {
        const selectedLang = e.target.value;
        console.log("selectedLang ::>>", selectedLang);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const engLanguage = data.filter((item) => item.languages === "English");
        console.log("engLanguage ::>>", engLanguage);
        const selectedText = selectedOption.text;
        setSelectedValue(selectedValue);
        setSelectedLang(selectedLang);
        setSelectedLangText(selectedText);
    }

    useEffect(() => {
        getMultiLanguageSurvey();
    }, [])

    return (
        <section className='bgImage'>
            <div className="container">
                <div className='row align-items-center' style={{ minHeight: "100vh" }}>
                    <div className='col-lg-5 m-auto cardPage p-5' style={{ boxShadow: "box-shadow: 0px 0px 10px #00000070" }}>
                        <div className='m-auto' style={{ width: "60px", height: "60px", border:"1px solid #ddd", borderRadius: "100px" }}>
                            <img className='w-100 h-100' src={data[0]?.bussLogoUrl || '/path/to/fallback-image.jpg'} />
                        </div>
                        <div className='text-center'>
                            <p className='m-0'>{data[0]?.businessName}</p>
                            <p className='m-0'>{data[0]?.businessSlogan}</p>
                        </div>
                        <hr />
                        <div className='form-group'>
                            <label className='fw-bold mb-1'>Choose Language</label>
                            <select className='form-select' onChange={languageChangeHandler} aria-label="Default select example">
                                <option selected disabled>--- Choose Langugae ---</option>
                                {data.map((item, index) => (
                                    <option key={index} value={item.surveyId}>{item?.languages}</option>
                                ))}
                            </select>
                        </div>
                        <Link to={`/view/${selectedLang}/${selectedLangText || ''}`}>
                            <button className="btn btn-primary px-3 p-2 mt-3 m-auto d-flex" disabled={!selectedLang || selectedLang.length === 0} style={{ width: "fit-content" }}>
                                Start Survey
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ViewSurvey;
