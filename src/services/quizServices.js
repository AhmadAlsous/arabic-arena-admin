import { BACKEND_URL } from 'src/config/constants';

export const fetchQuizzes = async () => {
  const response = await fetch(`${BACKEND_URL}/quizzes`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const addQuiz = async (quiz) => {
  const response = await fetch(`${BACKEND_URL}/quizzes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quiz),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const fetchQuiz = async (titleEnglish) => {
  if (!titleEnglish) return null;
  const response = await fetch(`${BACKEND_URL}/quizzes/${titleEnglish}`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const updateQuiz = async (quiz) => {
  const response = await fetch(`${BACKEND_URL}/quizzes/${quiz.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quiz),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const deleteQuiz = async (id) => {
  const response = await fetch(`${BACKEND_URL}/quizzes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
};

export const getQuizCount = async () => {
  const response = await fetch(`${BACKEND_URL}/quizzes/count`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};
