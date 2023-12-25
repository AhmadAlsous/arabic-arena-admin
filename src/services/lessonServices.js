export const fetchLessons = async () => {
  console.log('fetching lessons');
  const response = await fetch('https://arabicarena.azurewebsites.net/lessons');
  if (!response.ok) {
    console.log(response);
    throw new Error();
  }
  return await response.json();
};
