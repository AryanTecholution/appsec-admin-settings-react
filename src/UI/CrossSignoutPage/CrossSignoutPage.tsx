"use client";
import { Backdrop, CircularProgress } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  removeDeviceHandler,
  updateGithubTokenInDatabase,
} from "@/app/utils/helpers.util";

const CrossSignoutPage = () => {
  const { data: session, status } = useSession();
  // console.log("Session2:", session, status);

  //const router = useRouter();
  // Extract the query parameters from the current URL
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || null;
  const signinOption = searchParams.get("signinOption") || null;
  const deviceIdFromParams = searchParams.get("deviceId") || null;
  // console.log("redirectUrl:::::::(cross)", redirectUrl);

  const signoutFunction = async () => {
    console.log("Session::::", session);

    if (session && session?.user?._id) {
      const deviceId =
        deviceIdFromParams || localStorage.getItem("deviceId") || "";
      const userId = session?.user?._id;
      console.log("Removing User Device :", deviceId);

      try {
        const response = await fetch("/api/user/remove-device", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, deviceId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Device removed:", data);
        } else {
          const errorData = await response.json();
          console.error("Error removing device:", errorData);
        }
        console.log("Device Removal:", response);
      } catch (error) {
        console.error("Error calling remove device API:", error);
      }

      // await updateGithubTokenInDatabase("");
      document.cookie =
        "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
    if (redirectUrl && signinOption) {
      await signOut({
        callbackUrl:
          process.env.REACT_APP_BASE_URL +
          "/signin?redirect_url=" +
          redirectUrl +
          "&signinOption=" +
          signinOption,
      });
    } else if (redirectUrl) {
      await signOut({
        callbackUrl:
          process.env.REACT_APP_BASE_URL +
          "/signin?redirect_url=" +
          redirectUrl,
      });
    } else {
      console.log("No redirect URL");
      await signOut({ callbackUrl: process.env.REACT_APP_BASE_URL });
    }
  };
  useEffect(() => {
    // If 'redirectUrl' is not null or undefined, proceed with sign out
    // Perform sign out with the extracted redirectUrl

    try {
      if (status !== "loading") {
        signoutFunction();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, [redirectUrl, status]);

  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,

        color: "#000",
      }}
    >
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <CircularProgress color="inherit" />
      </div>
    </Backdrop>
  );
};

export default CrossSignoutPage;
