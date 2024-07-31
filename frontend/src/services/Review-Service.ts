import axios from 'axios';

const API_URL = 'http://localhost:8081/api/reviews';

export const getReviews = async (page: number, limit: number) => {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data;
};

export const getReview = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createReview = async (title: string, content: string) => {
    await axios.post(API_URL, { title, content });
};

export const updateReview = async (id: string, title: string, content: string) => {
    await axios.put(`${API_URL}/${id}`, { title, content });
};

export const deleteReview = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const undoDeletedReview = async (id: string) => {
    await axios.get(`${API_URL}/undo-delete/${id}`);
};