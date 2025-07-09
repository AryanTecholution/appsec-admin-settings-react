import React from "react";

interface Props {
  selectedOption: string | undefined;
  handleOptionToggle: (option: string) => void;
}

const options = [
  { option: "Users", count: 3 },
  { option: "Roles", count: 3 },
  { option: "Permissions", count: 3 },
  { option: "Apps", count: 3 },
  { option: "Environments", count: 3 },
  { option: "Operations", count: 3 },
];

const AdminNavTabs: React.FC<Props> = ({
  handleOptionToggle,
  selectedOption,
}) => {
  return (
    <div className="flex border-b-2 gap-10 pr-5">
      {options.map(({ option }, idx) => {
        const isSelected = selectedOption === option.toLowerCase();
        return (
          <div
            key={idx}
            className={`pb-2 text-sm cursor-pointer ${
              isSelected
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-900"
            }`}
            onClick={() => handleOptionToggle(option)}
          >
            {option}
            {/* <span className="ml-1">({count})</span> */}
          </div>
        );
      })}
    </div>
  );
};

export default AdminNavTabs;
