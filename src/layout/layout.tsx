import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUser } from "../redux/slices/userSlice";
import { RootState, useAppDispatch } from "../redux/store";
import AdminNavTabs from "../components/AdminNavTabs/AdminNavTabs";
import LoadingScreen from "../UI/LoadingScreen/LoadingScreen";
import MetaTags from "../UI/MetaTags/MetaTags";

type Props = {
  children: ReactNode;
};

const options = [
  { name: "users", url: "/admin-settings/users" },
  { name: "permissions", url: "/admin-settings/permissions" },
  { name: "roles", url: "/admin-settings/roles" },
  { name: "apps", url: "/admin-settings/apps" },
  { name: "environments", url: "/admin-settings/environments" },
  { name: "operations", url: "/admin-settings/operations" },
];

const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { data: user, status } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const [adminRole, setAdminRole] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("users");

  useEffect(() => {
    setLoadingState(false);
    const activeOption = options.find((option) => option.url === pathname);
    if (activeOption) {
      setSelectedOption(activeOption.name);
    }
  }, [pathname]);

  const handleOptionToggle = (value: string) => {
    const option = value.toLowerCase();
    const activeOption = options.find((option) => option.url === pathname);
    if (option !== activeOption?.name) {
      setLoadingState(true);
    }
    navigate(`/admin-settings/${option}`);
    setSelectedOption(option);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (user) {
      const isAdmin = user.role?.some(
        (r: any) => r.name === "AppSecAuth_Admin"
      );
      if (!isAdmin) {
        navigate("/dashboard", { replace: true });
      } else {
        setAdminRole(true);
      }
    }
  }, [user, navigate]);

  return (
    <main>
      {user?.role && adminRole && (
        <div className="py-6 sm:px-6 lg:px-8 mt-[5.375rem]">
          <div className="p-1 w-full h-full flex flex-col gap-5">
            <h2 className="font-medium text-xl text-[#0088A4] border-b-2 border-gray-100 pb-2">
              Admin Settings
            </h2>
            <div className="flex w-[84rem] h-[3rem] justify-between items-center">
              <AdminNavTabs
                handleOptionToggle={handleOptionToggle}
                selectedOption={selectedOption}
              />
            </div>
            {loadingState ? (
              <LoadingScreen open={loadingState} overlayColor="transparent" />
            ) : (
              <>{children}</>
            )}
          </div>
        </div>
      )}
      <MetaTags />
    </main>
  );
};

export default Layout;
