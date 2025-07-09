"use client";

import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

interface TableMetaData {
    columns: GridColDef[];
    rows: any[];
}

export default function DataTable({ rows, columns }: TableMetaData) {
    return (
        <div style={{ height: "auto", width: "100%" }}>
            <DataGrid
                getRowId={(row) => row._id}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 25, 50]}
            />
        </div>
    );
}
