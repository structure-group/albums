import AlbumsHeaderIcon from "./icons/AlbumsHeader";
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import useStorageState from "../state/storage";

export default function Header() {
  const { s3 } = useStorageState();
  const location = useLocation();
  const { credentials } = s3 ?? { credentials: { accessKeyId: "" } };
  return (
    <div className="text-sm bg-white dark:bg-[#1E1E1E] border-b-2 border-indigo-gray dark:border-[#131414] flex justify-between px-6 py-[12px] items-center font-semibold">
      <Link to="/">
        <div className="hidden lg:flex items-center space-x-2 cursor-pointer">
          <AlbumsHeaderIcon />
          <p>Albums</p>
        </div>
      </Link>
      <div className="flex space-x-[30px] items-center">
        <Link
          to="/"
          className={cn("p-2", {
            "text-[#666666]": location.pathname !== "/",
          })}
        >
          My Albums
        </Link>
        <Link
          to="/shared"
          className={cn("p-2", {
            "text-[#666666]": location.pathname !== "/shared",
          })}
        >
          Shared with Me
        </Link>
        <Link
          to="/new"
          className={cn("px-4 rounded-lg p-2", {
            "pointer-events-none bg-[#cccccc] text-[#999999]":
              !credentials?.accessKeyId,
            "text-white bg-indigo-black hover:brightness-110":
              credentials?.accessKeyId,
          })}
        >
          New Album
        </Link>
      </div>
    </div>
  );
}
