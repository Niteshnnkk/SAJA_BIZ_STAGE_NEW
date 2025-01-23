import singleChoice from "../assets/logo/single_choice.svg";
import multi_choice from "../assets/logo/multi_choice.svg";
import drop_down from "../assets/logo/dropdown.svg";
import multi_select_dropdown from "../assets/logo/multi_select_dropdown.svg";
import single_text from "../assets/logo/single_text.svg";
import multi_text from "../assets/logo/multi_text.svg";
import long_text from "../assets/logo/long_text.svg";
import nps from "../assets/logo/nps.svg";
import multi_nps from "../assets/logo/multi_nps.svg";
import nps_pro from "../assets/logo/nps_pro.svg";
import matrix_rating from "../assets/logo/matrix_rating.svg";
import matrix_bipolar from "../assets/logo/matrix_bipolar.svg";
import matrix_dropdown from "../assets/logo/matrix_dropdown.svg";
import matrix_text from "../assets/logo/matrix_text.svg";

// Import other icons as needed

export const questionCategories = [
  {
    category: "Choice",
    types: [
      {
        type: "Single Choice",
        icon: singleChoice,
        component: "ChoiceQuestion",
      },
      {
        type: "Multiple Choice",
        icon: multi_choice,
        component: "ChoiceQuestion",
      },
      { type: "dropdown", icon: drop_down, component: "ChoiceQuestion" },
      {
        type: "Multi Select Dropdown",
        icon: multi_select_dropdown,
        component: "ChoiceQuestion",
      },
    ],
  },
  {
    category: "Textbox",
    types: [
      {
        type: "Single TextBox",
        icon: single_text,
        component: "TextboxQuestion",
      },
      {
        type: "Multiple TextBox",
        icon: multi_text,
        component: "TextboxQuestion",
      },
      { type: "long-text", icon: long_text, component: "TextboxQuestion" },
    ],
  },

  {
    category: "NPS",
    types: [
      {
        type: "nps",
        icon: nps,
        component: "NPSQuestion",
      },
      {
        type: "multi-nps",
        icon: multi_nps,
        component: "NPSQuestion",
      },
      {
        type: "Pro NPS",
        icon: nps_pro,
        component: "NPSQuestion",
      },
    ],
  },
  {
    category: "Matrix",
    types: [
      {
        type: "Rating Matrix",
        icon: matrix_rating,
        component: "MatrixQuestion",
      },
      {
        type: "Bipolar Matrix",
        icon: matrix_bipolar,
        component: "MatrixQuestion",
      },
      {
        type: "Dropdown Matrix",
        icon: matrix_dropdown,
        component: "MatrixQuestion",
      },
      {
        type: "Textbox Matrix",
        icon: matrix_text,
        component: "MatrixQuestion",
      },
    ],
  },
];
