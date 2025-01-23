import React, { useState } from "react";
import { Form } from "react-bootstrap";

export default function EditableText({ text, onUpdate, placeholder }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    onUpdate(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      toggleEdit();
    }
  };

  return isEditing ? (
    <Form.Control
      type="text"
      value={text}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={toggleEdit}
      onKeyDown={handleKeyDown}
      autoFocus
      className="h6 border-0 border-bottom  rounded-0 mb-3 p-2"
    />
  ) : (
    <h6
      onClick={toggleEdit}
      className="cursor-pointer mb-3 text-primary"
      style={{ minHeight: "1.5em" }}
    >
      {text || placeholder}
    </h6>
  );
}
