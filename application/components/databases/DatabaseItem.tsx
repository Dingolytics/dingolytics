import { Image, Space, Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";
import { TitleProps } from "antd/lib/typography/Title";
import { DataSourceType, IMG_ROOT } from "@/services/data-source";
import { DatabaseOutlinedIcon } from "@/components/icons";

const { Text, Title } = Typography;

type DatabaseItemProps = {
  item: DataSourceType;
  text?: TextProps;
}

type DatabaseTitleItemProps = {
  item: DataSourceType;
  title?: TitleProps;
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

const DatabaseTitleItem: React.FC<DatabaseTitleItemProps> = (props) => {
  return (
    <Title {...props.title}>
      <Space size={6}>
        <DatabaseOutlinedIcon size={24} />
        <span style={{
          display: "inline-block",
          verticalAlign: "middle"
        }}>
          {props.item.name}
        </span>
      </Space>
    </Title>
  )
};

export { DatabaseTitleItem };

export default DatabaseItem;
