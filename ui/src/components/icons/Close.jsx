export default function Close({ className = "", onClick = () => { } }) {
  return (
    <svg
      className={className}
      onClick={onClick}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.6 5.04004L16 14.64L6.40004 5.04004L5.04004 6.40004L14.64 16L5.04004 25.6L6.40004 26.96L16 17.36L25.6 26.96L26.96 25.6L17.36 16L26.96 6.40004L25.6 5.04004Z"
        className="fill-black dark:fill-white"
      />
    </svg>
  );
}
