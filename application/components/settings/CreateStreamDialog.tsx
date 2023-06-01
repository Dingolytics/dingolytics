import { map, kebabCase } from "@lodash";
import { useState, useEffect } from "react";
import {
  Modal, Form, Input, Select, Typography
} from "antd";
import {
  CreateDialogProps, DialogProps,
  wrap as wrapDialog
} from "@/components/general/DialogWrapper";
import { autoTableName } from "@/lib/utils";
import DataSource from "@/services/data-source";

const { Paragraph, Text } = Typography;

// TODO: Load schema options from server
const TABLE_SCHEMA_OPTIONS = [
  { label: "Web Logs", value: "web_logs" },
  { label: "Application Events", value: "app_events" },
  // ...
]

const CreateStreamDialog: React.FC<CreateDialogProps> = ({ dialog }) => {
  const [dataSourceOptions, setDataSourceOptions] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [data_source_id, setDataSourceId] = useState("");
  const [db_table, setDbTable] = useState("");
  const [db_table_preset, setDbTablePreset] = useState("");

  // Load options for data sources
  useEffect(() => {
    DataSource.query().then((dataSources) => {
      let options = map(dataSources, (item) => {
        return {
          label: item.name,
          value: item.id
        }
      });
      setDataSourceOptions(options);
    });
  }, []);
  
  const sumbitCreateStream = (data: any) => {
    console.log("submitCreateStream", data);
    dialog.close(data);
  };

  return (
    <Modal title="Create a New Data Stream" {...dialog.props}
      onOk={
        () => sumbitCreateStream({
          data_source_id, name, db_table, db_table_preset
        })
      }
    >
      <Paragraph>
        <Text strong>Stream</Text> represents a connection of data incoming
        from arbitrary source to a destination table.
      </Paragraph>
      <Form
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item label="Data source" required={true}>
          <Select
            showSearch
            placeholder="Search by name..."
            options={dataSourceOptions}
            value={data_source_id}
            onChange={(value) => setDataSourceId(value)}
          />
        </Form.Item>
        <Form.Item label="Stream name" required={true}>
          <Input
            value={name}
            onChange={
              (event) => {
                const value = event.target.value;
                setName(value);
                setDbTable(autoTableName(value));
              }
            }
          />
        </Form.Item>
        <Form.Item label="Table name" required={true}>
          <Input value={db_table} disabled />
        </Form.Item>
        <Form.Item label="Schema preset" required={true}>
          <Select
            placeholder="Select pre-defined schema..."
            options={TABLE_SCHEMA_OPTIONS}
            value={db_table_preset}
            onChange={(value) => setDbTablePreset(value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// NOTE: see CreateGroupDialog

export default wrapDialog(CreateStreamDialog);
