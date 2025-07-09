import React from "react";
import EditIcon from "@/public/EditIcon.svg";
import Image from "next/image";

type Props = {};

interface DropdownProps {
    name: string;
    value: string
    label: string;
    required?: boolean;
    placeholder: string;
    handleChangeEvent: (value: string) => void;
}

const OauthInput: React.FC<DropdownProps> = ({
    name,
    value,
    placeholder,
    label,
    required,
    handleChangeEvent,
}) => {
    return (
        <div>
            <label
                className="block text-[0.9rem] font-[500] text-[#3C8B98] mb-2"
                htmlFor="dropdown"
            >
                {label}
                {required ? (
                    <span className="text-[0.9rem] font-[500] text-[#BA1414]">
                        *
                    </span>
                ) : null}
            </label>
            <div className="w-[25.5rem] h-[2.675rem] rounded-[0.5rem] border border-[#D8DADC] flex">
                <input
                    name={name}
                    value={value}
                    type="text"
                    className="p-[0.725rem] w-[22.25rem] h-[2.5rem] outline-[none] border-1 rounded-tl-[0.5rem] rounded-bl-[0.5rem]
                    border-l-0 border-b-0 border-t-0 border-r-1 border-[#D8DADC] bg-white"
                    onChange={(event:any) => handleChangeEvent(event)}
                />
                <div className="rounded-tr-[0.5rem] rounded-br-[0.5rem] cursor-pointer w-[3.65rem] flex justify-center items-center">
                    <Image src={EditIcon} alt="Edit"></Image>
                </div>
            </div>
        </div>
    );
};

export default OauthInput;
