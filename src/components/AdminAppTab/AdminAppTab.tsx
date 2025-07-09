import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Checkbox } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import ActionButton from "../../UI/ActionButton/ActionButton";
import InputFields from "../../UI/InputFields/InputFields";
import TagInputFields from "../../UI/TagInputFields/TagInputFields";
import Dropdown from "../../UI/Dropdown/Dropdown";
import Tables from "../../UI/Tables/Tables";
import LoadingScreen from "../../UI/LoadingScreen/LoadingScreen";

import { TableColumntype } from "../../UI/Tables/types";
import { setApp } from "../../redux/slices/createAppSlice";
import {
  useApplication,
  useEnvironment,
} from "../../queries/usefetchDepartment";
import { signInMethods } from "../../utils/helpers.util";
import { useNavigate } from "react-router-dom";

const AdminAppTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialAppState = useSelector((state: any) => state.createAppSlice);

  const [state, setState] = useState({
    loading: false,
    toastMessage: null as string | null,
    toastType: null as string | null,
    editMode: false,
    clearProp: false,
    appState: {} as any,
    environments: [] as any[],
    selectedEnvironments: [] as any[],
    rows: [] as any[],
    modules: [] as any[],
    signInMethods: [] as any[],
    selectedSignInMethods: [] as String[],
    autoGithubPat: false,
    errorState: {
      appError: null as string | null,
      moduleError: null as string | null,
      environmentError: null as string | null,
    },
  });
  const queryClient = useQueryClient();
  const { data: environment, isLoading: loadingEnvironment } = useEnvironment({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: application, isLoading: loadingApplication } = useApplication({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (!application || !environment) return;
    const appList = application?.map((resApp: any) => ({
      ...resApp,
      module: resApp.modules?.join(", "),
      environment: resApp.environments.map((env: any) => env?.name).join(", "),
      default: resApp.isDefault ? "Yes" : "No",
    }));
    setState((prev) => ({
      ...prev,
      rows: appList,
    }));
    setState((prev) => ({ ...prev, environments: environment }));
  }, [application, environment]);
  // const fetchApps = useCallback(async () => {
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
  //     const appList = resApps?.map((resApp: any) => ({
  //         ...resApp,
  //         module: resApp.modules?.join(", "),
  //         environment: resApp.environments
  //             .map((env: any) => env?.name)
  //             .join(", "),
  //         default: resApp.isDefault ? "Yes" : "No",
  //     }));
  //     setState((prev) => ({
  //         ...prev,
  //         rows: appList,
  //     }));
  // }, []);

  // const fetchEnvironments = useCallback(async () => {
  //     const response = await fetch(
  //         `${process.env.REACT_APP_BASE_URL}/api/environment/getall`,
  //         {
  //             cache: "no-store",
  //             next: {
  //                 revalidate: 0,
  //             },
  //         }
  //     );
  //     const resEnvironments = await response.json();

  // }, []);

  const headCells: TableColumntype[] = useMemo(
    () => [
      { id: "name", label: "NAME", type: "text", colWidth: 5 },
      {
        id: "environment",
        label: "ENVIRONMENT",
        type: "text",
        colWidth: 10,
      },
      { id: "module", label: "MODULE", type: "text", colWidth: 4 },
      { id: "default", label: "DEFAULT", type: "text", colWidth: 3 },
      { id: "status", label: "STATUS", type: "status", colWidth: 4 },
      { id: "createdAt", label: "CREATED ON", type: "date", colWidth: 3 },
      { id: "actions", label: "ACTIONS", type: "actions", colWidth: 3 },
    ],
    []
  );

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      signInMethods: signInMethods,
      selectedSignInMethods: [signInMethods[0]],
      // autoGithubPat:false,
    }));
  }, []);

  // useEffect(() => {
  //     // fetchApps();
  //     fetchEnvironments();
  // }, [ fetchEnvironments]);

  // useEffect(() => {
  //     if (state.rows.length !== 0) {
  //         setState((prev) => ({ ...prev, loading: false }));
  //     } else {
  //         setState((prev) => ({ ...prev, loading: true }));
  //     }
  // }, [state.rows]);

  useEffect(() => {
    if (state.toastMessage) {
      if (state.toastType === "error") toast.error(state.toastMessage);
      if (state.toastType === "warning") toast.warn(state.toastMessage);
      if (state.toastType === "success") toast.success(state.toastMessage);
    }
    setState((prev) => ({ ...prev, toastType: null, toastMessage: null }));
  }, [state.toastMessage]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setState((prev) => ({
      ...prev,
      appState: { ...prev.appState, [name]: value },
    }));
  };

  const handleAppModule = (moduleNames: any) => {
    setState((prev) => ({
      ...prev,
      appState: { ...prev.appState, modules: [...moduleNames] },
    }));
  };

  const handleGithubCheckboxChange = (event: any) => {
    setState((prev) => ({
      ...prev,
      autoGithubPat: event.target.checked,
    }));
  };
  const handleCheckboxChange = (event: any) => {
    setState((prev) => ({
      ...prev,
      appState: { ...prev.appState, isDefault: event.target.checked },
    }));
  };

  const errorCheck = () => {
    const { appState, modules, selectedEnvironments } = state;
    const newErrorState = {
      appError: !appState.name ? "Please select application" : null,
      moduleError: !modules.length ? "Please select module" : null,
      environmentError: !selectedEnvironments.length
        ? "Please select environment"
        : null,
    };
    setState((prev) => ({ ...prev, errorState: newErrorState }));
    return Object.values(newErrorState).some((error) => error !== null);
  };

  const createApplication = async () => {
    if (errorCheck()) return;

    const payload = {
      name: state.appState.name,
      environments: state.selectedEnvironments,
      state_params: state.appState.state_params,
      modules: state.modules,
      isDefault: state.appState.isDefault,
      autoGithubPat: state.autoGithubPat || false,
      signInMethods: state.selectedSignInMethods,
    };
    setState((prev) => ({ ...prev, loading: true }));

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/apps/create`,
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
      setState((prev) => ({
        ...prev,
        loading: false,
        toastType: "success",
        toastMessage: resJson?.message,
        clearProp: true,
        errorState: {
          appError: null,
          moduleError: null,
          environmentError: null,
        },
        appState: {
          _id: "",
          name: "",
          modules: [],
          state_params: "",
          isDefault: false,
          autoGithubPat: false,
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        toastType: "error",
        toastMessage: resJson?.message,
      }));
    }
    queryClient.invalidateQueries({
      queryKey: ["get-app"],
    });
    // fetchApps();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/apps/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );
    const resJson = await response.json();

    setState((prev) => ({
      ...prev,
      toastType: resJson.status === 200 ? "success" : "error",
      toastMessage: resJson?.message,
    }));
    queryClient.invalidateQueries({
      queryKey: ["get-app"],
    });

    // fetchApps();
  };

  const handleEdit = (id: any) => {
    const foundApp = state.rows.find((u) => u._id === id);
    console.log("Existing sign in methods :", foundApp.signInMethods);

    setState((prev) => ({
      ...prev,
      editMode: true,
      appState: foundApp,
      modules: foundApp?.modules,
      selectedEnvironments: foundApp?.environments,
      selectedSignInMethods: foundApp?.signInMethods || [signInMethods[0]], // Adjust to reflect selected signInMethods
      // Include "All" if all options are selected
      autoGithubPat: foundApp?.autoGithubPat,
    }));
  };

  const saveEdit = async () => {
    if (errorCheck()) return;

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/apps/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...state.appState,
          id: state.appState._id,
          modules: state.modules,
          environments: state.selectedEnvironments,
          signInMethods: state.selectedSignInMethods,
        }),
      }
    );
    const resJson = await response.json();

    if (resJson.status === 200) {
      setState((prev) => ({
        ...prev,
        editMode: false,
        clearProp: true,
        toastType: "success",
        toastMessage: resJson?.message,
        appState: {
          _id: "",
          name: "",
          modules: [],
          state_params: "",
          isDefault: false,
        },
        modules: [],
        selectedEnvironments: [],
        selectedSignInMethods: [signInMethods[0]], // Reset after save
        autoGithubPat: false,
        errorState: {
          appError: null,
          moduleError: null,
          environmentError: null,
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        toastType: "error",
        toastMessage: resJson?.message,
      }));
    }
    queryClient.invalidateQueries({
      queryKey: ["get-app"],
    });
    // fetchApps();
  };

  return (
    <div className="flex flex-col gap-8 justify-end items-start relative">
      {state.loading ? (
        <LoadingScreen open={state.loading} overlayColor="transparent" />
      ) : (
        <>
          <div className="flex gap-5 items-end flex-wrap">
            <div className="flex gap-8 justify-end items-start">
              <InputFields
                label="Application"
                placeholder="Enter Application Name"
                name="name"
                disabled={false}
                value={state.appState.name}
                handleChange={handleInputChange}
                type="text"
                error={state.errorState.appError}
                highlight={state.editMode ? "secondary" : undefined}
              />
              <TagInputFields
                label="Module"
                placeholder="Enter Module Name"
                modules={state.modules}
                handleChange={handleAppModule}
                tags={state.modules}
                setTags={(tags: any) =>
                  setState((prev) => ({
                    ...prev,
                    modules: tags,
                  }))
                }
                clearProp={state.clearProp}
                error={state.errorState.moduleError}
                tooltip="Select Application"
                highlight={state.editMode ? "secondary" : undefined}
              />
              <Dropdown
                dropdownLabel="Environment"
                dropdownText="Select Environment"
                creationText="Create New Environment"
                creationFunction={() =>
                  navigate("/admin-settings/environments")
                }
                objects={state.environments}
                selectedObjects={state.selectedEnvironments}
                setSelectedObjects={(selected: any) =>
                  setState((prev) => ({
                    ...prev,
                    selectedEnvironments: selected,
                  }))
                }
                clearProp={state.clearProp}
                selectedObjectType="object"
                error={state.errorState.environmentError}
                tooltip="Please select module"
                highlight={state.editMode ? "secondary" : undefined}
              />
            </div>
            <div className="flex justify-end items-center gap-8">
              <Dropdown
                dropdownLabel="Sign In Methods"
                dropdownText="Select Sign In Methods"
                objects={state.signInMethods}
                selectedObjects={state.selectedSignInMethods}
                setSelectedObjects={(selected: any) => {
                  let updatedSelections = [...selected];

                  // Ensure first option is selected by default on load
                  if (updatedSelections.length === 0) {
                    updatedSelections = [state.signInMethods[0]];
                  }
                  // If the first item is currently selected, remove it if other items are selected
                  else if (
                    updatedSelections.includes(state.signInMethods[0]) &&
                    updatedSelections.length > 1
                  ) {
                    updatedSelections = updatedSelections.filter(
                      (item) => item !== state.signInMethods[0]
                    );
                  }
                  // If all other options are selected, reselect the first item
                  else if (
                    updatedSelections.length ===
                      state.signInMethods.length - 1 &&
                    !updatedSelections.includes(state.signInMethods[0])
                  ) {
                    updatedSelections = [
                      state.signInMethods[0],
                      ...updatedSelections,
                    ];
                  }

                  setState((prev) => ({
                    ...prev,
                    selectedSignInMethods: updatedSelections,
                  }));
                }}
                clearProp={state.clearProp}
                selectedObjectType="array"
                error={state.errorState.environmentError}
                tooltip="Please select sign-in methods"
                highlight={state.editMode ? "secondary" : undefined}
              />

              <InputFields
                label="State_params (Optional)"
                placeholder="Enter State_Params"
                name="state_params"
                disabled={false}
                value={state.appState.state_params}
                handleChange={handleInputChange}
                type="text"
                highlight={state.editMode ? "secondary" : undefined}
              />
              <div>
                <div className="flex w-[13rem] text-sm justify-start items-center h-[2em] pt-4 pl-[2%]">
                  <Checkbox
                    checked={state.autoGithubPat}
                    onChange={handleGithubCheckboxChange}
                  />
                  <p>Auto Github Authorize</p>
                </div>
                <div className="flex w-[13rem] text-sm justify-start items-center h-[2em] pt-4 pl-[2%]">
                  <Checkbox
                    checked={state.appState.isDefault}
                    onChange={handleCheckboxChange}
                  />
                  <p>Make it Default</p>
                </div>
              </div>

              <div className="mt-4">
                <ActionButton
                  width={15}
                  buttonColor={
                    state.selectedEnvironments.length &&
                    state.modules.length &&
                    state.appState.name
                      ? "secondary"
                      : "warning"
                  }
                  buttonText={state.editMode ? "Update App" : "Add App"}
                  handleClick={state.editMode ? saveEdit : createApplication}
                />
              </div>
            </div>
          </div>
          <Tables
            columns={headCells}
            rows={state.rows}
            deleteLable="Delete Apps"
            label="All Apps"
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </>
      )}
      <ToastContainer
        style={{ position: "absolute", top: "-10em" }}
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

export default AdminAppTab;
