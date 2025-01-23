import React from "react";

const InputField = ({ inputData, fieldName, inpuFieldHandler, inputFieldName }) => {
    return (
        <>
            {inputData.map((input, index) => {
                const value = inputFieldName?.find(
                    (field) => field.languageId === input.languageId
                )?.value || '';
                <p>{value}</p>
                return (
                    <div className="form-group w-100 mb-0" key={`${fieldName}-${input.languageId}`}>
                        <label className="fw-bold m-0" style={{ fontSize: "12px" }}>
                            {input.inputName} <span className="fw-bold text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name={fieldName}
                            onChange={(e) => inpuFieldHandler(e, input.languageId, fieldName)}
                            value={value}
                            className="form-control"
                            placeholder={`${fieldName} in ${input.inputName}`}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default InputField;
