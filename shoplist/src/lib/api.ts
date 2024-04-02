import { GetCheckListResponse } from "../../../common/checkListTypes";
import { fetchData } from "../../../common/clientApi";

const baseApiUrl = `${import.meta.env.VITE_API_HOST}/api/checkList`;

export async function getCheckList(): Promise<GetCheckListResponse> {
  return fetchData(baseApiUrl);
}
