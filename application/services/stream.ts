import { axios } from "@/services/axios";

type IdType = {
  readonly id: number;
}

export type StreamType = {
  readonly id?: number;
  name: string;
  db_table: string;
  db_table_preset?: string;
  data_source?: any;
  data_source_id?: number;
}

export const Stream = {
  query: (): Promise<StreamType[]> =>
    axios.get("api/streams"),
  get: ({ id }: IdType): Promise<StreamType> =>
    axios.get(`api/streams/${id}`),
  create: (data: StreamType): Promise<StreamType> =>
    axios.post("api/streams", data),
  save: (data: StreamType): Promise<StreamType> =>
    axios.post(`api/streams/${data.id}`, data),
  delete: ({ id }: IdType): Promise<IdType> =>
    axios.delete(`api/streams/${id}`),
};

export default Stream;
