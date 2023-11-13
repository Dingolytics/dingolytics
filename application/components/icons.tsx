type OutlinedIconProps = {
  size?: number;
  color?: string;
}

const DatabaseOutlinedIcon = (props: OutlinedIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-database"
      width={props.size || 24} height={props.size || 24}
      viewBox="0 0 24 24"
      strokeWidth="2.5" stroke="currentcolor" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"></path>
      <path d="M4 6v6a8 3 0 0 0 16 0v-6"></path>
      <path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>
    </svg>
  );
}

export {
  DatabaseOutlinedIcon,
}