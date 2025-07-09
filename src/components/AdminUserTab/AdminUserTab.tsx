import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";

import ActionButton from "../../UI/ActionButton/ActionButton";
import InputFields from "../../UI/InputFields/InputFields";
import RadioDropdown from "../../UI/RadioDropdown/RadioDropdown";
import LoadingScreen from "../../UI/LoadingScreen/LoadingScreen";
import Tables from "../../UI/Tables/Tables";
import Dropdown from "../../UI/Dropdown/Dropdown";

import { USER_VALIDITY_OPTIONS } from "../../utils/helpers.util";
import { setUser } from "../../redux/slices/createUserSlice";
import { useUsers, useRoles } from "../../queries/usefetchDepartment";
import { RootState } from "../../redux/store";
import { TableColumntype } from "UI/Tables/types";

interface UserState {
  _id: string;
  email: string;
  roleObject: any;
  userValidity: string | null;
}

const AdminUserTab: React.FC = () => {
  const navigate = useNavigate();
  const initialUserState = useSelector((state: any) => state.createUserSlice);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<boolean>(false);
  const [searchData, setSearchData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [userState, setUserState] = useState<UserState>({
    _id: initialUserState._id,
    email: initialUserState.email,
    roleObject: initialUserState.roleObject,
    userValidity: null, // Initial value for validity
  });

  const [errorState, setErrorState] = useState({
    emailError: null as string | null,
    roleError: null as string | null,
    userValidityError: null as string | null,
  });
  const headCells: TableColumntype[] = [
    { id: "name", label: "NAME", type: "text", colWidth: 5 },
    { id: "email", label: "EMAIL", type: "email", colWidth: 7 },
    { id: "status", label: "STATUS", type: "status", colWidth: 3 },
    { id: "roleName", label: "ROLE", type: "text", colWidth: 10 },
    { id: "invited", label: "INVITED ON", type: "date", colWidth: 3 },
    { id: "joined", label: "JOINED ON", type: "text", colWidth: 3 },
    { id: "actions", label: "ACTIONS", type: "actions", colWidth: 3 },
  ];
  const [selectedValidity, setSelectedValidity] = useState<any>(null);

  const formatDate = (date: any) => {
    if (!date) {
      return "Not Registered";
    }
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const queryClient = useQueryClient();
  const { data: users } = useUsers({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: role } = useRoles({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (!users || !role) return;
    setRoles(role);
    const userData = getUserList(users);
    setRows(userData);
  }, [users, role]);
  const getUserList = (resUsers: any) => {
    let userList: any = [];
    for (const resU of resUsers) {
      userList.push({
        ...resU,
        invited: new Date(resU?.createdAt),
        name: `${resU.firstname ?? ""} ${resU.lastname ?? ""}`.trim(),
        roleName: resU?.role?.map((role: any) => role.name).join(","),
        roleObject: resU.role,
        joined: formatDate(resU?.joinedOn),
      });
    }
    return userList;
  };

  const handleEmailChange = (event: any) => {
    setUserState((prevState) => ({
      ...prevState,
      email: event.target.value,
    }));
  };

  const handleRoleChange = (role: any) => {
    setUserState((prevState: UserState) => ({
      ...prevState,
      roleObject: [...role],
    }));
  };

  const handleValidityChange = (validityInDays: any) => {
    console.log("validityInDays", validityInDays);

    if (!isNaN(validityInDays) && validityInDays > 0) {
      const currentDate = new Date();
      const validDate = new Date(
        currentDate.setDate(currentDate.getDate() + validityInDays)
      );

      setUserState((prevState) => ({
        ...prevState,
        userValidity: validDate.toISOString(), // Store in ISO format for better compatibility
      }));
      console.log("Updated State with Validity", validDate.toISOString());
    } else {
      console.error("Invalid validity value");
      setToastType("error");
      setToastMessage("Invalid validity value");
    }
  };

  useEffect(() => {
    if (selectedValidity) {
      handleValidityChange(selectedValidity?.value);
    }
  }, [selectedValidity]);

  useEffect(() => {
    dispatch(setUser(userState));
  }, [userState]);

  useEffect(() => {
    setErrorState({
      emailError: null as string | null,
      roleError: null as string | null,
      userValidityError: null as string | null,
    });
  }, [initialUserState]);
  const pass =
    process.env.REACT_APP_NODEMAILER_PASS?.startsWith('"') &&
    process.env.REACT_APP_NODEMAILER_PASS?.endsWith('"')
      ? process.env.REACT_APP_NODEMAILER_PASS.slice(1, -1)
      : process.env.REACT_APP_NODEMAILER_PASS;

  const createUser = async () => {
    console.log("Creating User", errorState);

    setToastMessage(null);

    if (
      !Object.entries(initialUserState.roleObject).length ||
      !initialUserState.email ||
      !initialUserState.userValidity
    ) {
      if (!initialUserState.email) {
        setErrorState((prevState) => ({
          ...prevState,
          emailError: "Please enter email",
        }));
      }
      if (!Object.entries(initialUserState.roleObject).length) {
        setErrorState((prevState) => ({
          ...prevState,
          roleError: "Please select role",
        }));
      }
      if (!initialUserState.userValidity) {
        setErrorState((prevState) => ({
          ...prevState,
          userValidityError: "Please select validity",
        }));
      }
      return;
    }

    const payload = {
      email: userState.email,
      role: userState.roleObject,
      userValidity: userState.userValidity,
    };

    console.log("invite - user", payload);
    try {
      setLoadingState(true);
      const emails = userState.email.trim();
      const inviteType =
        emails.split(",").length > 1 ? "bulk-invite-user" : "invite-user";

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/user/${inviteType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const resJson = await response.json();

      if (resJson.status == 200) {
        setToastType("success");
        setLoadingState(false);
        setToastMessage(resJson?.message);
        // fetchUsers();
        queryClient.invalidateQueries({
          queryKey: ["get-user"],
        });
      } else {
        setToastType("error");
        throw new Error(resJson?.message);
      }
    } catch (error: any) {
      setToastMessage(error?.message);
      setLoadingState(false);
      return;
    }
    setLoadingState(false);
    setUserState({
      _id: "",
      email: "",
      roleObject: [],
      userValidity: null, // Reset validity after creating user
    });
  };

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
    //console.log("DelJson", resJson);

    if (resJson.status == 200) {
      setToastType("success");
      // fetchUsers();
      queryClient.invalidateQueries({
        queryKey: ["get-user"],
      });
      // alert("User deleted succefully");

      setToastMessage(resJson?.message);
    } else {
      setToastType("error");

      setToastMessage(resJson?.message);
      // alert("Error in deleting User");
    }
  };
  const handleEdit = async (id: string) => {
    setEditMode(true);
    // Find the user from rows using the id
    let foundUser: any = rows.find((u: any) => u._id === id);

    // Ensure we include the 'validity' field from the found user if available
    setUserState({
      ...foundUser,
      roleObject: foundUser.role,
      userValidity: foundUser.userValidity || null, // If no validity is set, default to null
    });
  };

  const saveEdit = async () => {
    setEditMode(false);

    // Prepare the updated user object, including the validity date
    const updatedUser = {
      ...userState,
      id: userState._id,
      role: userState.roleObject || [],
      userValidity: userState.userValidity, // Include the validity date in the update
    };
    console.log(userState);
    // Send the updated user data to the API
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }
    );

    const resJson = await response.json();

    // Reset user state after saving
    setUserState({
      ...userState,
      _id: "",
      email: "",
      roleObject: [],
      userValidity: null, // Reset validity after saving
    });

    // Handle success or error response
    if (resJson.status === 200) {
      // fetchUsers();
      queryClient.invalidateQueries({
        queryKey: ["get-user"],
      });
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
      setToastType("error");
      setToastMessage(resJson.message);
    }
  };

  // useEffect(() => {
  //     if (rows.length) {
  //         setLoadingState(false);
  //     } else {
  //         setLoadingState(true);
  //     }
  // }, [rows]);
  useEffect(() => {
    if (toastMessage) {
      if (toastType === "error") toast.error(toastMessage);
      if (toastType === "warning") toast.warn(toastMessage);
      if (toastType === "success") toast.success(toastMessage);
    }
    setToastType(null);
    setToastMessage(null);
  }, [toastMessage]);

  return (
    <div className=" flex flex-col gap-8 justify-start items-start relative">
      {loadingState ? (
        <LoadingScreen open={loadingState} overlayColor="transparent" />
      ) : (
        <>
          <div className="flex gap-5 justify-start items-end ">
            <InputFields
              label="Email Address"
              placeholder="Enter Email"
              name="email"
              value={userState.email}
              handleChange={(event: any) => handleEmailChange(event)}
              type="email"
              disabled={editMode}
              error={errorState.emailError}
              {...(editMode ? { highlight: "secondary" } : {})}
            />
            <Dropdown
              dropdownLabel="Role"
              dropdownText="Select Role"
              creationText="Create New Role"
              creationFunction={() => navigate("/admin-settings/roles")}
              objects={roles}
              selectedObjects={userState.roleObject}
              setSelectedObjects={(role: any) => handleRoleChange(role)}
              clearProp={false}
              error={errorState.roleError}
              {...(editMode ? { highlight: "secondary" } : {})}
            />
            <RadioDropdown
              dropdownText="Select User Validity"
              dropdownLabel="User Validity"
              objects={USER_VALIDITY_OPTIONS.map((option) => ({
                name: option.label,
                value: option.value, // Value should represent days of validity
              }))}
              selectedObject={selectedValidity} // State variable for selected option
              setSelectedObjects={(selected: any) => {
                setSelectedValidity(selected);
                if (selected && selected?.value) {
                  handleValidityChange(selected.value);
                } // Call with validity in days
              }}
              highlight="primary"
              error={errorState.userValidityError}
              disabled={userState.email != "" ? false : true}
            />

            <div className="mt-5">
              <ActionButton
                width={15}
                buttonColor={
                  initialUserState?.email &&
                  Object.entries(initialUserState?.roleObject).length &&
                  initialUserState?.userValidity
                    ? "secondary"
                    : "warning"
                }
                buttonText={editMode ? "Save User" : "Invite User"}
                handleClick={editMode ? saveEdit : createUser}
              />
            </div>
          </div>
          <Tables
            columns={headCells}
            deleteLable="Delete User"
            rows={rows}
            label="All Users"
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </>
      )}

      <ToastContainer
        // position="top-right"
        style={{
          position: "absolute",
          top: "-10em",
        }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default AdminUserTab;
