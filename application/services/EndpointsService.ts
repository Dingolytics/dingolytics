import { axios } from "@/services/axios";

type IdType = {
  readonly id: number | string;
}

export type EndpointType = {
  readonly id?: number;
  key?: string;
  url: string;
  name: string;
  tags: string[];
  description?: string;
  parameters?: any;
  query_id?: number;
  query_text?: string;
}

export default {
  query: (): Promise<EndpointType[]> =>
    axios.get("api/endpoints"),
  get: ({ id }: IdType): Promise<EndpointType> =>
    axios.get(`api/endpoints/${id}`),
  create: (data: EndpointType): Promise<EndpointType> =>
    axios.post("api/endpoints", data),
  save: (data: EndpointType): Promise<EndpointType> =>
    axios.post(`api/endpoints/${data.id}`, data),
  delete: ({ id }: IdType): Promise<IdType> =>
    axios.delete(`api/endpoints/${id}`),
};
