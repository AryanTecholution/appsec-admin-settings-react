import Image from "next/image";
import React from "react";
import DefaultAppIcon from "@/public/DefaultApp.svg";
import RightArrowIcon from "@/public/RightNavArrow.svg";

interface Props {
    AppIcon?: any;
    AppName: string | null;
    handleAppClick: () => void;
}

function ThirdPartyAppTab({ AppIcon, AppName, handleAppClick }: Props) {
    return (
        <div className="flex  cursor-pointer" onClick={handleAppClick}>
            {AppIcon ? (
                <Image src={AppIcon} alt="App Icon"></Image>
            ) : (
                <Image src={DefaultAppIcon} alt="App Icon"></Image>
            )}
            <div className="flex justify-between items-center px-4 w-[38rem]  ">
                <p className="text-[0.875rem] font-[400] text-[#062329]">
                    {AppName}
                </p>
                <button>
                    <Image src={RightArrowIcon} alt="More"></Image>
                </button>
            </div>
        </div>
    );
}

export default ThirdPartyAppTab;
