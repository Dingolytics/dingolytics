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

const RefreshIcon = (props: OutlinedIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-refresh"
      width={props.size || 24} height={props.size || 24}
      viewBox="0 0 24 24"
      stroke-width="2.5" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
  );
}

export {
  DatabaseOutlinedIcon,
  RefreshIcon,
}