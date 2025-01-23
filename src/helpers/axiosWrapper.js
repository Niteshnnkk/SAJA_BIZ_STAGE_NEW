import axios from "axios";
import Config from "../config/config";
import { getDecodedToken } from "./authFunctions";
// console.log(getDecodedToken())
const { baseUrl } = Config;

export const axiosWrapper = {
  post,
  get,
  deleteMethod,
  putMethod,
};

const user = getDecodedToken();
function formatCurrentDate() {
  const date = new Date();

  // Extract date components
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the final string
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
}

async function post(endpoint, payload, headers = false) {
  let userSession = ``;
  console.log("userSession------", userSession);
  if (endpoint.includes("?")) {
    userSession = `&userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  } else {
    userSession = `?userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  }
  console.log("post method called----------", {
    method: "POST",
    endpoint,
    payload,
  });
  let Head;

  if (headers === true) {
    Head = {
      "Content-Type": "text/plain", // or 'application/json' based on API requirements
    };
  } else {
    Head = {
      "Content-Type": "application/json", // or 'application/ json' based on API requirements
    };
  }

  try {
    const { data } = await axios({
      method: "POST",
      url: `${baseUrl}/${endpoint}${userSession}`,
      // url: `${}${endpoint}`,
      headers: Head,
      data: payload,
    });
    console.log("data-----", data);
    return data;
  } catch (err) {
    console.log("Server error----->", err);
    return {
      isError: true,
      error: err,
    };
  }
}

async function get(endpoint) {
  let userSession = ``;
  console.log("userSession------", userSession);
  if (endpoint.includes("?")) {
    userSession = `&userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  } else {
    userSession = `?userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  }
  console.log("get method called----------", {
    method: "GET",
    endpoint,
  });

  try {
    const { data } = await axios({
      method: "GET",
      url: `${baseUrl}/${endpoint}${userSession}`,
      // url: `${endpoint}`,
      headers: {
        // "Authorization": token,
        "access-control-allow-origin": "*",
      },
    });
    console.log("data-----", data);
    return data;
  } catch (err) {
    console.log("Server error----->", err);
    return {
      isError: true,
      error: err,
    };
  }
}

async function putMethod(endpoint, payload) {
  let userSession = ``;
  console.log("userSession------", userSession);
  if (endpoint.includes("?")) {
    userSession = `&userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  } else {
    userSession = `?userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  }
  console.log("delete method called----------", {
    method: "PUT",
    endpoint,
  });

  try {
    const { data } = await axios({
      method: "PUT",
      url: `${baseUrl}/${endpoint}${userSession}`,
      // url: `${endpoint}`,
      headers: {
        // "Authorization": token,
        "access-control-allow-origin": "*",
      },
      data: payload,
    });
    console.log("data-----", data);
    return data;
  } catch (err) {
    console.log("Server error----->", err);
    return {
      isError: true,
      error: err,
    };
  }
}

async function deleteMethod(endpoint) {
  let userSession = ``;
  console.log("userSession------", userSession);
  if (endpoint.includes("?")) {
    userSession = `&userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  } else {
    userSession = `?userId=${
      user.userId
    }&lastActivityTime=${formatCurrentDate()}`;
  }
  console.log("delete method called----------", {
    method: "Delete",
    endpoint,
  });

  try {
    const { data } = await axios({
      method: "Delete",
      url: `${baseUrl}/${endpoint}${userSession}`,
      // url: `${endpoint}`,
      headers: {
        // "Authorization": token,
        "access-control-allow-origin": "*",
      },
    });
    console.log("data-----", data);
    return data;
  } catch (err) {
    console.log("Server error----->", err);
    return {
      isError: true,
      error: err,
    };
  }
}
