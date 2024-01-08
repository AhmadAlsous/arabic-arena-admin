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

export const changePassword = async (admin) => {
  const response = await fetch(BACKEND_URL + '/admin/admin', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(admin),
  });

  if (!response.ok) {
    throw new Error();
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};
