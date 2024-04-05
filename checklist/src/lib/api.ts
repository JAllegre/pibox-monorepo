import { GetChecklistResponse } from "../../../common/checklistTypes";
import { fetchData } from "../../../common/clientApi";

const baseApiUrl = `${import.meta.env.VITE_API_HOST}/api/checklist`;

export async function getChecklist(): Promise<GetChecklistResponse> {
  return fetchData(baseApiUrl);
}