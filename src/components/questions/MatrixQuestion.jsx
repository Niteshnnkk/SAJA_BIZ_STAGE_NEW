import React from "react";
import { Table, Form } from "react-bootstrap";
import EditableText from '../common/EditableText';

export function MatrixQuestion({ question, onUpdate }) {
  const renderMatrix = () => {
    switch (question.type) {
      case "Rating Matrix":
      case "Bipolar Matrix":
        return (
          <Table bordered>
            <thead>
              <tr>
                <th></th>
                {question.columns.map((column, index) => (
                  <th key={index}>{column.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.text}</td>
                  {question.columns.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Form.Check type="radio" name={`matrix-${question.id}-${rowIndex}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case "Dropdown Matrix":
        return (
          <Table bordered>
            <thead>
              <tr>
                <th></th>
                {question.columns.map((column, index) => (
                  <th key={index}>{column.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.text}</td>
                  {question.columns.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Form.Select>
                        <option>Select</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case "Textbox Matrix":
        return (
          <Table bordered>
            <thead>
              <tr>
                <th></th>
                {question.columns.map((column, index) => (
                  <th key={index}>{column.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.text}</td>
                  {question.columns.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Form.Control type="text" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-3">
      <EditableText
        text={question.questionText}
        onUpdate={(newText) => onUpdate(question.id, "questionText", newText)}
        placeholder="Click to add question text"
      />
      {renderMatrix()}
    </div>
  );
}
