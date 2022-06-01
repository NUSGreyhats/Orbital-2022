import axios from "axios";
import { api_url } from "./constants";

export const get_notes = async () => {
  return axios.get(api_url + "notes").then(
    (response) => {
      return response.data;
    }
  ).catch((err) => {
    return [];
  });
};

export const get_note_content = async (id) => {
  return axios.get(api_url + "note/" + id).then(
    (response) => response.data,
  ).catch((err) => {
    return {
      title: "Note not found",
      body: "This note is not found.",
    };
  });
};

export const create_note = async (title, body, is_private) => {
  let data = {
    name: title,
    content: body,
  }
  if (is_private) {
    data.private = true;
  }
  return axios.post(api_url + "note/create", data)
}

export const login = async (username, password) => {
  let data = {
    username: username,
    password: password,
  }
  return axios.post(api_url + "login", data)
}

export const logout = async () =>{
  return axios.post(api_url + "logout")
}