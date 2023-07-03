import axios from 'axios';
import queryString from 'query-string';
import { ContentInterface, ContentGetQueryInterface } from 'interfaces/content';
import { GetQueryInterface } from '../../interfaces';

export const getContents = async (query?: ContentGetQueryInterface) => {
  const response = await axios.get(`/api/contents${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createContent = async (content: ContentInterface) => {
  const response = await axios.post('/api/contents', content);
  return response.data;
};

export const updateContentById = async (id: string, content: ContentInterface) => {
  const response = await axios.put(`/api/contents/${id}`, content);
  return response.data;
};

export const getContentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/contents/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteContentById = async (id: string) => {
  const response = await axios.delete(`/api/contents/${id}`);
  return response.data;
};
