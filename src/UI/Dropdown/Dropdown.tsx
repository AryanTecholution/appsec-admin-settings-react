import React, { useState, useRef, useEffect, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import {
    FormHelperText,
    InputAdornment,
    ListItemText,
    ListSubheader,
    TextField,
    Tooltip,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";

interface DropdownProps<T> {
    dropdownText: any;
    creationText?: string;
    dropdownLabel: string;
    creationFunction?: () => void;
    // optionFunction: (object: T) => void;
    objects: T[] | string[];
    selectedObjects: any[];
    setSelectedObjects: any;
    disable?: boolean;
    clearProp: boolean;
    selectedObjectType?: string;
    error?: string | null;
    tooltip?: string | null;
    highlight?: "primary" | "secondary";
}

const Dropdown = <T extends { name: string }>({
    dropdownText,
    creationText,
    creationFunction,
    // optionFunction,
    dropdownLabel,
    objects,
    selectedObjects,
    setSelectedObjects,
    disable,
    selectedObjectType = "object",
    clearProp,
    error,
    tooltip,
    highlight,
}: DropdownProps<T>) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
    const [searchedObjects, setSearchedObjects] = useState<any[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    // console.log("selected chips are:", selectedChips);

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value); // Update search query on change
    };

    const filteredRows = useMemo(() => {
        return objects?.filter((object: any) => {
            if (selectedObjectType === "array") {
                return object.toLowerCase().includes(searchQuery.toLowerCase());
            } else {
                return object.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            }
        });
    }, [objects, searchQuery]);

    useEffect(() => {
        setSelectedObjects([]);
        setSelectedObjectIds([]);
    }, [clearProp]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleSelectObject = (object: any) => {
        // Using `any` for simplicity; consider using a more specific type
        if (selectedObjects === null) {
            setSelectedObjects([object]);
            return;
        }

        //console.log(selectedObjects);
        //console.log(object);

        // Determine how to check if the object is already selected based on the selectedObjectType
        let isObjectSelected;
        if (selectedObjectType === "object") {
            // Use a property of the object to check if it is already selected
            // Assuming 'name' is a unique identifier for each object
            isObjectSelected = selectedObjects.some(
                (selected: { name: string }) => selected.name === object.name
            );
        } else if (selectedObjectType === "array") {
            // Direct string comparison if selectedObjects is an array of strings
            isObjectSelected = selectedObjects.includes(object);
        }

        //console.log(isObjectSelected);

        if (isObjectSelected) {
            // Filter out the object or string if it is already selected
            let updatedSelectedObjects;
            if (selectedObjectType === "object") {
                updatedSelectedObjects = selectedObjects.filter(
                    (selected: { name: string }) =>
                        selected.name !== object.name
                );
            } else if (selectedObjectType === "array") {
                updatedSelectedObjects = selectedObjects.filter(
                    (selected: string) => selected !== object
                );
            }

            //console.log(updatedSelectedObjects);
            setSelectedObjects(updatedSelectedObjects);
        } else {
            // If the object or string is not selected, add it
            setSelectedObjects([...selectedObjects, object]);
        }
    };

    const handleSelectOption = (object: T) => {
        handleSelectObject(object);
    };

    return (
        <div className="flex flex-row">
            <div className="mx-1 relative ">
                <h4 className="text-[12px] text-[#212121] pb-1 font-bold">
                    {dropdownLabel}
                </h4>
                <FormControl sx={{ m: 0 }} style={{ minWidth: 240 }}>
                    {!isDropdownOpen && selectedObjects?.length == 0 && (
                        <InputLabel
                            id="demo-multiple-checkbox-label"
                            className="-mt-1"
                            style={{
                                color: disable
                                    ? "#C6C6C6"
                                    : "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            {dropdownText}
                        </InputLabel>
                    )}
                    <Tooltip title={disable ? tooltip || "acasd" : ""} arrow>
                        <Select
                            MenuProps={{ autoFocus: false }}
                            labelId="demo-multiple-checkbox-label"
                            multiple
                            onFocus={() => setDropdownOpen(true)}
                            onClose={() => {
                                setDropdownOpen(false);
                                setSearchQuery("");
                            }}
                            error={Boolean(error)}
                            id="demo-multiple-checkbox"
                            placeholder={dropdownText}
                            value={selectedObjects}
                            input={<OutlinedInput placeholder="dd" />}
                            renderValue={(selected) => {
                                // Check if there are any selected items
                                if (selectedObjects.length === 0) {
                                    return <>{dropdownText}</>; // Return the default dropdown text if no items are selected
                                } else {
                                    // Map over the selected array to extract the 'name' property from each object and join them with a comma
                                    if (selectedObjectType == "array") {
                                        return selectedObjects.join(", ");
                                    }
                                    return selectedObjects
                                        .map((item: any) => item.name)
                                        .join(", ");
                                }
                            }}
                            className="flex justify-between items-center "
                            disabled={disable}
                            style={{
                                borderRadius: "0.5rem",
                                color: error
                                    ? "#FF0000"
                                    : disable
                                    ? "#C6C6C6"
                                    : "rgba(0, 0, 0, 0.5)",
                                width: "20.125rem",
                                background: "#FBFBFB",
                                borderColor: error
                                    ? "#FF0000"
                                    : disable
                                    ? "#C6C6C6"
                                    : "#D8DADC",
                                gap: "0.625rem",
                                height: "3rem",
                                padding: "0 0rem",
                                display: "flex",
                                alignItems: "center",
                                border: highlight && "black solid 1px",
                            }}
                            // MenuProps={MenuProps}
                        >
                            <ListSubheader>
                                <TextField
                                    size="small"
                                    // Autofocus on textfield
                                    autoFocus
                                    placeholder="Type to search..."
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    style={{ color: "#212121" }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={handleSearchChange}
                                    onKeyDown={(e) => {
                                        if (e.key !== "Escape") {
                                            // Prevents autoselecting item while typing (default Select behaviour)
                                            e.stopPropagation();
                                        }
                                    }}
                                />
                            </ListSubheader>
                            {filteredRows?.map((object: any, index) => (
                                <MenuItem
                                    key={index}
                                    value={
                                        selectedObjectType == "array"
                                            ? object
                                            : object.name
                                    }
                                    onClick={() => handleSelectOption(object)}
                                >
                                    <Checkbox
                                        checked={selectedObjects?.some(
                                            (selectedObject: any) => {
                                                if (
                                                    selectedObjectType ===
                                                    "array"
                                                ) {
                                                    // Assuming `object` is the current item from another list you're comparing against
                                                    if (
                                                        typeof object ===
                                                        "string"
                                                    ) {
                                                        return selectedObjects.includes(
                                                            object
                                                        );
                                                    }
                                                    // If `object` is more complex but you're looking for a string match, adjust accordingly
                                                    // Example: return selectedObjects.includes(object.someProperty);
                                                }
                                                if (
                                                    typeof selectedObject ===
                                                        "object" &&
                                                    selectedObject.hasOwnProperty(
                                                        "name"
                                                    )
                                                ) {
                                                    // Check if the selectedObject is an object with a 'name' property
                                                    // Check if the object is an array and its first element matches the name
                                                    if (
                                                        Array.isArray(object) &&
                                                        object.length > 0
                                                    ) {
                                                        return (
                                                            selectedObject.name ===
                                                            object[0]
                                                        );
                                                    }
                                                    // Check if the selectedObject's name matches the object's name property
                                                    return (
                                                        selectedObject.name ===
                                                        object.name
                                                    );
                                                } else {
                                                    // Fallback to the default check (assuming object is a string)
                                                    return (
                                                        selectedObject ===
                                                        object
                                                    );
                                                }
                                            }
                                        )}
                                    />
                                    <ListItemText
                                        primary={
                                            selectedObjectType == "array"
                                                ? object
                                                : object.name
                                        }
                                    />
                                </MenuItem>
                            ))}
                            {creationText && (
                                <MenuItem
                                    onClick={creationFunction}
                                    // sx={{
                                    //     color: "#5E6EDC",
                                    //     boxShadow: "0px 0 6px 0   #BDBDBC",
                                    // }}
                                    key={objects?.length}
                                >
                                    <AddIcon sx={{ color: "#5E6EDC" }} />
                                    {creationText}
                                </MenuItem>
                            )}
                        </Select>
                    </Tooltip>
                </FormControl>

                {error && (
                    <p
                        className=" text-[12px] font-base absolute top-[100%] mt-1"
                        style={{ color: "#E64646" }}
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
