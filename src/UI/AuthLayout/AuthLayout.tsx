import Image from "next/image";
import React, { ReactNode } from "react";
import AppLogo from "../../../public/appseclogo.svg";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#D5E6E5] md:bg-white">
            <div className="h-screen bg-[#D5E6E5] w-full md:w-[33rem] p-8 hidden md:flex flex-col justify-between">
                <Image
                    className="flex justify-start"
                    src={AppLogo}
                    style={{ width: "11.5rem", height: "1.75rem" }}
                    alt="App Logo"
                />
                <p className="w-10/12 font-normal text-3xl text-black break-normal leading-[2.275rem]">
                    Elevate Efficiency with Our Identity Access Management Tool
                </p>
            </div>
            <div className="h-screen w-full relative">
                <div className="flex flex-col items-center justify-center min-h-[90vh] flex-grow  w-full relative z-[10]   ">
                    {children}
                </div>
                <div className="w-fit md:w-[25rem] text-xs text-[#898989] px-5 md:px-5 mt-12 md:mt-0 font-normal text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:bottom-4 z-[1] ">
                    <p className="md:hidden text-black text-base mb-6 text-center px-4">
                        Elevate Efficiency with Our Identity Access Management
                        Tool
                    </p>
                    Protected by reCAPTCHA and subject to the Auth-login{" "}
                    <span className="text-[var(--primary-color)] mr-1">
                        Privacy Policy
                    </span>
                    and{" "}
                    <span className="text-[var(--primary-color)] mr-1">
                        Terms of Service
                    </span>
                    .
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
