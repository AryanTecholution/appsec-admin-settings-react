"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import AuthLayout from "../AuthLayout/AuthLayout";
import {
    Alert,
    Button,
    CircularProgress,
    FormHelperText,
    InputAdornment,
    LinearProgress,
    TextField,
    Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import "../../../app/styles.css";
import "react-phone-input-2/lib/style.css";

import {
    calculateStrength,
    getColor,
    getFeedback,
    getHint,
    validateEmail,
    validatePassword,
    validatePhoneNumber,
} from "@/app/utils/helpers.util";
import { Router } from "next/router";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import WarningModal from "../WarningModal/WarningModal";
import PhoneInput from "react-phone-input-2";

const AddDetails = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userEmail = searchParams.get("email");
    const redirect_url = searchParams.get("redirect_url");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState<string | null>();
    const [password, setPassword] = useState("");
    const [submitToggle, setSubmitToggle] = useState(false);
    const [preExistingUser, setPreExistingUser] = useState<boolean | null>(
        null
    );
    const [invitedUser, setInvitedUser] = useState<boolean | null>(null);

    const [strength, setStrength] = useState(0);
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [userError, setUserError] = useState({
        firstNameError: "",
        lastNameError: "",
        phoneError: "",

        passwordError: "",
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalView, setModalView] = useState(false);

    // Ensure that router.query is available before accessing it

    useEffect(() => {
        setSubmitToggle(false);
    }, [firstName, lastName, phone]);

    useEffect(() => {
        if (password) {
            setPasswordError(validatePassword(password, true));
        }
        if (phone) {
            setPhoneError(validatePhoneNumber(phone));
        }

        setError("");
    }, [password, email, phone]);

    useEffect(() => {
        if (submitToggle && (!email || !password || !phone)) {
            setPasswordError(validatePassword(password, true));

            setPhoneError(validatePhoneNumber(phone));
        }
    }, [submitToggle]);

    useEffect(() => {
        setStrength(calculateStrength(password));
    }, [password]);

    const passwordHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const emailHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value.toLowerCase());
    };

    const handleTogglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };
    const validateName = (name: string) => {
        // Check if the name is alphabetic and has more than 3 words
        const nameRegex = /^[a-zA-Z ]+$/;

        const words = name.trim();

        if (nameRegex.test(name) && words.length >= 3) {
            return true;
        } else {
            return false;
        }
    };

    const userValidation = async () => {
        setUserError((prevUserError) => ({
            ...prevUserError,
            firstNameError: !firstName ? "Required Field" : "",
            lastNameError: !lastName ? "Required Field" : "",
            phoneError: !phone ? "Required Field" : "",
            passwordError: !password ? "Required Field" : "",
        }));

        if (!firstName || !lastName || !password) {
            // console.log("Names invalid");
            return false;
        }

        const isFirstNameValid = validateName(firstName);
        const isLastNameValid = validateName(lastName);
        const isPhoneInvalid = validatePhoneNumber(phone);
        const isPasswordInvalid = validatePassword(password, false);

        setUserError((prevUserError) => ({
            ...prevUserError,
            firstNameError: isFirstNameValid
                ? ""
                : "Only Alphabetic Value (Min. 3 characters)",
            lastNameError: isLastNameValid
                ? ""
                : "Only Alphabetic Value (Min. 3 characters)",
            phoneError: !Boolean(isPhoneInvalid) ? "" : isPhoneInvalid,
            passwordError: !Boolean(isPasswordInvalid) ? "" : isPasswordInvalid,
        }));

        if (
            !isFirstNameValid ||
            !isLastNameValid ||
            isPhoneInvalid ||
            isPasswordInvalid
        ) {
            return false;
        }
        return true;
    };

    const userDetailFlow = async () => {
        const resUserExists = await fetch("api/userExists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
            }),
        });

        const { user } = await resUserExists.json();
        //console.log(user);

        if (!user) {
            setInvitedUser(false);
            setPreExistingUser(false);
            setModalView(true);
            setError("Email Invite does not exist!");
            return;
        }

        if (user) {
            try {
                const resUserDetails = await fetch("api/user/getone", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user._id,
                    }),
                });

                const userDetails = await resUserDetails.json();
                if (userDetails?.firstName) {
                    setModalView(true);
                    setInvitedUser(false);

                    setPreExistingUser(true);
                } else {
                    setPreExistingUser(false);
                    setInvitedUser(true);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
    };

    useEffect(() => {
        userValidation();
    }, [firstName, lastName, phone, email, password]);

    useEffect(() => {
        userDetailFlow();
        //console.log("preExisting: ", preExistingUser);
        //console.log("inviteUser: ", invitedUser);
    }, []);

    useEffect(() => {
        //console.log("preExisting: ", preExistingUser);
        //console.log("inviteUser: ", invitedUser);
    }, [preExistingUser, invitedUser]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitToggle(true);
        console.log("Clicked");

        // Validate user input
        const validationBool = await userValidation();
        if (!validationBool) {
            //console.log("VALIDATION FAILED!");
            console.log("Validation reror");
            return;
        }

        // Wait for validation to complete
        if (
            userError.firstNameError ||
            userError.lastNameError ||
            userError.phoneError ||
            userError.passwordError
        ) {
            console.log("User error");
            return;
        }

        // If validation passes, proceed with API call
        try {
            setButtonLoading(true);

            const res = await fetch("api/user/add-details", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    email: userEmail,
                    phone,
                    password,
                }),
            });
console.log("Api called");
            const resJson = await res.json();
            //console.log("invite: ", resJson);

            if (resJson.status == 200) {
                // if(redirect_url) {
                //     window.location.href = `/signin?redirect_url=${redirect_url}`
                // }
                console.log(
                    "----------redirect_url is----------",
                    redirect_url
                );

                window.location.href = redirect_url
                    ? `/signin?redirect_url=${redirect_url}`
                    : "/signin";
                setError("");
            } else {
                setError(resJson.message);
                //console.log("User registration failed.");
                return;
            }
        } catch (error) {
            //console.log("Error during registration: ", error);
            setError("Error during registration");
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className=" w-[23.125rem] --font-Roboto ">
                {error && (
                    <Alert
                        className=" text-sm  my-4"
                        sx={{ color: "#E64646", fontWeight: "500" }}
                        severity="error"
                    >
                        {error}
                    </Alert>
                )}
                {preExistingUser == null && invitedUser == null && (
                    <div className=" z-50 absolute top-0 left-0 bg-gray-900 opacity-100 h-[100vh] w-[100vw] flex justify-center items-center">
                        <CircularProgress />
                    </div>
                )}
                {preExistingUser !== null &&
                    invitedUser !== null &&
                    !invitedUser && (
                        <WarningModal ModalText="Email User does not have permission to access this application!" />
                    )}

                {preExistingUser && !invitedUser ? (
                    <div>
                        <WarningModal
                            ModalText="User details already in server ! "
                            buttonText1="Proceed"
                            handleButton1={() => {
                                router.push("/signin");
                            }}
                        />
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col my-12 "
                    >
                        <h1 className="text-2xl font-medium  text-[#0088A4]  ">
                            Add Details
                        </h1>
                        <div className="flex justify-between gap-6 ">
                            <div className="flex flex-col">
                                <label
                                    className="text-sm font-[300]  mt-6 mb-2"
                                    htmlFor="email"
                                >
                                    First Name
                                </label>

                                <TextField
                                    autoComplete="off"
                                    className=" rounded-md"
                                    InputProps={{
                                        sx: {
                                            borderRadius: "10px",
                                            height: "3rem",
                                            overflow: "hidden",
                                            "&.Mui-focused fieldset": {
                                                borderColor: "transparent", // Removes the border color when focused
                                                boxShadow:
                                                    "0 0 0 2px transparent", // Adds a custom blue shadow
                                            },
                                        },
                                    }}
                                    FormHelperTextProps={{
                                        style: {
                                            margin: "2px 0px",
                                        },
                                    }}
                                    variant="outlined"
                                    placeholder="First Name"
                                    type="text"
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    error={
                                        submitToggle &&
                                        Boolean(userError.firstNameError)
                                    }
                                    helperText={
                                        submitToggle && userError.firstNameError
                                    }
                                />
                            </div>

                            <div className="flex flex-col">
                                <label
                                    className="text-sm font-[300]  mt-6 mb-2"
                                    htmlFor="email"
                                >
                                    Last Name
                                </label>
                                <TextField
                                    autoComplete="off"
                                    className="rounded-md"
                                    InputProps={{
                                        sx: {
                                            borderRadius: "10px",
                                            height: "3rem",
                                            overflow: "hidden",
                                            "&.Mui-focused fieldset": {
                                                borderColor: "transparent", // Removes the border color when focused
                                                boxShadow:
                                                    "0 0 0 2px transparent", // Adds a custom blue shadow
                                            },
                                        },
                                    }}
                                    FormHelperTextProps={{
                                        style: {
                                            margin: "2px 0px",
                                        },
                                    }}
                                    variant="outlined"
                                    placeholder="Last Name"
                                    type="text"
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    error={
                                        submitToggle &&
                                        Boolean(userError.lastNameError)
                                    }
                                    helperText={
                                        submitToggle && userError.lastNameError
                                    }
                                />
                            </div>
                        </div>
                        <label
                            className="text-sm font-[300]  mt-6 mb-2"
                            htmlFor="email"
                        >
                            Email address
                        </label>
                        <TextField
                            autoComplete="off"
                            className=" rounded-md"
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
                            }}
                            FormHelperTextProps={{
                                style: {
                                    margin: "2px 0px",
                                },
                            }}
                            variant="outlined"
                            value={userEmail}
                            placeholder="Your Email"
                            type="email"
                            onChange={emailHandler}
                            disabled
                        />
                        <label
                            className="text-sm font-[300]  mt-6 mb-2"
                            htmlFor="email"
                        >
                            Phone
                        </label>
                        <PhoneInput
                            country={"in"} // default country code
                            value={phone || ""} // ensure non-null value to avoid warnings
                            onChange={(phone) => setPhone(phone)} // phone here will be a string
                            inputStyle={{
                                borderRadius: "10px",
                                height: "3rem",
                                width: "100%",
                            }}
                            containerStyle={{
                                width: "100%",
                            }}
                            inputProps={{
                                name: "phone",
                                required: true,
                                autoFocus: true,
                            }}
                            placeholder="Your Phone"
                        />
                        <label
                            className="text-sm font-[300]  mt-6 mb-2"
                            htmlFor="email"
                        >
                            Create Password
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
                                            onClick={
                                                handleTogglePasswordVisibility
                                            }
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
                            FormHelperTextProps={{
                                style: {
                                    margin: "2px 0px",
                                },
                            }}
                        />

                        {password && (
                            <div className="my-4">
                                <LinearProgress
                                    variant="determinate"
                                    value={strength}
                                    sx={{
                                        borderRadius: "0.1em",
                                        margin: "0.5em 0",
                                        height: "8px",
                                        backgroundColor: "#F5F5F5",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: `${getColor(
                                                password,
                                                strength
                                            )}`,
                                            color: "white",
                                        },
                                        // background: `linear-gradient(90deg, ${getColor()} ${strength}%, transparent ${strength}%)`,
                                    }}
                                />
                                <div
                                    className="text-xs flex justify-between"
                                    style={{
                                        marginTop: "8px",
                                        color: "#898989",
                                    }}
                                >
                                    <p>{getFeedback(password, strength)} </p>
                                    <p className="font-semibold">
                                        {getHint(password, strength)}{" "}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: "1.25rem" }}>
                            <Button
                                className="h-[3.375em] w-full text-lg font-bold  rounded-md"
                                style={{
                                    background: "var(--primary-color)",
                                    marginBottom: "3px",
                                }}
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
                                    "SAVE"
                                )}
                            </Button>
                        </div>

                        <p className="flex justify-center font-light text-sm mt-4 text-right">
                            Already have an account?
                            <Link
                                className=" no-underline px-2 text-[var(--primary-color)] font-semibold"
                                href={"/signin"}
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default AddDetails;
