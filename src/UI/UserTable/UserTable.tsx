import React from "react";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { TiArrowUnsorted } from "react-icons/ti";
import TableContainer from "@mui/material/TableContainer";
import { TableCell, TableRow } from "@mui/material";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { RiDeleteBin6Line } from "react-icons/ri";
import StatusTag from "../StatusTag/StatusTag";
interface HeadCell {
    id: string;
    label: string;
    type: string;
    colWidth: number;
}

const headCells: HeadCell[] = [
    { id: "name", label: "NAME", type: "text", colWidth: 5 },
    { id: "email", label: "EMAIL", type: "email", colWidth: 3 },
    { id: "status", label: "STATUS", type: "string", colWidth: 3 },
    { id: "role", label: "ROLE", type: "string", colWidth: 3 },

    { id: "invited", label: "INVITED ON", type: "date", colWidth: 3 },
    { id: "joined", label: "JOINED ON", type: "date", colWidth: 3 },
    { id: "actions", label: "ACTIONS", type: "button", colWidth: 3 },
];

function createData(
    name: string,
    email: string,
    status: string,
    role: string,
    invite: Date,
    joined: Date,
    actions: string
) {
    return { name, email, status, role, invite, joined, actions };
}
interface Props {
    label: string;
}

const UserTable: React.FC<Props> = ({ label }) => {
    const rows = [
        createData(
            "Aryan",
            "arya@techolution.com",
            "Active",
            "User",
            new Date(1, 1, 2024),
            new Date(1, 9, 2024),
            "ED"
        ),
        createData(
            "Aryann",
            "aryan@techolution.com",
            "Active",
            "User",
            new Date(31, 1, 2024),
            new Date(12, 2, 2024),
            "ED"
        ),
        createData(
            "Aryannn",
            "aryann@techolution.com",
            "Inactive",
            "User",
            new Date(12, 11, 2024),
            new Date(21, 9, 2024),
            "ED"
        ),
        createData(
            "Aryannnn",
            "aryannn@techolution.com",
            "Invite Sent",
            "User",
            new Date(21, 10, 2024),
            new Date(12, 7, 2024),
            "ED"
        ),
        createData(
            "Aryannnnn",
            "aryannnn@techolution.com",
            "Invite Sent",
            "User",
            new Date(1, 9, 2024),
            new Date(13, 9, 2024),
            "ED"
        ),
    ];

    const statusColor = (value: string): String[] => {
        if (value === "Active") {
            return ["#EBFDF3", "#14BA6D"];
        } else if (value === "Invite Sent") {
            return ["#E5F0F7", "#80B5D1"];
        } else if (value === "Inactive") {
            return ["#EDEDED", "#B9B9B9"];
        }
        return ["#FFFFFF", "#000000"];
    };

    const handleDelete = () => {};

    const handleEdit = () => {};

    return (
        <TableContainer>
            <h4 className="text-[16px] text-[#747474] pb-4 font-medium">
                {label}
            </h4>
            <Table>
                <TableHead
                    style={{
                        backgroundColor: "rgba(228, 231, 233, 0.4)",
                        borderRadius: "75rem 0rem 0rem 0rem",
                    }}
                >
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox color="primary" />
                        </TableCell>
                        {headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                className="text-[#727271] text-xs font-semibold "
                            >
                                <div className="flex items-center justify-start gap-1">
                                    {headCell.label}
                                    <TiArrowUnsorted
                                        style={{ fontSize: "0.75rem" }}
                                    />
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="default"
                                    sx={{
                                        [`&, &.${checkboxClasses.checked}`]: {
                                            color: "#fff",
                                            border: "none",
                                        },
                                        [`&, &.${checkboxClasses.root}`]: {
                                            color: "#fff",
                                            fill: "#000",
                                            border: "none",
                                        },
                                        " & .css-i4bv87-MuiSvgIcon-root": {
                                            background: "#000",
                                            width: "0.7em",
                                            height: "0.7em",
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                            <TableCell>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <StatusTag
                                        tagBackground={`${
                                            statusColor(row.status)[0]
                                        }`}
                                        textColor={`${
                                            statusColor(row.status)[1]
                                        }`}
                                        tagText={`${
                                            statusColor(row.status)[2]
                                        }`}
                                    />
                                </div>
                            </TableCell>

                            <TableCell component="th" scope="row">
                                {row.role}
                            </TableCell>
                            <TableCell align="left">
                                {row.invite instanceof Date &&
                                    row.invite.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                    })}
                            </TableCell>
                            <TableCell align="left">
                                {row.joined instanceof Date &&
                                    row.joined.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                    })}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-right items-center gap-3">
                                    <BorderColorIcon
                                        onClick={handleEdit}
                                        className="pointer"
                                        style={{
                                            fontSize: "1.2rem",
                                            color: "#3E6EDC",
                                            cursor: "pointer",
                                        }}
                                    />{" "}
                                    <RiDeleteBin6Line
                                        onClick={handleDelete}
                                        style={{
                                            fontSize: "1.2rem",
                                            color: "#D37576",
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;
