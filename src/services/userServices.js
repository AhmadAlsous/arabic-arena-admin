import { BACKEND_URL } from 'src/config/constants';

export const fetchUsers = async () => {
  const response = await fetch(`${BACKEND_URL}/users`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const fetchFeedback = async () => {
  const response = await fetch(`${BACKEND_URL}/feedback`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const getFeedbackCount = async () => {
  const response = await fetch(`${BACKEND_URL}/feedback/count`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};
