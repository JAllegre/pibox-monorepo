function checkResponse(response: Response) {
  if (!response.ok) {
    console.log("api.ts/checkResponse | Bad response", response);
    throw new Error(response.statusText);
  }
  return response.json();
}

export async function fetchData(url: string) {
  const response = await fetch(url);
  return checkResponse(response);
}

export async function postData<T>(url: string, data: T, method = "POST") {
  const response = await fetch(url, {
    method: method,
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return checkResponse(response);
}
