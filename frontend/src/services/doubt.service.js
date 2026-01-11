import api from "./api";

export const createDoubt = async (formData) => {
  const res = await api.post("/api/doubts", formData);
  return res.data;
};

export const getDoubts = async () => {
  const res = await api.get("/api/doubts");
  return res.data;
};

export const toggleUpvote = async (id) => {
  const res = await api.put(`/api/doubts/${id}/upvote`);
  return res.data;
};

export const answerDoubt = async (id, formData) => {
  const res = await api.put(`/api/doubts/${id}/answer`, formData);
  return res.data;
};

export const updateDoubt = async (id, data) => {
  const res = await api.put(`/api/doubts/${id}`, data);
  return res.data;
};

export const deleteDoubt = async (id) => {
  const res = await api.delete(`/api/doubts/${id}`);
  return res.data;
};

export const editAnswer = async (id, answer) => {
  const res = await api.put(`/api/doubts/${id}/answer/edit`, { answer });
  return res.data;
};

export const deleteAnswer = async (id) => {
  const res = await api.delete(`/api/doubts/${id}/answer`);
  return res.data;
};
