import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Settings } from "lucide-react";

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
    <div className="pt-2 px-4 w-full min-h-screen bg-gray-50">
      {/* Circuit board pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#512CED]/5 to-purple-100/20"></div>
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M100 100L300 100L300 200L500 200L500 300L700 300"
            stroke="#512CED"
            strokeWidth="2"
          />
          <path
            d="M200 0L200 150L400 150L400 250L600 250L600 400"
            stroke="#512CED"
            strokeWidth="2"
          />
          <path
            d="M0 250L150 250L150 350L350 350L350 450L550 450"
            stroke="#512CED"
            strokeWidth="2"
          />
          <path
            d="M800 50L800 180L1000 180L1000 280L1200 280"
            stroke="#512CED"
            strokeWidth="2"
          />
          <path
            d="M50 400L250 400L250 500L450 500L450 600L650 600"
            stroke="#512CED"
            strokeWidth="2"
          />
          <circle cx="300" cy="100" r="6" fill="#512CED" />
          <circle cx="500" cy="200" r="6" fill="#512CED" />
          <circle cx="200" cy="150" r="6" fill="#512CED" />
          <circle cx="400" cy="250" r="6" fill="#512CED" />
          <circle cx="150" cy="250" r="6" fill="#512CED" />
          <circle cx="350" cy="350" r="6" fill="#512CED" />
          <circle cx="800" cy="180" r="6" fill="#512CED" />
          <circle cx="1000" cy="180" r="6" fill="#512CED" />
          <circle cx="250" cy="400" r="6" fill="#512CED" />
          <circle cx="450" cy="500" r="6" fill="#512CED" />
        </svg>
      </div>

      <div className="relative z-10 w-full mx-auto flex flex-col gap-2">
        {/* Modern geometric header with hexagonal pattern */}
        <div className="relative overflow-hidden">
          {/* Hexagonal background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#512CED]/8 to-purple-400/10 rounded-2xl"></div>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 15l13 7.5v15L30 45l-13-7.5v-15L30 15z' stroke='%23512CED' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>

          {/* Angular geometric shapes */}
          <div className="absolute top-4 right-8 w-12 h-12 border-2 border-[#512CED]/30 transform rotate-45"></div>
          <div className="absolute bottom-6 right-16 w-8 h-8 bg-gradient-to-tr from-[#512CED]/20 to-purple-400/30 transform rotate-12"></div>
          <div className="absolute top-8 right-24 w-4 h-16 bg-gradient-to-b from-[#512CED]/25 to-transparent transform -rotate-12"></div>
          <div className="absolute bottom-8 left-8 w-16 h-2 bg-gradient-to-r from-[#512CED]/30 to-purple-300/40 transform rotate-6"></div>

          {/* Data visualization lines */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-8 bg-[#512CED]/40 rounded-full"></div>
              <div className="w-1 h-12 bg-[#512CED]/50 rounded-full"></div>
              <div className="w-1 h-6 bg-[#512CED]/30 rounded-full"></div>
              <div className="w-1 h-10 bg-[#512CED]/45 rounded-full"></div>
              <div className="w-1 h-4 bg-[#512CED]/35 rounded-full"></div>
            </div>
          </div>

          <div className="relative flex items-center px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Tech-inspired icon container */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#512CED]/15 rounded-xl blur-lg"></div>
                <div className="relative bg-gradient-to-br from-[#512CED] via-purple-600 to-purple-700 p-4 rounded-xl shadow-2xl border border-purple-400/30">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-xl"></div>
                  <Settings className="w-8 h-8 text-white relative z-10" />
                </div>
                {/* Connection lines */}
                <div className="absolute -right-2 top-1/2 w-8 h-px bg-gradient-to-r from-[#512CED]/50 to-transparent"></div>
                <div className="absolute -bottom-2 left-1/2 w-px h-8 bg-gradient-to-b from-[#512CED]/50 to-transparent"></div>
              </div>

              {/* Enhanced title section */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    Admin Settings
                  </h1>
                  {/* Digital-style indicators */}
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-1">
                      <div className="w-8 h-1 bg-gradient-to-r from-[#512CED] to-purple-400 rounded-full"></div>
                      <div className="w-6 h-1 bg-gradient-to-r from-purple-400 to-purple-300 rounded-full"></div>
                      <div className="w-4 h-1 bg-gradient-to-r from-purple-300 to-purple-200 rounded-full"></div>
                    </div>
                    <div className="w-2 h-2 bg-[#512CED] rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Modern accent design */}
                <div className="flex items-center space-x-3">
                  <div className="h-px w-12 bg-gradient-to-r from-[#512CED] to-purple-400"></div>
                  <div className="w-2 h-2 bg-[#512CED] transform rotate-45"></div>
                  <div className="h-px w-8 bg-gradient-to-r from-purple-400 to-purple-300"></div>
                  <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                  <div className="h-px w-4 bg-gradient-to-r from-purple-300 to-purple-200"></div>
                </div>

                <p className="text-gray-600 text-sm font-medium flex items-center space-x-2">
                  <span>System Configuration & Access Control</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Container with tech-inspired design */}
        <div className="relative bg-white rounded-2xl shadow-lg  border border-purple-200/50 overflow-hidden">
          {/* Tech pattern header */}
          {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#512CED] via-purple-500 to-purple-400"></div> */}
          <div className="relative bg-gradient-to-r from-gray-50/50 to-purple-50/30 p-1">
            <div className="bg-white rounded-xl shadow-inner">
              <AdminNavTabs
                handleOptionToggle={handleOptionToggle}
                selectedOption={selectedOption}
              />
            </div>
          </div>
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#512CED]/30 to-transparent"></div>
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
