import { has, map, isObject } from "@lodash";
import { axios } from "@/services/axios";
import { fetchDataFromJob } from "@/services/query-result";
import { StreamType } from "@/services/stream";

export const SCHEMA_NOT_SUPPORTED = 1;
export const SCHEMA_LOAD_ERROR = 2;
export const IMG_ROOT = "static/images/db-logos";

type ColumnType = object | string;

type IdType = {
  readonly id: number;
}

type DataSourceType = {
  readonly id?: number;
  name: string;
  type: string;
  options?: object;
  streams?: StreamType[];
}

type JobType = {
  readonly id: number;
  error?: string;
}

type SchemaType = {
  readonly name: string;
  job?: JobType;
  schema?: object;
}

const DataSource = {
  query: (): Promise<DataSourceType[]> =>
    axios.get("api/data_sources"),
  types: (): Promise<any[]> =>
    axios.get("api/data_sources/types"),
  get: ({ id }: IdType): Promise<DataSourceType> =>
    axios.get(`api/data_sources/${id}`),
  create: (data: DataSourceType): Promise<DataSourceType> =>
    axios.post("api/data_sources", data),
  save: (data: DataSourceType): Promise<DataSourceType> =>
    axios.post(`api/data_sources/${data.id}`, data),
  test: (data: DataSourceType) =>
    axios.post(`api/data_sources/${data.id}/test`),
  delete: ({ id }: IdType): Promise<IdType> =>
    axios.delete(`api/data_sources/${id}`),

  fetchSchema: (data: DataSourceType, refresh = false) => {
    let params = refresh ? {refresh: true} : {};

    const getSchema = (): Promise<SchemaType> =>
      axios.get(`api/data_sources/${data.id}/schema`, { params });

    const mapColumns = (columns: ColumnType[]) =>
      map(columns, column => (isObject(column) ? column : { name: column }));

    return getSchema()
      .then((data) => {
        if (has(data, "job")) {
          return fetchDataFromJob(data.job!.id).catch((error: any) =>
            error.code === SCHEMA_NOT_SUPPORTED ?
            [] :
            Promise.reject(new Error(data.job!.error))
          );
        }
        return has(data, "schema") ? data.schema : Promise.reject();
      })
      .then((tables) => map(
        tables, (table) => 
          ({ ...table, columns: mapColumns(table.columns) })
        ));
  },
};

const annotateWithStreams = (databases: DataSourceType[], streams: StreamType[]) => {
  for (const database of databases) {
    database.streams = streams.filter(
      stream => stream.data_source_id === database.id
    );
  }
}

export type { DataSourceType };

export { annotateWithStreams };

export default DataSource;
