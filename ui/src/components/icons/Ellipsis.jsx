export default function Ellipsis({ className = "", onClick }) {
  return (
    <svg
      onClick={onClick}
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_239_785)">
        <path
          d="M10.1194 13.8806C8.94874 13.8806 8 14.8294 8 16C8 17.1706 8.94875 18.1193 10.1194 18.1193C11.2906 18.1193 12.2394 17.1706 12.2394 16C12.2394 14.8294 11.29 13.8806 10.1194 13.8806ZM16 13.8806C14.8294 13.8806 13.8806 14.8294 13.8806 16C13.8806 17.1706 14.8294 18.1193 16 18.1193C17.1712 18.1193 18.12 17.1706 18.12 16C18.12 14.8294 17.1712 13.8806 16 13.8806ZM21.8806 13.8806C20.71 13.8806 19.7613 14.8294 19.7613 16C19.7613 17.1706 20.71 18.1193 21.8806 18.1193C23.0506 18.1193 24 17.1706 24 16C24 14.8294 23.0506 13.8806 21.8806 13.8806Z"
          className="fill-black dark:fill-white"
        />
      </g>
      <defs>
        <clipPath id="clip0_239_785">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
