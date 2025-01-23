// src/api/surveyApi.jsx
import axios from "axios";
import Config from "../config/config";

const {baseUrl} = Config;

export const surveyApi = {
  getSingleChoiceData: async (surveyId, quesType) => {
    try {
      const response = await axios.get(`${baseUrl}/sky/getSampleQData`, {
        params: {
          surveyType: quesType,
          surveyId: surveyId,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Single Choice data:", error);
      throw error;
    }
  },

  saveSurveyData: async (questionData) => {
    try {
      // console.log(
      //   "Data being sent to save SurveyData: ",
      //   JSON.stringify(questionData, null, 2)
      // );

      const response = await axios.post(
        `${baseUrl}/sky/saveSurveyData`,
        questionData
      );
      console.log("Survey data sent: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving survey data: ", error);
      if (error.response) {
        console.error("Error response: ", error.response.data);
        console.error("Response status: ", error.response.status);
      }
      throw error;
    }
  },

  //   updateQuestion: async (questionData) => {
  //     try {
  //       const response = await axios.put(
  //         `${baseUrl}/updateQuestion`,
  //         questionData
  //       );
  //       console.log("Question Updated :", response.data);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error updating question: ", error);
  //       throw error;
  //     }
  //   },
};

export const processSingleChoiceData = (data) => {
  const questionData = data.data.question;
  return {
    data: {
      question: {
        ...questionData,
        type: "Single Choice", // Add this if needed for frontend logic
      },
    },
  };
};
