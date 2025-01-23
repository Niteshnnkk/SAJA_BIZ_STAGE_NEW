import React, { useState } from "react";
import { Trash } from "react-bootstrap-icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import logicIcon from '../assets/Images/logics-icon.svg'
import { IoEyeOutline } from "react-icons/io5";

export const withDeleteOption = (WrappedComponent) => {
  return function WithDeleteOption({ onDelete, ...props }) {
    const [showMenu, setShowMenu] = useState(false);
    const { showLogic, setShowLogic } = props
  
    const toggleMenu = () => {
      setShowMenu((prev) => !prev);
    };

    const handleDelete = () => {
      onDelete(props.question.id);
      setShowMenu(false);
    };

    return (
      <>
        {/* <div className="position-relative"> */}
        <div className="position-absolute " >
          <div className="dNone d-flex align-items-center" style={{ flexDirection: "row-reverse" }}>
            <div className="iconLogic" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom" onClick={toggleMenu}>
              <BsThreeDotsVertical />
            </div>
            <div className="iconLogic">
              <IoEyeOutline />
            </div>
            <div className="iconLogic" onClick={() => setShowLogic(!showLogic)}>
              <img src={logicIcon}  />
            </div>

          </div>
          {showMenu && (
            <div
              className="dropdown-menu show"
              style={{ position: "absolute", right: 0 }}
              onMouseLeave={() => { setShowMenu(false) }}
            >
              <div className="dropdown-item" onClick={handleDelete}>
                <Trash className="me-2" /> Delete Question
              </div>
            </div>
          )}
        </div>
        <WrappedComponent {...props} />

        {/* </div> */}
      </>
    );
  };
};
