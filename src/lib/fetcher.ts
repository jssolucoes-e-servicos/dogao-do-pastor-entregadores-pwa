export const fetcherGet = async (path: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`);
  if (!res.ok) {
    throw new Error('Falha ao buscar os dados.');
  }
  
  const result = await  res.json();
  console.log(result)
  return result;
};
