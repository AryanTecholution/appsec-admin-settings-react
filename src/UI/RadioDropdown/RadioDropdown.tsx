import React, { useMemo, useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import { SxProps } from "@mui/system";
import { Radio } from "@mui/material";

interface RadioDropdownProps {
    dropdownText: string;
    radioType?: boolean;
    creationText?: string;
    sx?: SxProps;
    dropdownLabel: string;
    creationFunction?: () => void;
    objects: Array<{ name: string }>;
    selectedObject: { name: string } | null;
    setSelectedObjects: (object: { name: string }) => void;
    error?: string | null;
    highlight?: "primary" | "secondary";
    disabled?:boolean
}

const RadioDropdown: React.FC<RadioDropdownProps> = ({
    dropdownText,
    radioType,
    creationText,
    sx,
    dropdownLabel,
    creationFunction,
    objects,
    selectedObject,
    setSelectedObjects,
    error,
    highlight,
    disabled=false
}) => {
    console.log("Radio Error", error);

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value); // Update search query on change
    };

    const filteredRows = useMemo(() => {
        return objects?.filter((object: any) => {
            return object.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        });
    }, [objects, searchQuery]);

    const handleSelectObject = (object: any) => {
        setSelectedObjects(object);
        setSearchQuery("");
        setOpen(false);
    };

    return (
        <FormControl
            variant="outlined"
            fullWidth
            size="small"
            error={Boolean(error)}
            style={{ minWidth: 240 }}
        >
            {/* Dropdown label */}
            <h4 className="text-[12px] text-[#212121] pb-1 font-bold">
                {dropdownLabel}
            </h4>
            {/* Select dropdown */}
            <Select
                disabled={disabled}
                error={Boolean(error)}
                MenuProps={{ autoFocus: false }}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                value={selectedObject ? selectedObject.name : ""}
                displayEmpty
                renderValue={(selected) => {
                    if (!selectedObject?.name) {
                        return dropdownText;
                    }
                    return selectedObject.name as string;
                }}
                IconComponent={ArrowDropDownIcon}
                className="flex justify-between items-center border-1"
                style={{
                    borderRadius: ".5rem",
                    outline: "0rem",
                    color: error
                        ? "rgba(0, 0, 0, 0.5)"
                        : disabled
                        ? "#C6C6C6"
                        : "rgba(0, 0, 0, 0.5)",
                    width: "20.125rem",
                    background: "#FBFBFB",
                    borderColor: error
                        ? "#FF0000"
                        : disabled
                        ? "#C6C6C6"
                        : "#D8DADC",
                    gap: "0.625rem",
                    height: "3rem",
                    padding: "0 0rem",
                    display: "flex",
                    alignItems: "center",
                    // border: highlight && "black solid .1px",
                }}
                sx={{
                    ...sx,
                }}
            >
                <TextField
                    size="small"
                    autoFocus
                    placeholder="Type to search..."
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                            e.stopPropagation(); // Prevents autoselecting item while typing
                        }
                    }}
                />
                {/* Menu items */}
                {filteredRows?.map((object, index) => (
                    <MenuItem
                        key={index}
                        value={object.name}
                        onClick={() => handleSelectObject(object)}
                    >
                        <Radio
                            color="default"
                            checked={object.name === selectedObject?.name}
                        />
                        <ListItemText primary={object.name} />
                    </MenuItem>
                ))}
                {/* Create new option */}
                {creationText && (
                    <MenuItem onClick={creationFunction}>
                        <ListItemIcon>
                            <AddIcon sx={{ color: "#5E6EDC" }} />
                        </ListItemIcon>
                        <ListItemText primary={creationText} />
                    </MenuItem>
                )}
            </Select>

            {/* Error message */}
            {error && (
                <p
                    className=" text-[12px] font-base absolute top-[100%] mt-1"
                    style={{ color: "#E64646" }}
                >
                    {error}
                </p>
            )}
        </FormControl>
    );
};

export default RadioDropdown;
