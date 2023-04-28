import { AxiosResponse } from "axios";
import { API_URL } from "../../../config";
import { fetchMethod } from "@/Api";

interface Todo {
  id:string;
  title: string;
  completion?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const apiService = {
  getAllTasks: async (data: any) => {
    try {
      const response = await fetchMethod({
        url: `${API_URL}/sorttodo`,
        data,
        method: "get",
      });
      return response as AxiosResponse<Todo[], any>;
    } catch (error) {
      console.log("Error in getAllTasks: api.js", error);
      throw error;
    }
  },
  addTask: async (data: any): Promise<AxiosResponse<any>> => {
    try {
      const response = await fetchMethod({
        url: `${API_URL}/addtodo`,
        data,
        method: "post",
      });
      return response;
    } catch (error) {
      console.log("Error in addTask: api.js", error);
      throw error;
    }
  },
  updateTask: async (data: any):Promise<AxiosResponse<any>> => {
    try {
      const response = await fetchMethod({
        url: `${API_URL}/checktodo`,
        data,
        method: "post",
      });
      return response;
    } catch (error) {
      console.log("Error in updateTask: api.js", error);
      throw error;
    }
  },
  searchTask: async (data: any): Promise<AxiosResponse<any>> => {
    try {
      const response = await fetchMethod({
        url: `${API_URL}/searchtodo`,
        data,
        method: "post",
      });
      return response
    } catch (error) {
      console.log("Error in searchTask: api.js", error);
      throw error;
    }
  },

  deleteAllTask: async (data: any): Promise<AxiosResponse<any>> => {
    try {
      const response = await fetchMethod({
        url: `${API_URL}/deletealltodo`,
        data,
        method: "post",
      });
      return response
    } catch (error) {
      console.log("Error in searchTask: api.js", error);
      throw error;
    }
  }
};

export default apiService;
