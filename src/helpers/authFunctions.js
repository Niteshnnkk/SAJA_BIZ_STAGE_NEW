export const getDecodedToken = () => {
    const rawToken = localStorage.getItem("us_st_d");
    // console.log(rawToken)
    const decodedToken = JSON.parse(rawToken);
    return decodedToken
  }