import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios";
import Config from "../config/config";

const DropdownButton = ({ onDelete, option, onOptionUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const baseUrl = Config.baseUrl;
  const [show, setShow] = useState(false);
  const [Mediashow, setMediaShow] = useState(false);
  const [imgURL, setimgURL] = useState("");
  const [stateAddTextVald, setstateAddTextVald] = useState({
    "enabled": option?.addTextVald?.enabled,
    "type": "text",
    "subType": "alphaText",
    "min": null,
    "max": null,
    "errMsg": "",
    "textLabel": "",
    "defCountry": null
  })
  const handleClose = () => { setShow(false) };
  const handleShow = (field, e) => {
    console.log("e.target.checked-----", e.target.checked);
    if (e.target.checked === true) {
      setShow(true);
    }

    onOptionUpdate(field, {
      "enabled": e.target.checked,
      "type": "text",
      "subType": "alphaText",
      "min": null,
      "max": null,
      "errMsg": "",
      "textLabel": "",
      "defCountry": null
    });
  };
  const handleMediaShow = () => setMediaShow(true);
  const handleMediaClose = () => setMediaShow(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleDelete = () => {
    onDelete();
    setShowMenu(false);
  };

  const handleSwitchChange = (field) => {
    console.log("field-----", field);
    // return
    onOptionUpdate(field, !option[field]);
  };

  const dropdownOptions = [
    { label: "Hide Option", field: "hidden", hasSwitch: true },
    { label: "Statement", field: "statement", hasSwitch: true },
    { label: "Additional Text", field: "addText", hasSwitch: true },
    // { label: "Additional Text Validation", field: "addTextVald", hasSwitch: true },
    { label: "Exclusive Option", field: "exclusive", hasSwitch: true },
    { label: "Mutually Exclusive", field: "mutualExclusive", hasSwitch: true },
    // { label: "Add Media", field: "addMedia", hasSwitch: false },
    { label: "Piping", field: "piping", hasSwitch: false },
  ];

  async function ImageHandler(event) {
    const file = event.target.files[0];
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)
    try {
      const { data } = await axios({
        url: `${baseUrl}/api/files/upload`,
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log("data-------", data);
      setimgURL(data)

      // setPreview(URL.createObjectURL(file));
      // toast.success("File uploaded successfully!");
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  function SaveImageHandler() {

    let allText = option.text + `${imgURL}`
    console.log("allText---->", allText)
    setMediaShow(false)
    onOptionUpdate("text", allText);
  }

  function addTextValdChangeHandler(e) {
    const { name, value } = e.target
    setstateAddTextVald(prev => {
      return { ...prev, [name]: value }
    })
  }

  function SaveAddValdHandler(e) {
    console.log(stateAddTextVald);
    onOptionUpdate("addTextVald", stateAddTextVald);
  }

  return (
    <div className="d-flex">
      <div onClick={toggleMenu} style={{ cursor: "pointer" }} title="Options">
        <BsThreeDotsVertical className="text-secondary" />
      </div>

      <img src="" alt="" />
      {showMenu && (
        <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg" style={{zIndex: "9999"}}>
          {dropdownOptions.map((dropdownOption, index) => (
            <div
              className="dropdown-item d-flex justify-content-between align-items-center gap-3"
              style={{ cursor: "pointer" }}
              key={index}
              onClick={() => dropdownOption.hasSwitch && handleSwitchChange(dropdownOption.field)}
            >
              <span>{dropdownOption.label}</span>
              {dropdownOption.hasSwitch && (
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={option[dropdownOption.field] || false}

                    readOnly
                  />
                </div>
              )}
            </div>
          ))}

          {option.addText && <>
            <hr className="m-0" />
            <div className="dropdown-item d-flex justify-content-between w-100" style={{ cursor: "pointer", fontSize: "16px" }} >


              <span>Additional Text</span>

              <div className="form-check form-switch" onClick={(e) => { handleShow("addTextVald", e) }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={option?.addTextVald?.enabled || false}

                  readOnly
                />
              </div>
            </div>
          </>}

          <hr className="m-0" />
          <div className="dropdown-item " style={{ cursor: "pointer", fontSize: "16px" }} onClick={() => { handleMediaShow() }}>

            Add Media
          </div>


          <div className="dropdown-item" onClick={handleDelete} style={{ cursor: "pointer", fontSize: "16px" }} >

            <hr className="m-0" />
            Remove Option
          </div>


          <Modal show={show}  centered className="" >
            <Modal.Header closeButton>
              <Modal.Title>Validation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form style={{maxHeight: "400px", overflowY: "scroll", scrollbarWidth: "thin"}}>
                <Form.Group>
                  <Form.Label>Input Type</Form.Label>
                  <div>
                    <Form.Check type="radio" label="Number" name="type" value="number"  onChange={addTextValdChangeHandler} />
                    <Form.Check type="radio" label="Text" name="type" value="text" defaultChecked onChange={addTextValdChangeHandler}/>
                    <Form.Check type="radio" label="Date" name="type" value="date" onChange={addTextValdChangeHandler}/>
                  </div>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Validation</Form.Label>
                  <div>
                    <Form.Check type="radio" label="Normal Text" name="validation" value="normalText" onChange={addTextValdChangeHandler}/>
                    <Form.Check type="radio" label="Email" name="validation" value="email" onChange={addTextValdChangeHandler}/>
                    <Form.Check type="radio" label="Only Text" name="validation" value="onlyText" defaultChecked onChange={addTextValdChangeHandler}/>
                  </div>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Custom Error Message</Form.Label>
                  <Form.Control type="text" name="errMsg"  onChange={addTextValdChangeHandler}/>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Text Label</Form.Label>
                  <Form.Control type="text" name="textLabel"  onChange={addTextValdChangeHandler}/>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Minimum</Form.Label>
                  <Form.Control type="number" name="min" onChange={addTextValdChangeHandler}  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Maximum</Form.Label>
                  <Form.Control type="number" name="max" onChange={addTextValdChangeHandler} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" onClick={SaveAddValdHandler}>Save</Button>
            </Modal.Footer>
          </Modal>


          {/* MEDIA MODAL */}
          <Modal show={Mediashow} centered className="custom-modal" >
            <Modal.Header closeButton>
              <Modal.Title>Add Media</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mt-3">
                  <Form.Label>Upload</Form.Label>
                  <Form.Control type="file" placeholder="Error in Validation" onChange={ImageHandler} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleMediaClose}>Cancel</Button>
              <Button variant="primary" disabled={imgURL === "" ? true : false} onClick={SaveImageHandler}>Save</Button>
            </Modal.Footer>
          </Modal>

        </div>
      )}
    </div>
  );
};

export default DropdownButton;
