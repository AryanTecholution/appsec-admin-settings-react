// Exporting the TableColumn interface
export interface TableColumntype {
  id: string;
  label: string;
  type: "text" | "email" | "date" | "status" | "actions" | "link";
  colWidth?: number;
}

// Exporting the TableRow interface
export interface TableRowtype {
  [key: string]: any; // Using an index signature to allow any property names
}

// Exporting the UserTableProps interface
export interface TablePropstype {
  label: string;
  columns: TableColumntype[];
  rows: TableRowtype[];
  deleteLable: string;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDeleteRequest: any;
}
