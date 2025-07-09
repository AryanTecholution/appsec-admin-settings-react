import Image from "next/image";
import React from "react";

interface Props {
    Icon: any;
}

const ConsentExpandableList: React.FC<Props> = ({ Icon }) => {
    return (
        <div className="w-full h-[2.675rem] flex justify-center">
            <Image alt="List Icon" src={Icon} className="h-[2.675rem]"></Image>
        </div>
    );
};

export default ConsentExpandableList;
