"use client";

import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useRouter, useSearchParams } from "next/navigation";
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
import {
    calculateStrength,
    getColor,
    getFeedback,
    getHint,
    validateEmail,
    validatePassword,
    validatePhoneNumber,
} from "@/app/utils/helpers.util";

const RegisterForm = () => {
    const searchParams = useSearchParams();

    const redirect_url = searchParams.get("redirect_url") || "/dashboard";
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [submitToggle, setSubmitToggle] = useState(false);

    const [strength, setStrength] = useState(0);
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [userError, setUserError] = useState({
        firstNameError: "",
        lastNameError: "",
        phoneError: "",
        emailError: "",
        passwordError: "",
    });
    const [buttonLoading, setButtonLoading] = useState(false);

    const router = useRouter();
    useEffect(() => {
        setSubmitToggle(false);
    }, [firstName, lastName, phone]);

    // * Removed Resource Alignment Specific Sign Up with Global SignUp

    // useEffect(() => {
    //     if (redirect_url !== "https://resource-alignment.techo.camp") {
    //         router.push(`/signin?redirect_url=${redirect_url}`);
    //     }
    // }, []);

    useEffect(() => {
        if (email) {
            setEmailError(validateEmail(email));
        }
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
            setEmailError(validateEmail(email));
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

    const userValidation = () => {
        // Reset errors
        setUserError({
            firstNameError: "",
            lastNameError: "",
            phoneError: "",
            emailError: "",
            passwordError: "",
        });

        if (!firstName || !lastName || !email || !password) {
            setUserError({
                firstNameError: !firstName ? "Required Field" : "",
                lastNameError: !lastName ? "Required Field" : "",
                phoneError: !phone ? "Required Field" : "",
                emailError: !email ? "Required Field" : "",
                passwordError: !password ? "Required Field" : "",
            });
        } else {
            const isFirstNameValid = validateName(firstName);
            const isLastNameValid = validateName(lastName);
            console.log(phone);

            const isPhoneInvalid = validatePhoneNumber(phone);
            const isEmailInvalid = validateEmail(email);
            const isPasswordInvalid = validatePassword(password, false);

            // Update errors in the state based on validation
            setUserError({
                firstNameError: isFirstNameValid
                    ? ""
                    : "Only Alphabetic Value (Min. 3 characters)",
                lastNameError: isLastNameValid
                    ? ""
                    : "Only Alphabetic Value (Min. 3 characters)",
                phoneError: !Boolean(isPhoneInvalid) ? "" : isPhoneInvalid,
                emailError: !Boolean(isEmailInvalid) ? "" : isEmailInvalid,
                passwordError: !Boolean(isPasswordInvalid)
                    ? ""
                    : isPasswordInvalid,
            });

            // Check if any field has an error
            if (
                !isFirstNameValid ||
                !isLastNameValid ||
                isPhoneInvalid ||
                isPasswordInvalid ||
                isEmailInvalid
            ) {
                return;
            }
        }
    };

    useEffect(() => {
        userValidation();
    }, [firstName, lastName, phone, email, password]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitToggle(true);
        console.log("Submit");

        // Wait for userValidation to complete

        if (
            userError.firstNameError ||
            userError.lastNameError ||
            userError.phoneError ||
            userError.emailError ||
            userError.passwordError
        ) {
            console.log("error");

            return;
        }
        if (email) {
            const emailDomain = email.split("@")[1].split(".")[0];
        }
        try {
            setButtonLoading(true);

            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("Email already in use.");
                return;
            }

            const res = await fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    email,
                    phone,
                    password,
                }),
            });

            const register = await res.json();

            if (res.ok) {
                // const form = e.currentTarget;
                // form.reset();

                // * Removed Resource Alignment Specific Sign Up with Global SignUp

                // if (redirect_url == "https://resource-alignment.techo.camp") {
                //     router.push(`/signin?redirect_url=${redirect_url}`);
                //     return;
                // }
                router.replace("/dashboard");
                setError("");
            } else {
                setError(register.message);
                //console.log("User registration failed.");
            }
        } catch (error) {
            console.error("Error during registration: ", error);
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

                <form onSubmit={handleSubmit} className="flex flex-col my-12 ">
                    <h1 className="text-2xl font-[500] text-[#0088A4] --font-Roboto">
                        Sign up
                    </h1>
                    <div className="flex justify-between gap-6 ">
                        <div className="flex flex-col">
                            <label
                                className="text-sm font-[300]  mt-6 mb-2"
                                htmlFor="first name"
                            >
                                First Name
                            </label>

                            <TextField
                                autoComplete="off"
                                className="rounded-md"
                                InputProps={{
                                    style: {
                                        borderRadius: "10px",
                                        height: "3rem",
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
                                onChange={(e) => setFirstName(e.target.value)}
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
                                htmlFor="last name"
                            >
                                Last Name
                            </label>
                            <TextField
                                autoComplete="off"
                                className="rounded-md"
                                InputProps={{
                                    style: {
                                        borderRadius: "10px",
                                        height: "3rem",
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
                                onChange={(e) => setLastName(e.target.value)}
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
                        className="rounded-md"
                        InputProps={{
                            style: {
                                borderRadius: "10px",
                                height: "3rem",
                            },
                        }}
                        FormHelperTextProps={{
                            style: {
                                margin: "2px 0px",
                            },
                        }}
                        variant="outlined"
                        placeholder="Your Email"
                        type="email"
                        onChange={emailHandler}
                        error={Boolean(emailError)}
                        helperText={submitToggle && emailError}
                    />
                    <label
                        className="text-sm font-[300] mt-6 mb-2"
                        htmlFor="phone"
                    >
                        Phone
                    </label>
                    <PhoneInput
                        country={"in"} // default country code
                        value={phone || ""} // ensure non-null value to avoid warnings
                        onChange={(phone: string) => setPhone(phone)} // phone here will be a string
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
                        htmlFor="password"
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
                            style: {
                                borderRadius: "10px",
                                height: "3rem",
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
                        FormHelperTextProps={{
                            style: {
                                margin: "2px 0px",
                            },
                        }}
                    />

                    {password && password.length <= 15 && (
                        <>
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
                                style={{ marginTop: "8px", color: "#898989" }}
                            >
                                <p>{getFeedback(password, strength)} </p>
                                <p className="font-semibold">
                                    {getHint(password, strength)}{" "}
                                </p>
                            </div>
                        </>
                    )}

                    <Button
                        className="h-[3.375em] text-lg font-bold my-4 rounded-md"
                        style={{
                            background: "var(--primary-color)",
                            margin: "1rem 0",
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
                            "SIGN UP"
                        )}
                    </Button>

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
            </div>
        </AuthLayout>
    );
};

export default RegisterForm;
