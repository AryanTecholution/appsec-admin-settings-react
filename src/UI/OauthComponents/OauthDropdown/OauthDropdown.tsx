import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {  InputAdornment, ListSubheader, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface DropdownProps {
    options: any[];
    label: string;
    required?: boolean;
    placeholder: string;
    onSelect: (value: string) => void;
}

const OauthDropdown: React.FC<DropdownProps> = ({
    options,
    placeholder,
    label,
    required,
    onSelect,
}) => {
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = useMemo(() => {
        return options?.filter((object: any) => {
            return object.name.toLowerCase().includes(searchQuery.toLowerCase())    
        })
    }, [options, searchQuery])

    const handleChange = (object: any) => {
        setSelectedValue(object.name)
        onSelect(object)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value); // Update search query on change
    };

    const renderSelectedValue = (selected: string) => {
        const selectedOption = options.find(
            (option) => option.name === selected
        );
        if (!selectedOption) return placeholder;

        return (
            <div className="flex items-center">
                {selectedOption.logo && (
                    <Image
                        src={selectedOption.logo}
                        alt=""
                        className="mr-2 w-[1.35rem] h-[1.35rem]"
                    />
                )}
                {selectedOption.name}
            </div>
        );
    };

    return (
        <div>
            <label
                className="block text-[0.9rem] font-[500] text-[#3C8B98] mb-2"
                htmlFor="dropdown"
            >
                {label}
                {required ? (
                    <span className="text-[0.9rem] font-[500] text-[#BA1414]">
                        *
                    </span>
                ) : null}
            </label>
            <Select
                id="dropdown"
                sx={{ border: "none" }}
                value={selectedValue}
               // onChange={handleChange}
                displayEmpty
                className="min-w-[25.5rem] h-[2.675rem] rounded-[0.5rem] border border-[#D8DADC] bg-white"
                MenuProps={{
                    PaperProps: {
                        style: {
                            marginTop: 4,
                        },
                    },
                }}
                renderValue={
                    selectedValue ? renderSelectedValue : () => placeholder
                }
                IconComponent={KeyboardArrowDownIcon}
                onClose={() => {
                    setSearchQuery("")
                }}
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
                            <SearchIcon style={{ color: '#212121' }} />
                        </InputAdornment>
                        )
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
                {filteredRows?.map((option:any, index:any) => (
                    <MenuItem
                        key={index}
                        value={option.name}
                        style={{
                            background: "white",
                            fontSize: "0.875rem",
                        }}
                        onClick={() => handleChange(option)}
                    >
                        {option.logo && (
                            <Image
                                src={option.logo}
                                alt=""
                                className="mr-2 w-[1.35rem] h-[1.35rem]"
                            />
                        )}
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default OauthDropdown;
