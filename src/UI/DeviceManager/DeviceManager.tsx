// import { fetchLoggedDevices } from "@/app/utils/helpers.util";
// import { signOut } from "next-auth/react"; // Assuming you're using NextAuth for authentication
// import { useState, useEffect } from "react";
// import DevicePopup from "../DevicePopup/DevicePopup";

// function DeviceManager({ email }: { email: string }) {
//     const [devices, setDevices] = useState<any[]>([]);
//     const [showPopup, setShowPopup] = useState(false);

//     useEffect(() => {
//         async function checkDevices() {
//             const loggedDevices = await fetchLoggedDevices(email);
//             if (loggedDevices.length > 3) {
//                 setDevices(loggedDevices);
//                 setShowPopup(true);
//             }
//             return loggedDevices;
//         }
//         checkDevices();
//     }, [email]);

//     const handleLogoutDevices = async (deviceIds: string[]) => {
//         try {
//             const response = await fetch("/api/user/logout-devices", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ deviceIds }),
//             });

//             if (!response.ok) {
//                 const error = await response.json();
//                 console.error("Error logging out devices:", error.message);
//                 return;
//             }

//             console.log("Devices logged out successfully");
//             setShowPopup(false);
//         } catch (error) {
//             console.error("Error logging out devices:", error);
//         }
//     };

//     const handleCancel = () => {
//         setShowPopup(false);
//         signOut(); // Trigger sign-out if the user cancels or closes the popup
//     };

//     return (
//         <>
//             {showPopup && (
//                 // <DevicePopup
//                 //     devices={devices}
//                 //     onLogout={handleLogoutDevices}
//                 //     onCancel={handleCancel}
//                 // />
//             )}
//         </>
//     );
// }

// export default DeviceManager;
