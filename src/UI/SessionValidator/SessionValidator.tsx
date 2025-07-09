"use client";

import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { getSessionByDeviceId, handleSignOut } from "@/app/utils/helpers.util";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const SessionValidator = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession({ required: true });

    // const userValidityExceedSignout = async () => {
    //     if (session) {
    //         const user = session?.user as any;
    //         console.log("Sessiom", session.user);

    //         const currentDate = new Date();
    //         const userValidityDate = user?.userValidity
    //             ? new Date(user?.userValidity)
    //             : null;
    //         console.log("Validity Date", userValidityDate);

    //         if (userValidityDate && userValidityDate < currentDate) {
    //             console.log("User validity has expired. Signing out.");
    //             handleSignOut("/NoAccess");
    //             return;
    //         }
    //     }
    // };

    const accessRevokedDeviceSignout = async () => {
        if (session) {
            try {
                const deviceStatus = await getSessionByDeviceId(
                    session?.deviceId as string
                );
                console.log("Device Status ", deviceStatus?.isActive);

                // Add logic to sign out if the device is revoked
                if (!deviceStatus?.isActive) {
                    console.log(
                        "Access revoked for this device. Signing out..."
                    );
                    router.push("/cross-signout");
                }
            } catch (error) {
                console.log("Logging Out");

                router.push("/cross-signout");

                console.error("Error fetching device status:", error);
            }
        }
    };

    useEffect(() => {
        // Check device status

        const checkCookieAvailability = async () => {
            // Check device status
            await accessRevokedDeviceSignout();
            const sessionCookie =
                document.cookie
                    .split(";")
                    .find((cookie) =>
                        cookie.trim().startsWith("next-auth.session-token=")
                    ) ||
                document.cookie
                    .split(";")
                    .find((cookie) =>
                        cookie
                            .trim()
                            .startsWith("__Secure-next-auth.session-token=")
                    );

            if (!sessionCookie) {
                console.log("Session cookie not available, signing out");
                await signOut();
            }
        };

        // Check cookie availability whenever pathname changes
        if (session) {
            checkCookieAvailability();
        }
        // userValidityExceedSignout();
    }, [pathname, session]);

    useEffect(() => {
        const checkSessionValidity = async () => {
            if (!session) {
                console.log("Session not present, signing out");
                await signOut();
                return;
            }

            // Check if session is expired
            if (new Date() > new Date(session.expires)) {
                console.log("Session expired, signing out");
                await signOut();
                return;
            }
        };

        if (status === "loading") {
            // Session data is still loading, return early
            return;
        }

        // Check session validity
        checkSessionValidity();

        // Periodically check session validity
        const interval = setInterval(() => {
            checkSessionValidity();
        }, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [session, status]);

    // useEffect(() => {
    //     const checkSessionValidity = async () => {
    //         if (!session) {
    //             console.log("Session not present, signing out");
    //             await signOut();
    //             return;
    //         }

    //         // Check if session is expired
    //         if (new Date() > new Date(session.expires)) {
    //             console.log("Session expired, signing out");
    //             await signOut();
    //             return;
    //         }

    //         // Check device status
    //         await accessRevokedDeviceSignout();
    //     };

    //     const checkCookieAvailability = async () => {
    //         const sessionCookie =
    //             document.cookie
    //                 .split(";")
    //                 .find((cookie) =>
    //                     cookie.trim().startsWith("next-auth.session-token=")
    //                 ) ||
    //             document.cookie
    //                 .split(";")
    //                 .find((cookie) =>
    //                     cookie
    //                         .trim()
    //                         .startsWith("__Secure-next-auth.session-token=")
    //                 );

    //         if (!sessionCookie) {
    //             console.log("Session cookie not available, signing out");
    //             await signOut();
    //         }
    //     };

    //     if (status === "loading") {
    //         // Session data is still loading
    //         return;
    //     }

    //     // Check session validity and cookies on mount
    //     checkSessionValidity();
    //     checkCookieAvailability();

    //     // Periodically check session validity and cookies
    //     const interval = setInterval(() => {
    //         checkSessionValidity();
    //         checkCookieAvailability();
    //     }, 10000);

    //     // Cleanup on component unmount
    //     return () => clearInterval(interval);
    // }, [pathname, session, status]);

    return <div>{<LoadingScreen open={status === "loading"} />}</div>;
};

export default SessionValidator;
