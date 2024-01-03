import { map } from "@lodash";
import { useState, useEffect, useRef } from "react";
import {
  Modal, Form, Input, Select, Typography, Button
} from "antd";
import type { FormInstance } from 'antd/es/form';
const { Paragraph, Text } = Typography;

import { autoTableName } from "@/lib/utils";
import DataSource from "@/services/data-source";
import Stream, { StreamType } from "@/services/stream";

import {
  CreateDialogProps, wrap as wrapDialog
} from "@/components/general/DialogWrapper";

// TODO: Load schema options from server
const TABLE_SCHEMA_OPTIONS = [
  { label: "Application Events", value: "app_events" },
  { label: "Metrics", value: "metrics" },
  { label: "Raw Logs", value: "raw_logs" },
]

const CreateStreamDialog: React.FC<CreateDialogProps> = ({ dialog }) => {
  const [form] = Form.useForm();
  const [data_source_options, setDataSourceOptions] = useState<any[]>([]);
  const [data_source_id, setDataSourceId] = useState<number>();
  const [name, setName] = useState("");
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
  
  const sumbitCreateStream = (data: StreamType) => {
    form.validateFields().then((values) => {
      Stream.create(data)
        .then((stream) => {
          dialog.close({success: true, data: stream});
        })
        .catch((error) => {
          dialog.close({success: false});
        });
    })
  };

  return (
    <Modal title="Create a New Data Stream" {...dialog.props}
      onOk={
        () => sumbitCreateStream({
          name, data_source_id, db_table, db_table_preset
        })
      }
    >
      <Paragraph>
        <Text strong>Stream</Text> represents a connection of data incoming
        from arbitrary source to a destination table.
      </Paragraph>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        scrollToFirstError={true}
      >
        <Form.Item label="Data source" required={true}>
          <Select
            showSearch
            placeholder="Search by name..."
            options={data_source_options}
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
