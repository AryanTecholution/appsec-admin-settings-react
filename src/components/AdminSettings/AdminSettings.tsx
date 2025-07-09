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
    <div className="pt-8 px-4 w-full min-h-screen bg-gray-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(81,44,237,0.02),_transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 w-full w-full mx-auto flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-3 px-4">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight ">
            Admin Settings
          </h1>
          <div className="h-0.5 w-16 bg-[#512CED] rounded-full"></div>
        </div>

        {/* Navigation Container */}
        <div className="bg-white rounded-3xl  shadow-sm  mt-4 border-2 border-purple-100">
          <AdminNavTabs
            handleOptionToggle={handleOptionToggle}
            selectedOption={selectedOption}
          />
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl border-y-[2rem] border-transparent shadow-sm overflow-hidden">
          <div className="p-2">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
