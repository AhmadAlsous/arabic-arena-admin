import { BACKEND_URL } from 'src/config/constants';

export const validate = async (admin) => {
  const response = await fetch(BACKEND_URL + '/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(admin),
  });

  if (!response.ok) {
    throw new Error();
  }

  return await response.json();
};
