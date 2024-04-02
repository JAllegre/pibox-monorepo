import { GetCheckListResponse } from "../types";

const API_PATH = "/api/checkList";

const baseApiUrl = `${import.meta.env.VITE_API_HOST}${API_PATH}`;

function checkResponse(response: Response) {
  if (!response.ok) {
    console.log("api.ts/checkResponse | Bad response", response);
    throw new Error(response.statusText);
  }
  return response.json();
}

// async function postData<T>(url: string, data: T, method = "POST") {
//   const response = await fetch(url, {
//     method: method,
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return checkResponse(response);
// }

async function fetchData(url: string) {
  const response = await fetch(url);
  return checkResponse(response);
}

export async function getCheckList(): Promise<GetCheckListResponse> {
  return fetchData(baseApiUrl);
}
