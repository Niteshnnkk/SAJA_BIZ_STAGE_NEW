export const questionFactories = {
  ChoiceQuestion: (type) => ({
    id: Date.now(),
    type: type,
    options: type === "dropdown" ? ["Select an option", "Option 1", "Option 2"] : ["Option 1", "Option 2", "Option 3"],
    questionText: "",
  }),

  TextboxQuestion: (type) => ({
    id: Date.now(),
    type: type,
    questionText: "",
  }),

  NPSQuestion: (type) => ({
    id: Date.now(),
    type: type,
    questionText: "",
    minRating: 0,
    maxRating: 10,
  }),

  MatrixQuestion: (type) => ({
    id: Date.now(),
    type: type,
    rows: [{ text: "Row 1" }],
    columns: [{ text: "Column 1" }],
    questionText: "",
  }),
};
