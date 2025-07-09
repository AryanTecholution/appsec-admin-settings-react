import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminNavTabs from "../AdminNavTabs/AdminNavTabs";
import AdminUserTab from "../AdminUserTab/AdminUserTab";
import AdminRoleTab from "../AdminRoleTab/AdminRoleTab";
import AdminPermissionTab from "../AdminPermissionTab/AdminPermissionTab";
import AdminOperationTab from "../AdminOperationTab/AdminOperationTab";
import AdminAppTab from "../AdminAppTab/AdminAppTab";
import AdminEnvironmentTab from "../AdminEnvironmentTab/AdminEnvironmentTab";

const options = [
  "users",
  "permissions",
  "roles",
  "apps",
  "environments",
  "operations",
];

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();

  const [selectedOption, setSelectedOption] = useState<string>(tab ?? "users");

  useEffect(() => {
    if (tab) {
      if (options.includes(tab)) {
        setSelectedOption(tab);
      } else {
        navigate("/admin-settings/users", { replace: true });
        setSelectedOption("users");
      }
    }
  }, [tab, navigate]);

  const handleOptionToggle = (value: string) => {
    const option = value.toLowerCase();
    navigate(`/admin-settings/${option}`);
    setSelectedOption(option);
  };

  const renderTabContent = () => {
    switch (selectedOption) {
      case "users":
        return <AdminUserTab />;
      case "roles":
        return <AdminRoleTab />;
      case "permissions":
        return <AdminPermissionTab />;
      case "apps":
        return <AdminAppTab />;
      case "environments":
        return <AdminEnvironmentTab />;
      case "operations":
        return <AdminOperationTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-1 w-full h-full flex flex-col gap-5">
      <h2 className="font-medium text-xl text-[#0088A4] border-b-2 border-gray-100 pb-2 ">
        Admin Settings
      </h2>
      <div className="flex w-[84rem] h-[3rem] justify-between items-center">
        <AdminNavTabs
          handleOptionToggle={handleOptionToggle}
          selectedOption={selectedOption}
        />
      </div>
      {renderTabContent()}
    </div>
  );
};

export default AdminSettings;
