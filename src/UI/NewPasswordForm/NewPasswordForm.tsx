"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
    Alert,
    Button,
    CircularProgress,
    FormHelperText,
    IconButton,
    InputAdornment,
    LinearProgress,
    TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChangeEvent,
    FormEvent,
    ReactEventHandler,
    useCallback,
    useEffect,
    useState,
} from "react";
import AuthLayout from "../AuthLayout/AuthLayout";
import "../../../app/styles.css";
import { log } from "console";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ReactFormState } from "react-dom/client";
import {
    calculateStrength,
    getColor,
    getFeedback,
    getHint,
    validatePassword,
} from "@/app/utils/helpers.util";

const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [retypePassword, setRetypePassword] = useState("");
    const [retypePasswordError, setRetypePasswordError] = useState<
        string | null
    >(null);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [strength, setStrength] = useState(0);
    const [buttonLoading, setButtonLoading] = useState(false);

    const router = useRouter();

    const handleTogglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    const handleToggleRetypePasswordVisibility = (): void => {
        setShowRetypePassword(!showRetypePassword);
    };

    const ValidateRetypePassword = (newRetypePassword: String) => {
        // if (password.length > 15) {
        //     setRetypePasswordError(
        //         "Password length should be minimum of 15 characters and make sure to add one number, one special character."
        //     );
        // } 
        if (password !== newRetypePassword) {
            setRetypePasswordError("Password doesn't match!");
        } else {
            setRetypePasswordError(null);
        }
    };

    const passwordHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const newPassword = e.target.value;

        if (password) {
            setError(null);
        }

        setPassword(newPassword);
    };

    const retypePasswordHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const newRetypePassword = e.target.value;

        if (retypePassword) {
            setError(null);
        }

        setRetypePassword(newRetypePassword);
    };

    useEffect(() => {
        if (password) {
            setPasswordError(validatePassword(password, true));
            setStrength(calculateStrength(password));
            if (retypePassword) {
                ValidateRetypePassword(retypePassword);
            }
        }
    }, [password]);

    useEffect(() => {
        ValidateRetypePassword(retypePassword);
    }, [retypePassword]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setEmailError(null);

        if (!password || !retypePassword) {
            setPasswordError("All fields are necessary.");
            return;
        } else if (!passwordError) {
            setError(null);
        } else {
            setPasswordError(null);
            setError(null);
        }

        try {
            const resetPassword = await fetch("api/user/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            if (resetPassword.ok) {
                router.replace("signin");
            }
        } catch (error) {
            setError("Error during changing the password .");
            console.error("Error during updating the password: ", error);
        }
    };

    return (
        <AuthLayout>
            <div className="m-2 w-[25rem] flex flex-col --font-Roboto">
                <form onSubmit={handleSubmit} className="flex flex-col ">
                    <Link href={"/signin"}>
                        <ChevronLeftIcon className="border-2 border-black-200 rounded-md text-3xl mb-2" />
                    </Link>

                    <h1 className="text-2xl font-[500] text-[#0088A4] my-2 ">
                        New password
                    </h1>

                    {error && (
                        <Alert
                            className=" text-sm  my-4"
                            sx={{ color: "#E64646", fontWeight: "500" }}
                            severity="error"
                        >
                            {error}
                        </Alert>
                    )}

                    <p className="text-sm font-extralight text-[#5A5A5A] leading-6 mb-4">
                        Please create a new password that you don’t use on any
                        other site.
                    </p>
                    <label
                        className="text-sm font-light --font-Roboto-300 mb-2"
                        htmlFor="password"
                    >
                        Create new password
                    </label>
                    <TextField
                        autoComplete="off"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={passwordHandler}
                        placeholder="Password"
                        // onBlur={validatePassword}
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        InputProps={{
                            sx: {
                                borderRadius: "10px",
                                height: "3rem",
                                overflow: "hidden",
                                "&.Mui-focused fieldset": {
                                    borderColor: "transparent", // Removes the border color when focused
                                    boxShadow: "0 0 0 2px transparent", // Adds a custom blue shadow
                                },
                            },

                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {password && (
                        <>
                            <LinearProgress
                                variant="determinate"
                                value={strength}
                                sx={{
                                    borderRadius: "0.3em",
                                    margin: "0.5em 0",
                                    height: "8px",
                                    backgroundColor: "#F5F5F5",
                                    "& .MuiLinearProgress-bar": {
                                        background: getColor(
                                            password,
                                            strength
                                        ), // Set the background color dynamically
                                    },
                                }}
                            />
                            <div
                                className="text-xs flex justify-between mb-2"
                                style={{ marginTop: "8px", color: "#898989" }}
                            >
                                <p>{getFeedback(password, strength)} </p>
                                <p className="font-semibold">
                                    {getHint(password, strength)}{" "}
                                </p>
                            </div>
                        </>
                    )}

                    <label
                        className="text-sm font-light --font-Roboto--300 my-2"
                        htmlFor="password"
                    >
                        Confirm new password
                    </label>
                    <TextField
                        autoComplete="off"
                        variant="outlined"
                        type={showRetypePassword ? "text" : "password"}
                        value={retypePassword}
                        onChange={retypePasswordHandler}
                        placeholder="Password"
                        // onBlur={validatePassword}
                        error={Boolean(retypePasswordError)}
                        helperText={retypePasswordError}
                        InputProps={{
                            sx: {
                                borderRadius: "10px",
                                height: "3rem",
                                overflow: "hidden",
                                "&.Mui-focused fieldset": {
                                    borderColor: "transparent", // Removes the border color when focused
                                    boxShadow: "0 0 0 2px transparent", // Adds a custom blue shadow
                                },
                            },

                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={
                                            handleToggleRetypePasswordVisibility
                                        }
                                        edge="end"
                                    >
                                        {showRetypePassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <span className="p-2"></span>
                    <Button
                        className="h-[3.375em] text-lg font-bold my-4 rounded-md"
                        style={{ background: "var(--primary-color" }}
                        variant="contained"
                        type="submit"
                        disabled={buttonLoading}
                        sx={{ boxShadow: "none" }}
                    >
                        {buttonLoading ? (
                            <CircularProgress
                                size={20}
                                style={{ color: "white" }}
                            />
                        ) : (
                            "SEND"
                        )}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default NewPasswordForm;
