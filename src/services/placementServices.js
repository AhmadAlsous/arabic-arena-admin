import { BACKEND_URL } from 'src/config/constants';

export const fetchPlacementTest = async () => {
  const response = await fetch(`${BACKEND_URL}/placement/1`);
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};

export const updatePlacementTest = async (placementTest) => {
  const response = await fetch(`${BACKEND_URL}/placement/1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(placementTest),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};
