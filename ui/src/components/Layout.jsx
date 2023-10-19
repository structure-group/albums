import { useEffect } from "react";
import Header from "./Header";
import { Outlet, useSearchParams, useNavigate } from "react-router-dom";
export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("landscape-note")) {
      navigate(`/album${searchParams.get("landscape-note")}`)
    }
  }, [location, navigate]);
  return (
    <div className="h-full w-full flex flex-col dark:bg-[#1E1E1E] bg-indigo-white">
      <Header />
      <Outlet />
    </div>
  );
}
