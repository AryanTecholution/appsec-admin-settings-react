import React, { useEffect, useState } from "react";
import ActionButton from "../../UI/ActionButton/ActionButton";
import InputFields from "../../UI/InputFields/InputFields";
import { validateURL } from "../../utils/helpers.util";
import Tables from "../../UI/Tables/Tables";
import { TableColumntype } from "../../UI/Tables/types";
import LoadingScreen from "../../UI/LoadingScreen/LoadingScreen";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useEnvironment } from "../../queries/usefetchDepartment";
import { useQueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../../UI/ConfirmationModal/ConfirmationModal";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000"; // adjust as needed

const AdminEnvironmentTab = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [clearProp, setClearProp] = useState(false);
  const [rows, setRows] = useState([]);

  const [environmentState, setEnvironmentState] = useState({
    name: "",
    hosted_url: "",
  });

  const [errorState, setErrorState] = useState({
    hostedUrlError: null as string | null,
    environmentError: null as string | null,
  });

  const headCells: TableColumntype[] = [
    { id: "name", label: "NAME", type: "text", colWidth: 8 },
    { id: "hosted_url", label: "HOSTED URL", type: "link", colWidth: 12 },
    { id: "createdAt", label: "CREATED ON", type: "date", colWidth: 4 },
    { id: "actions", label: "ACTIONS", type: "actions", colWidth: 4 },
  ];
  const { data: environment, isLoading: loadingEnvironment } = useEnvironment({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: string; text: string }>({
    id: "",
    text: "",
  });

  const handleDeleteRequest = (id: string, text: string) => {
    setSelectedRow({ id, text });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(selectedRow.id); // call your existing function
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (!environment) return;
    setRows(environment);
  }, [environment]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setEnvironmentState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const errorCheck = () => {
    let errorFlag = false;
    if (!environmentState.hosted_url) {
      setErrorState((prevState) => ({
        ...prevState,
        hostedUrlError: "Please enter hosted url",
      }));
      errorFlag = true;
    }

    if (environmentState.hosted_url) {
      const hostedUrlStatus = validateURL(environmentState.hosted_url);
      setErrorState((prevState) => ({
        ...prevState,
        hostedUrlError: hostedUrlStatus,
      }));
      if (hostedUrlStatus) errorFlag = true;
    }

    if (!environmentState.name) {
      setErrorState((prevState) => ({
        ...prevState,
        environmentError: "Please Enter Environment Name",
      }));
      errorFlag = true;
    }

    return errorFlag;
  };
  const createEnvironment = async () => {
    setClearProp(false);
    if (errorCheck()) {
      return;
    }
    setLoadingState(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/environment/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(environmentState),
      }
    );
    // fetchEnvironments();
    queryClient.invalidateQueries({
      queryKey: ["get-env"],
    });
    const resJson = await response.json();

    if (resJson.status === 200) {
      setToastType("success");
      setToastMessage(resJson?.message);
      setLoadingState(false);

      setClearProp(true);
      setErrorState({
        hostedUrlError: null as string | null,
        environmentError: null as string | null,
      });
    } else {
      setToastType("error");
      setLoadingState(false);

      setToastMessage(resJson?.message);
    }
    setEnvironmentState({
      name: "",
      hosted_url: "",
    });
  };
  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/environment/delete`,
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
      // fetchEnvironments();
      queryClient.invalidateQueries({
        queryKey: ["get-env"],
      });
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
      setToastType("error");
      setToastMessage(resJson?.message);
    }
  };

  const handleEdit = async (id: string) => {
    setEditMode(true);
    // find environments from rows using id
    let foundEnvironment: any = rows.find((u: any) => u._id === id);
    setEnvironmentState(foundEnvironment);
  };

  const saveEdit = async () => {
    if (errorCheck()) {
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/environment/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...environmentState,
        }),
      }
    );

    setEditMode(false);
    setClearProp(true);
    const resJson = await response.json();
    if (resJson.status == 200) {
      setEnvironmentState({
        name: "",
        hosted_url: "",
      });
      setErrorState({
        hostedUrlError: null as string | null,
        environmentError: null as string | null,
      });
      // fetchEnvironments();
      queryClient.invalidateQueries({
        queryKey: ["get-env"],
      });
      setToastType("success");
      setToastMessage(resJson?.message);
    } else {
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

  useEffect(() => {
    setErrorState({
      hostedUrlError: null as string | null,
      environmentError: null as string | null,
    });
  }, [environmentState]);
  return (
    <div className=" flex flex-col gap-8 justify-end items-start relative">
      {showDeleteModal && (
        <ConfirmationModal
          ModalText={`Are you sure you want to delete ${selectedRow.text}?`}
          buttonText1="Cancel"
          buttonText2="Yes, Delete"
          handleButton1={() => setShowDeleteModal(false)}
          handleButton2={handleDeleteConfirm}
          handleClose={() => setShowDeleteModal(false)}
        />
      )}
      {loadingState ? (
        <LoadingScreen open={loadingState} overlayColor="transparent" />
      ) : (
        <>
          <div className="flex gap-5  items-end flex-wrap w-auto bg-white rounded-xl border-2 border-purple-300 shadow-sm p-6 mb-6 mx-6">
            <div className="flex  gap-8 justify-end items-end">
              <InputFields
                label="Environment"
                placeholder="Enter Environment Name"
                name="name"
                disabled={false}
                value={environmentState.name}
                handleChange={(event) => handleInputChange(event)}
                type="text"
                error={errorState.environmentError}
                {...(editMode ? { highlight: "secondary" } : {})}
              />
              <InputFields
                label="Hosted URL"
                placeholder="Enter Hosted URL of the environment"
                name="hosted_url"
                disabled={false}
                value={environmentState.hosted_url}
                handleChange={(event) => handleInputChange(event)}
                type="text"
                error={errorState.hostedUrlError}
                {...(editMode ? { highlight: "secondary" } : {})}
              />
            </div>
            <div className=" flex justify-end items-end gap-8">
              <ActionButton
                width={15}
                buttonColor={
                  environmentState.hosted_url && environmentState.name
                    ? "secondary"
                    : "warning"
                }
                buttonText={editMode ? "Update Environment" : "Add Environment"}
                handleClick={editMode ? saveEdit : createEnvironment}
              />
            </div>
          </div>
          <Tables
            handleDeleteRequest={handleDeleteRequest}
            columns={headCells}
            rows={rows}
            deleteLable="Delete Environment"
            label="All Environments"
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

export default AdminEnvironmentTab;
