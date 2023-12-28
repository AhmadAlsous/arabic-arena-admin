import { BACKEND_URL } from 'src/config/constants';

export const fetchWord = async (word) => {
  const response = await fetch(`${BACKEND_URL}/words/${word}`);
  if (!response.ok) {
    const errorText = await response.json();
    if (response.status === 404) {
      throw new Error(`NotFoundError: ${errorText}`);
    } else {
      throw new Error(`Error: status ${response.status}, ${errorText}`);
    }
  }
  return await response.json();
};

export const addWord = async (word) => {
  const response = await fetch(`${BACKEND_URL}/words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};
