import React from 'react';
import feedback from '../../src/assets/Images/feedback.png';
import { QRCodeCanvas } from 'qrcode.react';
import Arbfeedback from '../../src/assets/Images/arabic.png'
import urduFeedback from '../../src/assets/Images/urdu.png'
import Turfeedback from '../../src/assets/Images/turkey.png'
import Hinfeedback from '../../src/assets/Images/feedbackHindi.png'

const FeedbackCardEng = ({ surveyData, downloadIndex }) => {
    let filterData = surveyData.length > 0 ? [surveyData[downloadIndex]] : []
    return (
        <div className="container" id='feedbackCard'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 p-4 bg-white'>
                    {Array.isArray(filterData) && filterData?.map((item, index) => {
                        let feedbackImage;
                        if (item.languages === 'English') {
                            feedbackImage = feedback;
                        } else if (item.languages === 'Arabic') {
                            feedbackImage = Arbfeedback;
                        } else if (item.languages === 'Urdu') {
                            feedbackImage = urduFeedback;
                        } else if (item.languages === 'Turkey') {
                            feedbackImage = Turfeedback;
                        } else if (item.languages === 'Hindi') {
                            feedbackImage = Hinfeedback;
                        } else {
                            feedbackImage = feedback;
                        }
                        return (
                            <div key={item.id}>
                                <div className='m-auto mb-4' style={{ width: "70px", height: "70px" }}>
                                    <img className='w-100 h-100 card' src={item?.bussLogoUrl} alt="Logo" style={{ borderRadius: "100px" }} />
                                </div>
                                <div className="card-body text-center">
                                    <div className="feedback-icons">
                                        <img className='w-100' src={feedbackImage} alt={`${item.language} Feedback`} />
                                    </div>

                                    <div className='d-flex inputData gap-4 mt-3 mb-3'>
                                        <input type="text" name="businessName" readOnly value={item?.businessName || ''} />
                                        <input type="text" name="branch" readOnly value={item?.branch || ''} />
                                        <input type="text" name="city" readOnly value={item?.cityName || ''} />
                                        <input type="text" name="countryId" readOnly value={item?.countryName || ''} />
                                    </div>

                                    <div className='sutisfiction mt-4 mb-4'>
                                        <p className='m-0' style={{ fontStyle: "italic" }}>{item?.custSatisfactionSurvey ? item?.custSatisfactionSurvey : "N/A"}</p>
                                    </div>

                                    <div>
                                        <div className='w-100' id={`qr-${item.surveyId}`}>
                                            <QRCodeCanvas style={{ width: "170px", height: "170px" }}
                                                value={`https://saja-biz.vercel.app/view/${item.surveyId}/${item?.languages}`}
                                                size={100}
                                                bgColor={"#ffffff"}
                                                fgColor={"#000000"}
                                                level={"Q"}
                                            />
                                        </div>
                                        <div className='mt-3'>
                                            <p className='m-0'>Please scan this QR code for a


                                                
                                            </p>
                                            
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <b className='text-dark'>Thank you!</b>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FeedbackCardEng;