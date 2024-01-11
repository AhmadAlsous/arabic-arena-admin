import { BACKEND_URL } from 'src/config/constants';

export const fetchLessons = async () => {
  const response = await fetch(`${BACKEND_URL}/lessons`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const addLesson = async (lesson) => {
  const response = await fetch(`${BACKEND_URL}/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lesson),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const fetchLesson = async (titleEnglish) => {
  if (!titleEnglish) return null;
  const response = await fetch(`${BACKEND_URL}/lessons/${titleEnglish}`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const updateLesson = async (lesson) => {
  const response = await fetch(`${BACKEND_URL}/lessons/${lesson.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lesson),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const deleteLesson = async (id) => {
  const response = await fetch(`${BACKEND_URL}/lessons/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const getLessonCount = async () => {
  const response = await fetch(`${BACKEND_URL}/lessons/count`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  const count = await response.json();
  let totalCount = 0;
  Object.keys(count).forEach((key) => {
    totalCount += count[key];
  });
  return totalCount;
};
