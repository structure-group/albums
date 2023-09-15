import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import useStorageState from "../state/storage";

export default function Header() {
    const { s3 } = useStorageState();
    const location = useLocation();
    const credentials = s3.credentials;
    return <div className="bg-white border-b border-2 border-indigo-gray flex justify-between px-6 py-4 items-center font-semibold">
        <p>Albums</p>
        <div className="flex space-x-12 items-center">
            <Link to="/" className={cn({
                "text-[#666666]": location.pathname !== "/",
            })}>My Albums</Link>
            <Link to="/shared" className={cn({
                "text-[#666666]": location.pathname !== "/shared",
            })}>Shared with Me</Link>
            <Link to="/new" className={cn("px-4 rounded-lg p-2", {
                "pointer-events-none bg-[#cccccc] text-[#999999]": !credentials.accessKeyId,
                "text-white bg-[#333333]": credentials.accessKeyId
            })}>New Album</Link>
        </div>
    </div>
}