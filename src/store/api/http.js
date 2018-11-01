import axios from 'axios'
/*************************************/

const baseURL = "https://api.kassa.ga/v1";

export const $http = axios.create({
  baseURL: baseURL,
  // withCredentials: true,
  // headers: {
  // //   Authorization: 'Bearer {token}'
  //   'Accept':'application/hal+json, application/json; q=0.5'
  // }
})