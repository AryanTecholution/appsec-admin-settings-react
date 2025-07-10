import React, { useState, useMemo } from "react";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { TiArrowUnsorted } from "react-icons/ti";
import TableContainer from "@mui/material/TableContainer";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  CircularProgress,
  InputAdornment,
  LinearProgress,
  TableCell,
  TableRow,
  TextField,
  Skeleton,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { RiDeleteBin6Line } from "react-icons/ri";
import StatusTag from "../StatusTag/StatusTag";
import { TableColumntype, TableRowtype, TablePropstype } from "./types";
import ConfirmationModal from "../../UI/ConfirmationModal/ConfirmationModal";
import TablePagination from "@mui/material/TablePagination";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ShowRelations from "../ShowRelations/ShowRelations";
import { formateDataForRelations, TreeNode } from "../../utils/helpers.util";

const TableComponent: React.FC<TablePropstype> = ({
  label,
  columns,
  rows,
  deleteLable,
  handleDelete,
  handleEdit,
  handleDeleteRequest,
}) => {
  const [showRelationsModal, setShowRelationsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRows, setLoadingRows] = useState<number[]>([]);

  const [relationData, setRelationData] = useState({});
  const handleToggleRelationModal = (row?: any) => {
    if (!showRelationsModal) {
      setRelationData(formateDataForRelations(label.split(" ")[1], row));
    } else {
      setRelationData({});
    }
    setShowRelationsModal(!showRelationsModal);
  };

  // Simulate lazy loading
  const simulateLoading = (duration: number = 1500) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), duration);
  };

  // Simulate row-by-row loading
  const simulateRowLoading = (rowIndex: number) => {
    setLoadingRows((prev) => [...prev, rowIndex]);
    setTimeout(() => {
      setLoadingRows((prev) => prev.filter((i) => i !== rowIndex));
    }, 300 + rowIndex * 100);
  };

  const renderCell = (row: TableRowtype, column: TableColumntype) => {
    if (column.id === "name") {
      return (
        <p className="text-gray-800 text-sm font-bold tracking-wide">
          {row[column.id]}
        </p>
      );
    }
    switch (column.type) {
      case "status":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <StatusTag
              tagBackground={`${statusColor(row.status)[0]}`}
              textColor={`${statusColor(row.status)[1]}`}
              tagText={`${statusColor(row.status)[2]}`}
            />
          </div>
        );
      case "actions":
        return renderActions(row);
      case "link":
        return (
          <a
            href={row[column.id]}
            target="_blank"
            className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-700 px-4 py-2 rounded-full hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
          >
            {row[column.id]}
          </a>
        );
      case "date":
        return (
          <span className="text-gray-600 text-sm font-medium">
            {new Date(row[column.id]).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      default:
        return <span className="text-gray-700 text-sm">{row[column.id]}</span>;
    }
  };

  const [selectedRow, setSelectedRow] = useState({ id: "", text: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return Object.keys(row).some((key) =>
        String(row[key]).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [rows, searchQuery]);

  const [showModal, setShowModal] = useState(false);
  const handleShowDelete = (id: string, text: string) => {
    setSelectedRow({ id, text });
    setShowModal(true);
  };

  const renderActions = (row: TableRowtype) => (
    <div className="flex justify-right items-center gap-3 ">
      <div className="p-2 rounded-full bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
        <BorderColorIcon
          style={{
            fontSize: "1.1rem",
            color: "#512CED",
          }}
          className="group-hover:scale-110 transition-transform duration-200"
          onClick={() => handleEdit(row._id)}
        />
      </div>
      <div className="p-2 rounded-full bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
        <RiDeleteBin6Line
          style={{
            fontSize: "1.1rem",
            color: "#ef4444",
          }}
          className="group-hover:scale-110 transition-transform duration-200"
          onClick={() => handleDeleteRequest(row._id, row.name)}
        />
      </div>

      {isShowRelations() && (
        <div
          className="p-2 rounded-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
          onClick={() => handleToggleRelationModal(row)}
        >
          <RemoveRedEyeIcon
            style={{
              fontSize: "1.1rem",
              color: "#3b82f6",
            }}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </div>
      )}
    </div>
  );

  const statusColor = (value: string): String[] => {
    if (value === "ACTIVE") {
      return ["linear-gradient(135deg, #dcfce7, #bbf7d0)", "#166534", "Active"];
    } else if (value === "INVITATION_SENT") {
      return [
        "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        "#1e40af",
        "Invited",
      ];
    } else if (value === "INACTIVE") {
      return [
        "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
        "#6b7280",
        "Inactive",
      ];
    }
    return ["#f9fafb", "#374151"];
  };

  const isShowRelations = () => {
    let heading = label.split(" ")[1];
    if (heading === "Environments" || heading === "Operations") {
      return false;
    }
    return true;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <TableRow className="animate-pulse">
      {columns.map((column, index) => (
        <TableCell key={index} style={{ padding: "16px" }}>
          <Skeleton
            variant="rectangular"
            height={20}
            style={{
              borderRadius: "8px",
              backgroundColor: "#f1f5f9",
            }}
            animation="wave"
          />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="min-h-screen w-full  bg-gradient-to-br from-gray-50 via-white to-gray-100 ">
      <div className=" ">
        <div className="backdrop-blur-sm bg-white/90 border border-gray-200 rounded-2xl shadow-xl shadow-purple-500/5 overflow-hidden">
          <TableContainer>
            {showModal && (
              <ConfirmationModal
                ModalText={`Are you sure you want to delete ${selectedRow?.text}?`}
                buttonText1="Cancel"
                buttonText2="Yes, Delete"
                key={deleteLable}
                handleButton1={() => setShowModal(false)}
                handleButton2={() => {
                  setShowModal(false);
                  handleDelete(selectedRow.id);
                }}
                handleClose={() => setShowModal(false)}
              />
            )}

            {/* Header Section */}
            <div className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse"></div>
                <h4 className="text-xl text-gray-800 font-semibold tracking-wide">
                  {label}
                </h4>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => simulateLoading()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm"
                >
                  Refresh
                </button>
                <div className="flex items-center relative">
                  <TextField
                    className="w-80"
                    size="small"
                    placeholder="Search across all fields..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ color: "#512CED" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: "white",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "500",
                        "& .MuiInputBase-input": {
                          color: "#374151",
                          "&::placeholder": {
                            color: "#9ca3af",
                            opacity: 1,
                          },
                        },
                        "&:hover": {
                          border: "2px solid #512CED",
                        },
                        "&.Mui-focused": {
                          border: "2px solid #512CED",
                          boxShadow: "0 0 0 4px rgba(81, 44, 237, 0.1)",
                        },
                      },
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                  />
                  {searchQuery && (
                    <CloseIcon
                      className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer hover:scale-110 transition-all duration-200"
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Loading Progress Bar */}
            {isLoading && (
              <div className="w-full">
                <LinearProgress
                  sx={{
                    backgroundColor: "#f3f4f6",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#512CED",
                    },
                  }}
                />
              </div>
            )}

            <Table
              style={{
                tableLayout: "fixed",
                width: "100%",
                border: "0.5px solid #512CED",
              }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      className="border-0"
                      style={{
                        width: `${headCell.colWidth}%`,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        backgroundColor: "#f8fafc",
                        borderBottom: "2px solid #e2e8f0",
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "700",
                        padding: "20px 16px",
                      }}
                    >
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-gray-800 font-bold tracking-wide">
                          {headCell.label}
                        </span>
                        <TiArrowUnsorted
                          style={{
                            fontSize: "1rem",
                            color: "#512CED",
                          }}
                          className="hover:text-purple-700 cursor-pointer transition-colors duration-200"
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  // Show loading skeletons
                  Array.from({ length: rowsPerPage }).map((_, index) => (
                    <LoadingSkeleton key={index} />
                  ))
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{ backgroundColor: "white", border: "none" }}
                    >
                      <div className="h-[20vh] w-full flex flex-col justify-center items-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 text-lg font-medium">
                          No data available
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={index}
                        className={`hover:bg-purple-50 transition-all duration-300 cursor-pointer ${
                          loadingRows.includes(index)
                            ? "animate-pulse"
                            : "animate-fade-in"
                        }`}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "white" : "#fafafa",
                          borderBottom: "1px solid #e5e7eb",
                          "&:hover": {
                            backgroundColor: "#faf5ff",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(81, 44, 237, 0.1)",
                          },
                        }}
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${
                            index * 0.05
                          }s both`,
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              borderBottom: "none",
                              padding: "16px",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {loadingRows.includes(index) ? (
                              <Skeleton
                                variant="rectangular"
                                height={16}
                                style={{ borderRadius: "4px" }}
                                animation="wave"
                              />
                            ) : (
                              renderCell(row, column)
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>

            {showRelationsModal && (
              <ShowRelations
                relationData={relationData as TreeNode}
                handleDialogOpen={handleToggleRelationModal}
                width={1200}
                height={600}
                open={true}
              />
            )}

            {/* Pagination Section */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600 font-medium">
                Showing {Math.min(page * rowsPerPage + 1, filteredRows.length)}{" "}
                to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
                {filteredRows.length} results
              </div>
              <TablePagination
                rowsPerPageOptions={[
                  10,
                  25,
                  50,
                  100,
                  { label: "All", value: -1 },
                ]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                sx={{
                  color: "#374151",
                  "& .MuiTablePagination-select": {
                    color: "#374151",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    "&:hover": {
                      border: "1px solid #512CED",
                    },
                  },
                  "& .MuiTablePagination-selectIcon": {
                    color: "#512CED",
                  },
                  "& .MuiIconButton-root": {
                    color: "#512CED",
                    "&:hover": {
                      backgroundColor: "rgba(81, 44, 237, 0.1)",
                    },
                    "&.Mui-disabled": {
                      color: "#d1d5db",
                    },
                  },
                  "& .MuiTablePagination-displayedRows": {
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "500",
                  },
                }}
              />
            </div>
          </TableContainer>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TableComponent;
