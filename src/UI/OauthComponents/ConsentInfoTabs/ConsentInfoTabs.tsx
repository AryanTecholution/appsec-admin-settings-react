import Image from "next/image";
import React from "react";
import DefaultAppIcon from "@/public/DefaultApp.svg";
import RightArrowIcon from "@/public/RightNavArrow.svg";

interface Props {
    Icon?: any;
    Heading: string | null;
    Subheading: string | null;
}

function ConsentInfoTabs({ Icon, Heading, Subheading }: Props) {
    return (
        <div className="flex  cursor-pointer ">
            {Icon ? (
                <div className="w-[2.95rem] h-[2.5rem] rounded-[100%] bg-[#EBF1F2] flex justify-center items-center">
                    <Image src={Icon} alt="App Icon"></Image>
                </div>
            ) : (
                <div className="w-[2.95rem] h-[2.5rem] rounded-[100%] bg-[#EBF1F2]">
                    {/* <Image src={DefaultAppIcon} alt="App Icon"></Image> */}
                </div>
            )}
            <div className="flex flex-col justify-start items-start px-6 w-[38rem]  ">
                <p className="text-[0.875rem] font-bold text-[#062329]">
                    {Heading}
                </p>
                <p className="text-[0.675rem]">{Subheading}</p>
            </div>
        </div>
    );
}

export default ConsentInfoTabs;
