import { Image, Space, Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";
import { DataSourceType, IMG_ROOT } from "@/services/data-source";
const { Text } = Typography;

type DatabaseItemProps = {
  item: DataSourceType;
  text?: TextProps;
}

const DatabaseItem: React.FC<DatabaseItemProps> = (props) => {
  return (
    <Space size={2}>
      <Image
        src={`${IMG_ROOT}/${props.item.type}.svg`}
        preview={false}
        height={"1.5rem"}
      /> <Text {...props.text}>{props.item.name}</Text>
    </Space>
  )
};

export default DatabaseItem;
