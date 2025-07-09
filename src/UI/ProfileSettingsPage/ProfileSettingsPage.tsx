"use client";
import React, { useEffect, useState } from "react";
import Tables from "../../components/Tables/Tables";
import { TableColumntype } from "../../components/Tables/types";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { Avatar, Button } from "@mui/material";
import { getInitials } from "@/app/utils/helpers.util";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const ProfileSettingsPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
    createdAt: "",
    invitedAt: "",
    email: "",
    fullName: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/user/me`
        );
        const userData = await response.json();
        setUser(userData);

        setCurrentUser({
          firstName: userData.firstname,
          lastName: userData.lastname,
          createdAt: userData.invitedAt,
          invitedAt: userData.invitedAt,
          role: userData.role.map((role: any) => role.name).join(","),
          email: userData.email,
          fullName: `${userData.firstname} ${userData.lastname}`,
        });

        let permissionRows: any[] = [];
        userData.role.map((role: any) => {
          const rolePermission = role.permissions.map((permission: any) => ({
            name: permission.name,
            application: permission.app.name,
            operation: permission?.operations
              ?.map((operation: any) => operation?.name)
              .join(", "),
            status: "ACTIVE",
            module: permission.modules.join(", "),
          }));
          permissionRows = [...permissionRows, ...rolePermission];
        });
        setRows(permissionRows);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const headCells: TableColumntype[] = [
    { id: "name", label: "Name", type: "text", colWidth: 2 },
    { id: "application", label: "Application", type: "text", colWidth: 2 },
    { id: "module", label: "Module", type: "text", colWidth: 5 },
    { id: "operation", label: "Operation", type: "text", colWidth: 2 },
    { id: "status", label: "Status", type: "status", colWidth: 1 },
  ];

  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );
    const resJson = await response.json();

    if (resJson.status === 200) {
      setToastType("success");
      setToastMessage(resJson.message);
      router.push("/cross-signout");
    } else {
      setToastType("error");
      setToastMessage(resJson.message);
    }
  };

  return (
    <div className="py-6 sm:px-6 lg:px-8 mt-[5.375rem]">
      <div className="p-1 w-full h-full flex flex-col gap-5">
        <h2 className="font-medium text-xl text-[#0088A4] border-b-2 border-gray-100 pb-2">
          Profile Settings
        </h2>
        {!user ? (
          <LoadingScreen open={loading} />
        ) : (
          <div>
            <div className="flex flex-col gap-5 my-5">
              <div className="flex flex-wrap gap-6">
                <div className="h-[10em] w-[10em] flex justify-center items-center">
                  <Avatar
                    sx={{
                      bgcolor: "#3C8B98",
                      padding: "0",
                      fontSize: "2.5em",
                      height: "3em",
                      width: "3em",
                      transition: "transform .5s",
                      "&:hover": {
                        transform: "scale(0.9)",
                      },
                    }}
                  >
                    {user?.firstname ? (
                      <>{getInitials(currentUser.fullName)}</>
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                </div>
                <div className="  flex-1 flex  gap-5 p-5 w-full  justify-between items-start  ">
                  <div className="  w-[80%] flex flex-col gap-5">
                    <div className="flex flex-wrap gap-5">
                      <div className="flex flex-col gap-2 w-[7em]">
                        <p className="text-[#727271] text-xs font-semibold">
                          First Name
                        </p>
                        <p>{currentUser?.firstName}</p>
                      </div>
                      <div className="flex flex-col gap-2 w-[7em]">
                        <p className="text-[#727271] text-xs font-semibold">
                          Last Name
                        </p>
                        <p>{currentUser?.lastName}</p>
                      </div>
                      <div className="flex flex-col gap-2 w-[7em]">
                        <p className="text-[#727271] text-xs font-semibold">
                          Email Address
                        </p>
                        <p>{currentUser?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5">
                      <div className="flex flex-col gap-2 w-[7em]">
                        <p className="text-[#727271] text-xs font-semibold">
                          Invited On
                        </p>
                        <p>
                          {user?.createdAt
                            ? new Date(
                                currentUser.createdAt
                              ).toLocaleDateString("en-GB", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-[7em]">
                        <p className="text-[#727271] text-xs font-semibold">
                          Created At
                        </p>
                        <p>
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-[7em]">
                        <p className="text-[#727271] text-xs font-semibold">
                          Role
                        </p>
                        <p>{currentUser?.role}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(user?._id)}
                    className="font-semibold  "
                    sx={{
                      height: "3em",
                      border: "2px #CD6162 solid",
                      borderRadius: "5px",
                    }}
                  >
                    Delete User
                  </Button>
                </div>
              </div>
              <Tables
                columns={headCells}
                rows={rows}
                label="User Permissions"
                deleteLable="Delete Permission"
                handleDelete={() => {}}
                handleEdit={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
