"use client";
export const dynamic = "force-dynamic";

import { usePathname, useRouter } from "next/navigation";
import AppLogo from "../../../public/appseclogo.svg";
import LaunchIcon from "@mui/icons-material/Launch";
import Tooltip from "@mui/material/Tooltip";
import SignoutModal from "./Signout";
import { signOut } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import { RiSecurePaymentFill } from "react-icons/ri";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAppToRedux } from "@/app/redux/slices/setAppSlice";
import { convertTimestampToDate, getInitials } from "@/app/utils/helpers.util";
import AdminSettings from "@/app/admin-settings/AdminSettings/AdminSettings";
import SessionValidator from "../SessionValidator/SessionValidator";
import { isAfter } from "date-fns";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

import { fetchUser } from "@/app/redux/slices/userSlice";
import { useAppDispatch } from "@/app/redux/store";
interface UserState {
  data: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}
const Navbar = () => {
  const router = useRouter();
  const { data: user, status } = useSelector((state: any) => state.user);
  const initialState = useSelector(
    (state: any) => state.setAppSlice.selectedApp
  );
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [apps, setApps] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [selectedApp, setSelectedApp] = useState(initialState || "");
  const [selectedAppName, setSelectedAppName] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isPersonDropdownOpen, setPersonDropdownOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | any>(null);
  const [selectedUserTimestamp, setSelectedUserTimestamp] = useState<
    number | null
  >(null);
  // useEffect(() => {
  //     console.log("Navbar reloaded");
  // }, []);

  const handleProfileClick = () => {
    // Handle profile click action
    setPersonDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    // Handle settings click action
    setPersonDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
    setPersonDropdownOpen(false);
  };

  // Close the "Select Application" dropdown when the "Person Outline" dropdown opens
  const handlePersonDropdownToggle = () => {
    setPersonDropdownOpen(!isPersonDropdownOpen);
    setDropdownOpen(false);
  };

  const handleAppSelect = (appId: any) => {
    setSelectedApp(appId.hosted_url);
    setSelectedAppName(appId.name);
    setDropdownOpen(false);
  };

  const handleLaunchSelectedApp = (selectedApp: any) => {
    const newWindow = window.open(selectedApp, "_blank");

    // You can optionally focus on the new window
    if (newWindow) {
      newWindow.focus();
    }
  };

  useEffect(() => {
    const storedObject = JSON.parse(
      localStorage.getItem("nextauth.message") || "{}"
    );

    const initialTimestamp = storedObject.timestamp
      ? storedObject.timestamp
      : undefined;

    setSelectedUserTimestamp(initialTimestamp);
  });

  useEffect(() => {
    if (user) {
      const storedObject = JSON.parse(
        localStorage.getItem("nextauth.message") || "{}"
      );
      const initialTimestamp = storedObject.timestamp
        ? storedObject.timestamp
        : undefined;
      setSelectedUserTimestamp(initialTimestamp);
    }
  }, [user]);
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
      // console.log("Fecthcing User");

      //setLoadingState(false);
    } else {
      console.log("Redux user :", user);

      setSelectedUsername(user.firstname + " " + user.lastname);
      setRole(user?.role);
      const roles = user.role || [];
      let appObjects: any[] = [];
      roles.forEach((role: any) => {
        role.permissions.forEach((permission: any) => {
          appObjects = [...appObjects, ...permission?.app?.environments];
        });
      });

      const uniqueAppNames = new Set();
      const uniqueApps = appObjects.filter((app) => {
        if (!uniqueAppNames.has(app.name)) {
          uniqueAppNames.add(app.name);
          return true;
        }
        return false;
      });

      const nonAppsecObjects = uniqueApps.filter(
        (app) => !app.name.includes("AppSecAuth")
      );
      setApps(nonAppsecObjects);
      setSelectedApp(user.default_app);
      setLoadingState(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isDropdownOpen || isPersonDropdownOpen) {
        const navbarRef = dropdownRef.current;

        // Check if the click is outside the "Select Application" dropdown
        if (
          !isPersonDropdownOpen ||
          (navbarRef &&
            !(event.target as HTMLElement)?.classList?.contains("select-app"))
        ) {
          setDropdownOpen(false);
        }

        // Check if the click is outside the "Person Outline" dropdown
        if (
          !isDropdownOpen ||
          (navbarRef &&
            !(event.target as HTMLElement)?.classList?.contains(
              "person-dropdown"
            ))
        ) {
          setPersonDropdownOpen(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen, isPersonDropdownOpen]);

  const fetchApps = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/user/me`
      );
      const user = await response.json();
      if (user) {
        setLoadingState(false);
      }
      setSelectedUsername(user?.firstname + " " + user?.lastname);
      setRole(user?.role);

      const roles = user?.role || [];

      let appObjects: any[] = [];

      roles?.forEach((role: any) => {
        role?.permissions.forEach((permission: any) => {
          appObjects = [...appObjects, ...permission.app.environments];
        });
      });

      // Create a Set to store unique app names
      const uniqueAppNames = new Set();

      // Filter out duplicate app names and store them in uniqueApps array
      const uniqueApps = appObjects?.filter((app: any) => {
        if (!uniqueAppNames.has(app.name)) {
          uniqueAppNames.add(app.name);
          return true;
        }
        return false;
      });

      const nonAppsecObjects = uniqueApps?.filter(
        (app: any) => !app.name.includes("AppSecAuth")
      );

      setApps(nonAppsecObjects);
      setSelectedApp(user?.default_app);
    } catch (e) {
      await signOut();
    }
  };

  // useEffect(() => {
  //     //console.log("apps fetched are: ", apps);
  // }, [apps]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: true },
    { name: "Apps", href: "/apps", current: false },
    { name: "Users", href: "/users", current: false },
  ];

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handleSignout = () => {
    setOpen(true);
  };
  const handleAdminSettings = () => {
    router.push(`/admin-settings/users`);
  };
  const handleOauthSettings = () => {
    router.push(`/oauth-settings/apps`);
  };

  const userNavigation = [
    {
      name: "Your Profile",
      action: () => {
        router.push("/profile-settings");
      },
      hasAccess: true,
      icon: <PermIdentityOutlinedIcon />,
    },
    {
      name: "Admin Settings",
      action: handleAdminSettings,
      hasAccess: Boolean(
        role?.filter((r: any) => {
          return r?.name === "AppSecAuth_Admin";
        }).length
      ),
      icon: <AdminPanelSettingsIcon />,
    },
    {
      name: "OAuth Settings",
      action: handleOauthSettings,
      hasAccess: Boolean(
        role?.filter((r: any) => {
          return r.name === "AppSecAuth_Admin";
        }).length
      ),
      icon: <RiSecurePaymentFill className="text-[1.5rem]" />,
    },
    {
      name: "Sign Out",
      action: handleSignout,
      hasAccess: true,
      icon: <LogoutIcon />,
    },
  ];

  // useEffect(() => {
  //     fetchApps();
  // }, []);

  useEffect(() => {
    saveToRedux();
  }, [selectedApp]);

  const saveToRedux = () => {
    dispatch(setSelectedAppToRedux(selectedApp));
  };

  const { data: session } = useSession({ required: true });

  return (
    <>
      <LoadingScreen open={loadingState} />
      {/* <SessionValidator /> */}
      <SignoutModal open={open} setOpen={setOpen} />
      <div
        ref={dropdownRef}
        className="fixed  h-[5.375em]  w-full box-border py-5 top-0 left-0 z-10 "
      >
        <div
          className="absolute px-5 top-0 left-0 w-full h-full flex justify-between items-center"
          style={{
            borderRadius: "0px",
            background: "#fff",
            boxShadow: "0px 4px 15px 0px rgba(157, 157, 157, 0.2)",
            zIndex: 200,
          }}
        >
          <Image
            alt="AppLogo"
            style={{
              width: "11.5rem",
              height: "1.75rem",
              cursor: "pointer",
            }}
            src={AppLogo}
            onClick={() => {
              router.push(`/dashboard`);
              setSelectedApp("");
              setSelectedAppName("");
            }}
          ></Image>

          <div className=" relative h-full gap-8 px-5 flex items-center text-[#000]">
            {/* <SearchIcon
                            className="cursor-pointer"
                            style={{ transform: "scale(1.5)" }}
                        />
                        <NotificationsNoneIcon
                            className="cursor-pointer"
                            style={{ transform: "scale(1.5)" }}
                        /> */}

            {pathname === "/dashboard" && (
              <div className=" overflow-hidden w-[10rem] h-[3vh] ">
                <Tooltip title="Open in new window" arrow>
                  <LaunchIcon
                    className="cursor-pointer rounded-lg border-solid border-gray-100 border-1"
                    sx={{
                      height: "1.1em",
                      width: "1.1em",

                      transition: "transform .5s",
                      "&:hover": {
                        transform: "scale(0.9)",
                      },
                    }}
                    onClick={() => handleLaunchSelectedApp(selectedApp)}
                  />
                </Tooltip>
                <span className="pl-2">Open in new tab</span>
              </div>
            )}

            {pathname === "/dashboard" && (
              <div className="relative">
                <div
                  className="w-[17.5em] h-[2.25em] px-4 text-xl text-center flex items-center justify-between cursor-pointer"
                  style={{
                    borderRadius: "0.5rem",
                    background: "#FBFBFB",
                    boxShadow: "0px 8px 24px 0px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleDropdownToggle}
                >
                  <p className="text-base">
                    {selectedAppName ? selectedAppName : "Select Application"}
                  </p>
                  {isDropdownOpen ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </div>

                {isDropdownOpen && (
                  <List
                    className="w-[22em] h-[49vh] px-[1rem] "
                    style={{
                      overflow: "auto",
                      position: "absolute",
                      top: "3.2em",
                      opacity: "1",
                      color: "#000",
                      borderRadius: "0.5rem",
                      background: "#FBFBFB",
                      boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.2)",
                    }}
                    component="nav"
                    aria-label="secondary mailbox folder"
                  >
                    {!apps && (
                      <ListItemButton key={0} disabled>
                        <ListItemText primary="No apps" />
                      </ListItemButton>
                    )}
                    {apps &&
                      apps?.map((app: any, index: any) => (
                        <ListItemButton
                          key={index}
                          selected={selectedAppName === app.name}
                          onClick={() => handleAppSelect(app)}
                        >
                          <ListItemText primary={app.name} />
                        </ListItemButton>
                      ))}
                    {apps.length === 0 && (
                      <ListItemButton key={1}>
                        <ListItemText
                          className="flex justify-center items-center"
                          primary="No Application Assigned"
                        />
                      </ListItemButton>
                    )}
                  </List>
                )}
              </div>
            )}

            <div className="flex flex-col items-end">
              <div
                className="flex items-center align-middle"
                onClick={handlePersonDropdownToggle}
              >
                {/* <PersonOutlineIcon
                                    className="cursor-pointer"
                                    style={{ transform: "scale(1.5)" }}
                                /> */}
                {selectedUsername && (
                  <Tooltip
                    title={`Last Login at ${convertTimestampToDate(
                      selectedUserTimestamp || 0
                    )}`}
                    arrow
                  >
                    <Avatar
                      sx={{
                        background:
                          "linear-gradient(0deg, #585E94 10%, #767EC6 100%)",
                        padding: "0",
                        fontSize: "1em",
                        height: "3em",
                        width: "3em",
                        transition: "transform .5s",
                        transform: isPersonDropdownOpen ? "scale(0.9)" : "none",
                        boxShadow: isPersonDropdownOpen
                          ? "0px 4px 14px 0px rgba(0, 0, 0, 0.2)"
                          : "0px 4px 10px rgba(0, 0, 0, 0.5)",
                        "&:hover": {
                          transform: "scale(0.9)",
                        },
                        cursor: "pointer",
                      }}
                    >
                      {selectedUsername !== null ? (
                        <>{getInitials(selectedUsername)}</>
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                  </Tooltip>
                )}
                {isPersonDropdownOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </div>
              {isPersonDropdownOpen && (
                <List
                  className="w-[12em] "
                  style={{
                    position: "absolute",
                    top: "4.5em",
                    opacity: "1",
                    color: "#000",
                    borderRadius: "0.5rem",
                    background: "#FBFBFB",
                    boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  component="nav"
                  aria-label="person-outline-dropdown"
                >
                  {userNavigation?.map(
                    (option, index) =>
                      option.hasAccess && (
                        <ListItemButton
                          onClick={option.action}
                          key={index * 10}
                        >
                          <span className="mr-4 text-[1.5rem]">
                            {option.icon}
                          </span>
                          <ListItemText primary={option.name} />
                        </ListItemButton>
                      )
                  )}
                </List>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
