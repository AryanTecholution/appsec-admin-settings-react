import React, { useEffect, useState } from "react";
import ActionButton from "../../UI/ActionButton/ActionButton";
import Tables from "../../UI/Tables/Tables";
import { TableColumntype } from "../../UI/Tables/types";
import InputFields from "../../UI/InputFields/InputFields";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../../redux/slices/createOperationSlice";
import LoadingScreen from "../../UI/LoadingScreen/LoadingScreen";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";
import { useOperation } from "../../queries/usefetchDepartment";
import ConfirmationModal from "../../UI/ConfirmationModal/ConfirmationModal";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const AdminOperationTab = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string | null>(null);

  const initialOperationState = useSelector(
    (state: any) => state.createOperationSlice
  );
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  const [rows, setRows] = useState([]);

  const [operation, setOperation] = useState({
    _id: initialOperationState._id,
    name: initialOperationState.operationName,
  });

  const [errorState, setErrorState] = useState({
    nameError: null as string | null,
  });
  const queryClient = useQueryClient();

  const { data: operations, isLoading: loadingOperation } = useOperation({
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
    if (!operation) return;
    if (operations) {
      let userList: any = [];
      for (const resU of operations) {
        userList.push({
          ...resU,
          createdAt: new Date(resU.createdAt),
        });
      }
      setRows(userList);
    }
  }, [operations]);
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
  //     const resUsers = await response.json();
  //     let userList: any = [];
  //     for (const resU of resUsers) {
  //         userList.push({
  //             ...resU,
  //             createdAt: new Date(resU.createdAt),
  //         });
  //     }
  //     setRows(userList);
  // };

  const headCells: TableColumntype[] = [
    { id: "name", label: "NAME", type: "text", colWidth: 5 },
    { id: "createdAt", label: "CREATED ON", type: "date", colWidth: 4 },
    { id: "actions", label: "ACTIONS", type: "actions", colWidth: 4 },
  ];

  // useEffect(() => {
  //     console.log("Admin Operations");

  //     // fetchOperations();

  // }, []);

  useEffect(() => {
    setErrorState(() => ({
      nameError: null as string | null,
    }));
  }, [initialOperationState]);

  const createOperation = async () => {
    if (!operation.name) {
      setErrorState((prevState) => ({
        ...prevState,
        nameError: "Please enter name",
      }));
      return;
    }
    try {
      setLoadingState(true);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/operation/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: operation.name }),
        }
      );
      const resJson = await response.json();

      if (resJson.status === 201) {
        // fetchOperations();
        queryClient.invalidateQueries({
          queryKey: ["get-operation"],
        });
        setLoadingState(false);

        setToastType("success");
        setToastMessage(resJson?.message);
      } else {
        setToastType("error");
        throw new Error(resJson?.message);
      }
    } catch (error: any) {
      setToastMessage(error?.message);
      return;
    }

    setOperation({
      _id: "",
      name: "",
    });
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/operation/delete`,
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
      // fetchOperations();
      queryClient.invalidateQueries({
        queryKey: ["get-operation"],
      });
      setToastType("error");
      setToastMessage(resJson?.message);
    } else {
      setToastType("error");
      setToastMessage(resJson?.message);
    }
  };

  const handleEdit = async (id: string) => {
    setEditMode(true);
    let foundOp: any = rows.find((u: any) => u._id === id);
    setOperation(foundOp);
  };

  const saveEdit = async () => {
    setEditMode(false);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/operation/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: operation._id,
            name: operation.name,
          }),
        }
      );
      const resJson = await response.json();
      if (resJson.status == 200) {
        // fetchOperations();
        queryClient.invalidateQueries({
          queryKey: ["get-operation"],
        });
        setOperation({
          _id: "",
          name: "",
        });
        setToastType("success");
        setToastMessage(resJson?.message);
      } else {
        setToastType("error");
        setToastMessage(resJson.message);
      }
    } catch (error) {
      setToastType("error");
      setToastMessage("Error updating operation");
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
    <div className="flex flex-col gap-8 justify-end items-start relative">
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
          <div className="flex gap-5 justify-end items-end  px-8 w-auto bg-white rounded-xl border-2 border-purple-300 shadow-sm p-6 mb-6 mx-6">
            <InputFields
              label="Name"
              placeholder="Enter Name"
              name="operationName"
              value={operation.name}
              handleChange={(event: any) => {
                setOperation({
                  ...operation,
                  name: event?.target.value,
                });
              }}
              disabled={false}
              type="text"
              error={errorState.nameError}
              {...(editMode ? { highlight: "secondary" } : {})}
            />

            <ActionButton
              width={15}
              buttonColor={operation.name ? "secondary" : "warning"}
              buttonText={editMode ? "Update Operation" : "Add Operation"}
              handleClick={editMode ? saveEdit : createOperation}
            />
          </div>
          <Tables
            handleDeleteRequest={handleDeleteRequest}
            columns={headCells}
            rows={rows}
            deleteLable="Delete Operation"
            label="All Operations"
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default AdminOperationTab;
