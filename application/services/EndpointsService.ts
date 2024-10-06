import { axios } from "@/services/axios";

type IdType = {
  readonly id: number | string;
}

export type EndpointType = {
  readonly id?: number;
  key?: string;
  name: string;
  query_id?: number;
  query_params?: any;
}

export default {
  // query: (): Promise<EndpointType[]> =>
  //   axios.get("api/endpoints"),
  query: (): Promise<EndpointType[]> =>
    Promise.resolve([
      {
        id: 1,
        key: "abcdefg",
        name: "Dummy endpoint",
        query_id: 1,
        query_params: ["p_key"],
      },
      {
        id: 2,
        key: "yoyoyo",
        name: "Yoyo endpoint",
        query_id: 2,
        query_params: ["p_key"],
      }
    ]),
  // get: ({ id }: IdType): Promise<EndpointType> =>
  //   axios.get(`api/endpoints/${id}`),
  get: ({ id }: IdType): Promise<EndpointType> => Promise.resolve({
    id: 1,
    key: "abcdefg",
    name: "Dummy endpoint",
    query_id: 1,
    query_params: ["p_key"],
  }),
  create: (data: EndpointType): Promise<EndpointType> =>
    axios.post("api/endpoints", data),
  save: (data: EndpointType): Promise<EndpointType> =>
    axios.post(`api/endpoints/${data.id}`, data),
  delete: ({ id }: IdType): Promise<IdType> =>
    axios.delete(`api/endpoints/${id}`),
};
