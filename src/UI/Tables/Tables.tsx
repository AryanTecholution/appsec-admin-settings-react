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
}) => {
  const [showRelationsModal, setShowRelationsModal] = useState(false);

  const [relationData, setRelationData] = useState({});
  const handleToggleRelationModal = (row?: any) => {
    if (!showRelationsModal) {
      setRelationData(formateDataForRelations(label.split(" ")[1], row));
    } else {
      setRelationData({});
    }
    setShowRelationsModal(!showRelationsModal);
  };
  const renderCell = (row: TableRowtype, column: TableColumntype) => {
    if (column.id === "name") {
      return (
        <p className="text-[#212121] text-sm font-bold">{row[column.id]}</p>
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
            className="bg-gray-100 p-1 px-3 rounded-full hover:underline"
          >
            {row[column.id]}
          </a>
        );
      case "date":
        return new Date(row[column.id]).toLocaleDateString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      default:
        return row[column.id];
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
    <div className="flex justify-right items-center gap-3">
      <BorderColorIcon
        style={{
          fontSize: "1.2rem",
          color: "rgba(57, 61, 96, 1)",
          cursor: "pointer",
        }}
        onClick={() => handleEdit(row._id)}
      />
      <RiDeleteBin6Line
        style={{
          fontSize: "1.2rem",
          color: "rgba(57, 61, 96, 1)",
          cursor: "pointer",
        }}
        onClick={() => handleShowDelete(row._id, row.name)}
      />

      {isShowRelations() && (
        <div onClick={() => handleToggleRelationModal(row)}>
          <RemoveRedEyeIcon
            style={{
              // fontSize: "1.2rem",
              color: "rgba(57, 61, 96, 1)",
              cursor: "pointer",
            }}
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );

  const statusColor = (value: string): String[] => {
    if (value === "ACTIVE") {
      return ["#EBFDF3", "#14BA6D", "Active"];
    } else if (value === "INVITATION_SENT") {
      return ["#E5F0F7", "#80B5D1", "Invited"];
    } else if (value === "INACTIVE") {
      return ["#EDEDED", "#B9B9B9", "Inactive"];
    }
    return ["#FFFFFF", "#000000"];
  };

  const isShowRelations = () => {
    let heading = label.split(" ")[1];
    if (heading === "Environments" || heading === "Operations") {
      return false;
    }
    return true;
  };

  return (
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

      <div
        className={`flex justify-between items-center px-2 py-2 ${
          searchQuery && "pr-4"
        }`}
      >
        <h4 className="text-[18px] text-[212121] font-medium">{label}</h4>
        <div className="flex items-center">
          <TextField
            className="w-96"
            size="small"
            placeholder="Type to search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ color: "#212121" }}>
                    <SearchIcon />
                  </span>
                </InputAdornment>
              ),
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
              className="text-sm z-10 -ml-6 mr-1 bg-gray-300 p-[0.05rem] text-gray-800 rounded-full cursor-pointer hover:shadow-2xl"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      <Table style={{ tableLayout: "auto" }}>
        <TableHead
          style={{
            backgroundColor: "rgba(237, 239, 250, 1)",
            borderRadius: "75rem 0rem 75rem 0rem",
          }}
        >
          <TableRow>
            {columns.map((headCell) => (
              <TableCell
                key={headCell.id}
                className="text-[#212121] text-xs font-semibold border"
                style={{
                  width: `${headCell.colWidth}%`,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                <div className="flex items-center justify-start gap-1">
                  {headCell.label}
                  <TiArrowUnsorted style={{ fontSize: "0.75rem" }} />
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="h-[15vh] w-full flex justify-center items-center">
                  <CircularProgress className="w-full h-full" color="primary" />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(249, 249, 251, 1)",
                    },
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#fff",
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {renderCell(row, column)}
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
      <div className="flex justify-end items-center px-4 bg-[#F4F5F6]">
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, { label: "All", value: -1 }]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </div>
    </TableContainer>
  );
};

export default TableComponent;
