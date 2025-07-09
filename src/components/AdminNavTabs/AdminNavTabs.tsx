import React from "react";
import { Users, Shield, Settings, Layers, Globe, Zap } from "lucide-react";

interface Props {
  selectedOption: string | undefined;
  handleOptionToggle: (option: string) => void;
}

const options = [
  { option: "Users", count: 3, icon: Users },
  { option: "Roles", count: 3, icon: Shield },
  { option: "Permissions", count: 3, icon: Settings },
  { option: "Apps", count: 3, icon: Layers },
  { option: "Environments", count: 3, icon: Globe },
  { option: "Operations", count: 3, icon: Zap },
];

const AdminNavTabs: React.FC<Props> = ({
  handleOptionToggle,
  selectedOption,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 rounded-3xl ">
      <div className="w-full px-6 ">
        <div className="flex items-center justify-between">
          <div className="flex space-x-0 overflow-x-auto">
            {options.map(({ option, count, icon: Icon }, idx) => {
              const isSelected = selectedOption === option.toLowerCase();
              return (
                <div
                  key={idx}
                  className={`
                    relative group cursor-pointer transition-all duration-500 ease-out transform
                    ${
                      isSelected
                        ? "bg-gradient-to-b from-[#512CED]/5 to-white shadow-sm"
                        : "hover:bg-gray-50 hover:shadow-sm"
                    }
                  `}
                  onClick={() => handleOptionToggle(option)}
                >
                  <div
                    className={`
                    px-6 py-4 flex items-center space-x-3 border-b-2 transition-all duration-500 ease-out transform
                    ${
                      isSelected
                        ? "border-[#512CED] text-[#512CED] scale-105"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:scale-102"
                    }
                  `}
                  >
                    <Icon
                      size={18}
                      className={`
                        transition-all duration-500 ease-out transform
                        ${
                          isSelected
                            ? "text-[#512CED] scale-110 rotate-3"
                            : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105"
                        }
                      `}
                    />
                    <span
                      className={`
                      text-sm font-semibold tracking-wide transition-all duration-500 ease-out whitespace-nowrap transform
                      ${
                        isSelected
                          ? "text-[#512CED] scale-105"
                          : "text-gray-700 group-hover:text-gray-900 group-hover:scale-102"
                      }
                    `}
                    >
                      {option}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#512CED] to-[#6B46C1] shadow-sm animate-pulse transition-all duration-500"></div>
                  )}

                  {/* Hover effect */}
                  <div
                    className={`
                    absolute inset-0 bg-gradient-to-r from-[#512CED]/0 to-[#512CED]/0 opacity-0 transition-all duration-500 ease-out pointer-events-none
                    ${
                      !isSelected
                        ? "group-hover:from-[#512CED]/3 group-hover:to-[#512CED]/3 group-hover:opacity-100"
                        : ""
                    }
                  `}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavTabs;
