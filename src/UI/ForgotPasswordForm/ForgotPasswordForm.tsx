"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
    Alert,
    Button,
    CircularProgress,
    FormHelperText,
    TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    FocusEvent,
    FormEvent,
    ReactEventHandler,
    useEffect,
    useState,
} from "react";
import AuthLayout from "../AuthLayout/AuthLayout";
import "../../../app/styles.css";
import { log } from "console";
import { validateEmail } from "@/app/utils/helpers.util";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setEmailError(null);
    }, [email]);

    const emailHandler = (e: FocusEvent<HTMLInputElement>): void => {
        let email = e.target.value;

        setEmailError(validateEmail(email));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // setEmailError(null);

        if (!email) {
            setEmailError("All fields are necessary.");
            return;
        } else if (emailError) {
            setError(null);
            return;
        } else {
            setEmailError(null);
            setError(null);
        }

        try {
            setButtonLoading(true);
            const response = await fetch("api/user/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const forgotpassword = await response.json();

            if (forgotpassword.status == 200) {
                router.replace("/");
            } else {
                setError(forgotpassword.message);
            }
        } catch (error: any) {
            setError(error.message);
            console.error(
                "Error while sending the reset password link: ",
                error
            );
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="m-2 w-[25rem] flex flex-col --font-Roboto">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col "
                    noValidate
                >
                    {error && (
                        <Alert
                            className=" text-sm  my-4"
                            sx={{ color: "#E64646", fontWeight: "500" }}
                            severity="error"
                        >
                            {error}
                        </Alert>
                    )}

                    <Link href={"/signin"}>
                        <ChevronLeftIcon className="border-2 border-black-200 rounded-md text-3xl mb-2" />
                    </Link>
                    <h1 className="text-2xl font-[500]  text-[#0088A4] my-2 ">
                        Forgot password?
                    </h1>
                    <div className="text-sm font-light text-[#5A5A5A] leading-6 mb-4">
                        No worriest! Just enter your email and we’ll send you a
                        reset password link.
                    </div>
                    <label
                        className="text-sm font-light --font-Roboto--300 mb-2"
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
                        variant="outlined"
                        placeholder="Your email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        onBlur={emailHandler}
                        error={Boolean(emailError)}
                        helperText={emailError}
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

export default ForgotPasswordForm;
