import React, { useState } from 'react'
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { addTemplate } from '../redux/entities/formBuilderEntity';
// import { useAppDispatch } from '../redux/hooks';

export default function Surveytype() {
    // const [newFormData, setNewFormData] = useState({
    //     formName: ''
    // });
    // const navigate = useNavigate();
    // const dispatch = useAppDispatch();

    // async function onClickHandler() {
    //     try {
    //         const template = await dispatch(addTemplate(newFormData)).unwrap();
    //         navigate(`/formbuilder/${template.id}`);
    //     } catch (ex) {
    //         console.log(ex)
    //     }
    // }

    return (
        <div style={{width: '78%', margin: "auto"}}>
            <div className="survey-type" id="content">
                <h3 className='text-center' style={{color: "#0066ff"}}>Surveys</h3>
                <div className="bt_border">
                    <Link to="/create-survey?type=customer-satisfaction-survey">Create a Customer Satisfaction Survey</Link>
                </div>
                <div className="bt_border">
                    <Link to="/create-survey?type=multi-branch-survey">A Master Customer Satisfaction Survey with Multiple Branches</Link>
                </div>
                <div className="bt_border">
                    <Link to="/create-survey?type=stand-alone-survey">A Stand Alone Customer Satisfaction Survey</Link>
                </div>
                {/* <div className="bt_border">
                    <Link>Custom Survey</Link>
                </div> */}
            </div>
        </div>
    )
}
