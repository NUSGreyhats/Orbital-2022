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
