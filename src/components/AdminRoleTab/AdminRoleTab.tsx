import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";

import ActionButton from "../../UI/ActionButton/ActionButton";
import InputFields from "../../UI/InputFields/InputFields";
import Dropdown from "../../UI/Dropdown/Dropdown";
import LoadingScreen from "../../UI/LoadingScreen/LoadingScreen";
import Tables from "../../UI/Tables/Tables";

import { useRoles, usePermission } from "../../queries/usefetchDepartment";
import { setRole } from "../../redux/slices/createRoleSlice";
import { RootState } from "../../redux/store";
import { TableColumntype } from "UI/Tables/types";

const AdminRoleTab = () => {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string | null>(null);
  const initialRoleState = useSelector((state: any) => state.createRoleSlice);
  const [clearProp, setClearProp] = useState(false);
  const [errorState, setErrorState] = useState({
    nameError: null as string | null,
    permissionError: null as string | null,
  });
  const [selectedObjects, setSelectedObjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchData, setSearchData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const [roleState, setRoleState] = useState({
    id: initialRoleState._id,
    name: initialRoleState.name,
    permissionIds: initialRoleState.permissionIds,
    permissionNames: initialRoleState.permissionNames,
    permissionObjects: initialRoleState.permissionObjects,
  });
  const [permissions, setPermissions] = useState([]);
  const [rows, setRows] = useState([]);
  const queryClient = useQueryClient();
  const { data: role } = useRoles({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: permission, isLoading: loadingPermission } = usePermission({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (!permission || !role) return;
    setPermissions(permission);
    const roles = getRoleList(role);
    console.log(roles);
    setRows(roles);
  }, [permission, role]);
  // const fetchPermissions = async () => {
  //     //setLoadingState(true);
  //     try {
  //         const response = await fetch(
  //             `${process.env.REACT_APP_BASE_URL}/api/permission/getall`,
  //             {
  //                 cache: "no-store",
  //                 next: {
  //                     revalidate: 0,
  //                 },
  //             }
  //         );
  //         if (response.ok) {
  //             const resPermissions = await response.json();
  //             setPermissions(resPermissions);
  //         }
  //     } catch (error) {
  //         console.log(error);
  //         setLoadingState(false);
  //     } finally {
  //         setLoadingState(false);
  //     }
  // };
  const handlePermissionChange = (permissionsEvent: any) => {
    const permissionsId = permissionsEvent.map(
      (permission: any) => permission._id
    );
    const permissionName = permissionsEvent.map(
      (permission: any) => permission.name
    );
    setRoleState((prevState) => ({
      ...prevState,
      permissionIds: [...permissionsId],
      permissionNames: [...permissionName],
      permissionObjects: [...permissionsEvent],
    }));
    //console.log(permissionsEvent);
    setSelectedObjects(permissionsEvent);
  };
  const handleNameChange = (roleName: any) => {
    setRoleState((prevState) => ({
      ...prevState,
      name: roleName.target.value,
    }));
  };
  useEffect(() => {
    setClearProp(false);
  }, [clearProp]);

  const getRoleList = (resRoles: any) => {
    let roleList: any = [];
    for (const resU of resRoles) {
      const permissionsString = resU.permissions
        .map((e: any) => e.name)
        .join(", ");
      roleList.push({
        ...resU, // Formatting the date as a string
        permission: permissionsString, // Adding the transformed permissions string
      });
    }
    return roleList;
  };

  // const fetchRoles = async () => {
  //     try {
  //         const response = await fetch(
  //             `${process.env.REACT_APP_BASE_URL}/api/role/getall`,
  //             {
  //                 cache: "no-store",
  //                 next: {
  //                     revalidate: 0,
  //                 },
  //             }
  //         );
  //         const resRoles = await response.json();
  //         const userList = getRoleList(resRoles);
  //         //console.log("Roles: ", userList);
  //         setRows(userList);
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  const headCells: TableColumntype[] = [
    { id: "name", label: "NAME", type: "text", colWidth: 8 },
    { id: "permission", label: "PERMISSION", type: "email", colWidth: 15 },
    { id: "createdAt", label: "CREATED ON", type: "date", colWidth: 4 },
    { id: "actions", label: "ACTIONS", type: "actions", colWidth: 4 },
  ];

  // useEffect(() => {
  //     (async () => {
  //         await fetchRoles();
  //         await fetchPermissions();
  //     })();
  // }, []);

  useEffect(() => {
    setErrorState({
      nameError: null as string | null,
      permissionError: null as string | null,
    });
  }, [initialRoleState]);

  useEffect(() => {
    dispatch(setRole(roleState));
  }, [roleState]);

  const createRole = async () => {
    setClearProp(false);

    if (!selectedObjects.length || !roleState.name) {
      if (!roleState.name) {
        setErrorState((prevState) => ({
          ...prevState,
          nameError: "Please enter name",
        }));
      }
      if (!selectedObjects.length) {
        setErrorState((prevState) => ({
          ...prevState,
          permissionError: "Please select permissions",
        }));
      }
      return;
    }

    try {
      setLoadingState(true);

      const payload = {
        name: roleState.name,
        permissions: selectedObjects,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/role/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const resJson = await response.json();
      //console.log("ResJSON for ROLE TAB : ", resJson);

      if (resJson.status === 201) {
        // alert("Role created succefully");
        // fetchRoles();
        queryClient.invalidateQueries({
          queryKey: ["get-role"],
        });
        setLoadingState(false);

        setToastType("success");
        setToastMessage(resJson?.message);
        setClearProp(true);
      } else {
        // alert("Error in creating application");
        setToastType("error");
        throw new Error(resJson?.message);
      }
    } catch (error: any) {
      setToastMessage(error?.message);
      setLoadingState(false);

      return;
    }

    setRoleState({
      id: "",
      name: "",
      permissionIds: [],
      permissionNames: [],
      permissionObjects: [],
    });
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/role/delete`,
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
      // fetchRoles();
      queryClient.invalidateQueries({
        queryKey: ["get-role"],
      });
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
      // alert("Error in deleting Role");
      setToastType("error");
      setToastMessage(resJson?.message);
    }
  };
  const handleEdit = async (id: string) => {
    //console.log(id);
    setEditMode(true);
    // find user from rows using id
    let foundRole: any = rows.find((u: any) => u._id === id);
    setRoleState({
      ...roleState,
      name: foundRole.name,
      id: foundRole._id,
      permissionObjects: foundRole.permissions,
    });
    setSelectedObjects(foundRole.permissions);
    //console.log(foundRole);
  };
  const saveEdit = async () => {
    setEditMode(false);
    // setLoadingState(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/role/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...roleState,
          permissions: selectedObjects,
        }),
      }
    );
    // setLoadingState(false);
    setRoleState({
      id: "",
      name: "",
      permissionIds: [],
      permissionNames: [],
      permissionObjects: [],
    });
    setSelectedObjects([]);
    const resJson = await response.json();
    //console.log(resJson);
    if (resJson.status == 200) {
      // fetchRoles();
      queryClient.invalidateQueries({
        queryKey: ["get-role"],
      });
      // alert("Role Updated succefully");
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
      // alert("Error in creating Role");
      setToastType("error");
      setToastMessage(resJson?.message);
    }
  };

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
    <div className=" flex flex-col gap-8 justify-end items-start relative">
      {/* <LoadingScreen open={loadingState} /> */}

      {loadingState ? (
        <LoadingScreen open={loadingState} overlayColor="transparent" />
      ) : (
        <>
          <div className="flex gap-5  justify-start items-end px-8 w-auto bg-white rounded-xl border-2 border-purple-300 shadow-sm p-6 mb-6 mx-6">
            <InputFields
              label="Name"
              placeholder="Enter Role Name"
              name="role"
              value={roleState.name}
              handleChange={(event) => handleNameChange(event)}
              type="text"
              disabled={false}
              error={errorState.nameError}
              {...(editMode ? { highlight: "secondary" } : {})}
            />
            <Dropdown
              dropdownLabel="Permission"
              dropdownText="Select Permission"
              creationText="Create New Permission"
              creationFunction={() => navigate("/admin-settings/permissions")}
              objects={permissions}
              selectedObjects={selectedObjects}
              setSelectedObjects={setSelectedObjects}
              clearProp={clearProp}
              error={errorState.permissionError}
              {...(editMode ? { highlight: "secondary" } : {})}
            />
            <div className=" flex justify-center items-center mt-5">
              <ActionButton
                width={15}
                buttonColor={
                  roleState.name && selectedObjects.length
                    ? "secondary"
                    : "warning"
                }
                buttonText={editMode ? "Update Role" : "Add Role"}
                handleClick={editMode ? saveEdit : createRole}
              />
            </div>
          </div>
          <Tables
            columns={headCells}
            rows={rows}
            deleteLable="Delete Role"
            label="All Roles"
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

export default AdminRoleTab;
