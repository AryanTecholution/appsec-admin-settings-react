import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";

import Dropdown from "../../UI/Dropdown/Dropdown";
import RadioDropdown from "../../UI/RadioDropdown/RadioDropdown";
import ActionButton from "../../UI/ActionButton/ActionButton";
import InputFields from "../../UI/InputFields/InputFields";
import LoadingScreen from "../../UI/LoadingScreen/LoadingScreen";
import Tables from "../../UI/Tables/Tables";

import { setPermission } from "../../redux/slices/createPermissionSlice";
import {
  useApplication,
  useOperation,
  usePermission,
} from "../../queries/usefetchDepartment";
import { TableColumntype } from "../../UI/Tables/types";

const AdminPermissionTab: React.FC = () => {
  const navigate = useNavigate();
  const initialPermissionState = useSelector(
    (state: any) => state.createPermissionSlice
  );
  const dispatch = useDispatch();
  const [loadingState, setLoadingState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [permissionState, setPermissionsState] = useState({
    _id: initialPermissionState._id,
    appObject: initialPermissionState.appObject,
    moduleIds: initialPermissionState.moduleIds,
    moduleNames: initialPermissionState.moduleNames,
    moduleObjects: initialPermissionState.moduleObjects,
    operationIds: initialPermissionState.operationIds,
    operationNames: initialPermissionState.operationNames,
    operationObjects: initialPermissionState.operationObjects,
    name: initialPermissionState.name,
  });
  const [errorState, setErrorState] = useState({
    nameError: null as string | null,
    appError: null as string | null,
    moduleError: null as string | null,
    operationError: null as string | null,
  });

  const [apps, setApps] = useState<any[]>([]); // Changed to useState<App[]>([])
  const [operations, setOperations] = useState<any[]>([]); // Changed to useState<Operation[]>([])
  const [selectedApp, setSelectedApp] = useState<any>({
    _id: "",
    name: "",
    hosted_url: "",
    state_params: "",
    modules: "",
    isDefault: "",
  });
  const [rows, setRows] = useState([]);
  const [selectedOperations, setSelectedOperations] = useState<any[]>([]);
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  const [clearProp, setClearProp] = useState(false);
  const queryClient = useQueryClient();
  const { data: application, isLoading: loadingApplication } = useApplication({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: operation, isLoading: loadingOperations } = useOperation({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: permissions, isLoading: loadingPermission } = usePermission({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (!operation || !application || !permissions) return;
    setApps(application);
    let userList: any = [];
    for (const resU of permissions) {
      const operationsString = resU.operations
        .map((e: any) => e?.name)
        .join(", ");
      const moduleString = resU.modules?.join(", ");
      // console.log(moduleString);
      userList.push({
        ...resU,
        appName: resU?.app?.name || "",
        module: moduleString,
        operation: operationsString,
      });
    }
    setRows(userList);
    setOperations(operation);
  }, [operation, application, permissions]);

  useEffect(() => {
    if (toastMessage) {
      if (toastType === "error") toast.error(toastMessage);
      if (toastType === "warning") toast.warn(toastMessage);
      if (toastType === "success") toast.success(toastMessage);
    }
    setToastType(null);
    setToastMessage(null);
  }, [toastMessage]);

  // const fetchApps = async () => {
  //     const response = await fetch(
  //         `${process.env.REACT_APP_BASE_URL}/api/apps/getall`,
  //         {
  //             cache: "no-store",
  //             next: {
  //                 revalidate: 0,
  //             },
  //         }
  //     );
  //     const resApps = await response.json();
  //     // console.log("resApp:", resApps);
  //     // console.log("modules: ", resApps.modules);

  //     setApps(resApps);
  // };

  // const fetchPermissions = async () => {
  //     const response = await fetch(
  //         `${process.env.REACT_APP_BASE_URL}/api/permission/getall`,
  //         {
  //             cache: "no-store",
  //             next: {
  //                 revalidate: 0,
  //             },
  //         }
  //     );
  //     const resUsers = await response.json();
  //     // console.log("resUsers:", resUsers);
  //     let userList: any = [];
  //     for (const resU of resUsers) {
  //         const operationsString = resU.operations
  //             .map((e: any) => e?.name)
  //             .join(", ");
  //         const moduleString = resU.modules?.join(", ");
  //         // console.log(moduleString);
  //         userList.push({
  //             ...resU,
  //             appName: resU?.app?.name || "",
  //             module: moduleString,
  //             operation: operationsString,
  //         });
  //     }
  //     //console.log(userList);
  //     setRows(userList);
  // };

  const headCells: TableColumntype[] = [
    { id: "name", label: "NAME", type: "text", colWidth: 5 },
    { id: "appName", label: "APPLICATION", type: "text", colWidth: 4 },
    { id: "module", label: "MODULE", type: "text", colWidth: 4 },
    { id: "operation", label: "OPERATION", type: "text", colWidth: 4 },
    // { id: "status", label: "STATUS", type: "string", colWidth: 4 },
    { id: "createdAt", label: "CREATED ON", type: "date", colWidth: 4 },
    { id: "actions", label: "ACTIONS", type: "actions", colWidth: 4 },
  ];

  useEffect(() => {
    //console.log("Creation Check :", clearProp);
    //console.log(permissionState);
    setClearProp(false);
  }, [clearProp]);

  // const fetchOperations = async () => {
  //     const response = await fetch(
  //         `${process.env.REACT_APP_BASE_URL}/api/operation/getall`,
  //         {
  //             cache: "no-store",
  //             next: {
  //                 revalidate: 0,
  //             },
  //         }
  //     );
  //     const resOperations = await response.json();
  //     setOperations(resOperations);
  // };

  const handleAppChange = (app: any) => {
    setPermissionsState((prevState) => ({
      ...prevState,
      appObject: app,
    }));
    setSelectedModules([]);
    setSelectedOperations([]);
  };

  const handleModuleChange = (modulesEvent: any) => {
    const modulesId = modulesEvent.map((module: any) => module._id);
    const moduleName = modulesEvent.map((module: any) => module.name);
    setPermissionsState((prevState) => ({
      ...prevState,
      moduleIds: [...modulesId],
      moduleNames: [...moduleName],
      moduleObjects: [...modulesEvent],
    }));
  };

  const handleOperationChange = (operationsEvent: any) => {
    const operationsId = operationsEvent.map((operation: any) => operation._id);
    const operationName = operationsEvent.map(
      (operation: any) => operation.name
    );
    setPermissionsState((prevState) => ({
      ...prevState,
      operationIds: [...operationsId],
      operationNames: [...operationName],
      operationObjects: [...operationsEvent],
    }));
  };

  const handleNameChange = (event: any) => {
    setPermissionsState((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  // useEffect(() => {
  //     fetchApps();
  //     fetchPermissions();
  //     fetchOperations();
  // }, []);

  useEffect(() => {
    setErrorState({
      nameError: null as string | null,
      appError: null as string | null,
      moduleError: null as string | null,

      operationError: null as string | null,
    });
  }, [initialPermissionState]);

  useEffect(() => {
    dispatch(setPermission(permissionState));
  }, [permissionState]);

  const createPermission = async () => {
    setClearProp(false);

    const payload = {
      name: permissionState.name,
      app: permissionState.appObject._id,
      modules: selectedModules,
      operations: selectedOperations,
    };
    //console.log("payload:", payload);

    if (
      !selectedOperations.length ||
      !permissionState.name.length ||
      !selectedModules.length ||
      !Object.entries(permissionState.appObject).length
    ) {
      if (!permissionState.name.length) {
        setErrorState((prevState) => ({
          ...prevState,
          nameError: "Please enter name",
        }));
        //console.log("nameError");
      }
      if (!selectedModules.length) {
        setErrorState((prevState) => ({
          ...prevState,
          moduleError: "Please select modules",
        }));
        //console.log("permission error");
      }

      if (!selectedOperations.length) {
        setErrorState((prevState) => ({
          ...prevState,
          operationError: "Please select operations",
        }));
        //console.log("ops error");
      }
      if (!Object.entries(permissionState.appObject).length) {
        setErrorState((prevState) => ({
          ...prevState,
          appError: "Please select apps",
        }));
        //console.log("app error");
      }
      return;
    }
    try {
      setLoadingState(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/permission/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const resJson = await response.json();

      if (resJson.status === 201) {
        // fetchPermissions();
        queryClient.invalidateQueries({
          queryKey: ["get-perm"],
        });
        setLoadingState(false);
        // alert("Permission created succefully");\
        setToastType("success");
        setToastMessage(resJson?.message);
        setClearProp(true);
      } else {
        // alert("Error in creating permission");
        setToastType("error");
        throw new Error(resJson?.message);
      }
    } catch (error) {
      console.error(error);
      setLoadingState(false);

      return;
    }
    // setLoadingState(false);

    setPermissionsState({
      _id: "",
      appObject: {},
      moduleIds: [],
      moduleNames: [],
      moduleObjects: [],
      operationIds: [],
      operationNames: [],
      operationObjects: [],
      name: "",
    });
  };
  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/permission/delete`,
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
      // fetchPermissions();
      queryClient.invalidateQueries({
        queryKey: ["get-perm"],
      });
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
      // alert("Error in deleting Permission");
      setToastType("error");
      setToastMessage(resJson?.message);
    }
  };
  const handleEdit = async (id: string) => {
    //console.log(id);
    setEditMode(true);
    // find user from rows using id
    let foundPermission: any = rows.find((u: any) => u._id === id);
    setPermissionsState({
      ...permissionState,
      appObject: foundPermission.app,
      ...foundPermission,
    });
    setSelectedModules(foundPermission.modules);
    setSelectedOperations(foundPermission.operations);
    //console.log(foundPermission);
  };
  const saveEdit = async () => {
    setEditMode(false);
    // setLoadingState(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/permission/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...permissionState,
          modules: selectedModules,
          operations: selectedOperations,
          app: permissionState.appObject,
          id: permissionState._id,
        }),
      }
    );
    // setLoadingState(false);
    setPermissionsState({
      appObject: null,
      _id: "",
      moduleIds: [],
      moduleNames: [],
      moduleObjects: [],
      name: "",
      operationIds: [],
      operationNames: [],
      operationObjects: [],
    });
    setSelectedOperations([]);
    setSelectedModules([]);
    const resJson = await response.json();
    //console.log(resJson);
    if (resJson.status == 200) {
      // fetchPermissions();
      queryClient.invalidateQueries({
        queryKey: ["get-perm"],
      });
      // alert("Permission Updated succefully");
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
      // alert("Error in creating Permission");
      setToastType("error");
      setToastMessage(resJson?.message);
    }
  };

  return (
    <div className=" flex flex-col gap-8 justify-end items-start relative">
      {/* <LoadingScreen open={loadingState} /> */}

      {loadingState ? (
        <LoadingScreen open={loadingState} overlayColor="transparent" />
      ) : (
        <>
          {" "}
          <div className="flex gap-5  items-end flex-wrap px-8 w-auto bg-white rounded-xl border-2 border-purple-300 shadow-sm p-6 mb-6 mx-6">
            <div className="flex justify-start gap-8">
              <RadioDropdown
                dropdownLabel="Application"
                dropdownText="Select Application"
                creationText="Create New App"
                creationFunction={() => navigate("/admin-settings/apps")}
                objects={apps}
                radioType
                selectedObject={permissionState.appObject}
                setSelectedObjects={(app: any) => handleAppChange(app)}
                error={errorState.appError}
                {...(editMode ? { highlight: "secondary" } : {})}
              />
              <Dropdown
                dropdownLabel="Module"
                dropdownText="Select Module"
                creationText="Create New Module"
                creationFunction={() => navigate("/admin-settings/apps")}
                selectedObjectType="array"
                objects={permissionState?.appObject?.modules}
                selectedObjects={selectedModules}
                setSelectedObjects={setSelectedModules}
                disable={Boolean(!permissionState.appObject?.name)}
                clearProp={clearProp}
                error={errorState?.moduleError}
                tooltip={"Please select application"}
                {...(editMode ? { highlight: "secondary" } : {})}
              />
              <Dropdown
                dropdownLabel="Operation"
                dropdownText="Select Operation"
                creationText="Create New Operations"
                creationFunction={() => navigate("/admin-settings/operations")}
                objects={operations}
                selectedObjects={selectedOperations}
                setSelectedObjects={setSelectedOperations}
                clearProp={clearProp}
                error={errorState.operationError}
                disable={Boolean(!selectedModules?.length)}
                tooltip={"Please select module"}
                {...(editMode ? { highlight: "secondary" } : {})}
              />
            </div>
            <div className="w-full flex justify-start gap-8 items-end">
              <InputFields
                label="Name"
                placeholder="Enter Name"
                name="name"
                disabled={false}
                value={permissionState.name}
                handleChange={(event) => handleNameChange(event)}
                type="text"
                error={errorState.nameError}
              />
              <ActionButton
                width={15}
                buttonColor={
                  selectedOperations.length &&
                  permissionState.name.length &&
                  selectedModules.length &&
                  permissionState.appObject
                    ? "secondary"
                    : "warning"
                }
                buttonText={editMode ? "Update Permission" : "Add Permission"}
                handleClick={editMode ? saveEdit : createPermission}
              />
            </div>
          </div>
          <Tables
            columns={headCells}
            rows={rows}
            deleteLable="Delete Permission"
            label="All Permissions"
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
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
        </>
      )}
    </div>
  );
};

export default AdminPermissionTab;
