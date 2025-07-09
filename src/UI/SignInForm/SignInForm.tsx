"use client";
import { getSession } from "next-auth/react"; // Assuming you're using NextAuth for session management
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Alert,
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
} from "@mui/material";
import { VscAzure, VscFeedback } from "react-icons/vsc";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  ReactEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AuthLayout from "../AuthLayout/AuthLayout";
import "../../../app/styles.css";
import {
  deviceLimit,
  fetchLoggedDevices,
  handleGitHubAuth,
  logDevice,
  removeDeviceHandler,
  removeLoggedOutDevices,
  saveGithubProviderData,
  updateGithubTokenInDatabase,
  validateEmail,
  validatePassword,
} from "@/app/utils/helpers.util";
// import { getRootDomain } from "@/app/api/auth/[...nextauth]/options";
import AppLogo from "../../../public/appseclogo.svg";
import { OktaSignInButton } from "../OktaSignInButton/OktaSignInButton";
import { GoogleSignInButton } from "../GoogleSignInButto/GoogleSignInButton";
import { FcGoogle } from "react-icons/fc";
import { SiOkta } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import CookieConsentPopup from "../CookieConsentPopup/CookieConsentPopup";
import CookieReconsentPopup from "../CookieReconsentPopup/CookieReconsentPopup";
import SigninDisclaimer from "../SigninDisclaimer/SigninDisclaimer";
import DevicePopup from "../DevicePopup/DevicePopup";
import { tree } from "next/dist/build/templates/app-page";

const keywords = ["localhost", "appmod", "passport"];

interface App {
  _id: string;
  name: string;
  environments: { hosted_url: string; name: string }[];
  signInMethods: string[];
  modules: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const SignInForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sessionData, setSessionData] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkCircle, setCheckCircle] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // const cookiesConsent = localStorage.getItem("cookieConsent") || null;
  const [roles, setRoles] = useState([]);
  const [resourceAlignmentUserRole, setResourceAlignmentUserRole] = useState(
    {}
  );

  const [cookiesConsent, setCookiesConsent] = useState<string | null>(null);
  const [showCookieConsentPopup, setShowCookieConsentPopup] = useState<
    boolean | null
  >(null);

  const [showSigninDisclaimerPopup, setShowSigninDisclaimerPopup] = useState<
    boolean | null
  >(true);
  const [signinDisclaimer, setSigninDisclaimer] = useState<string | null>(null);
  const [signinDisclaimerPopup, setSigninDisclaimerPopup] = useState<
    boolean | null
  >(false);

  const [moreSignInToggle, setMoreSignInToggle] = useState<Boolean>(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const redirect_url = searchParams.get("redirect_url") || "/dashboard";
  const signInOption = searchParams.get("signinOption") || "";
  const [loadingState, setLoadingState] = useState(true);
  const [signInMethods, setSignInMethods] = useState<string[]>([]);
  const [apps, setApps] = useState<App[]>([]);

  const googleSignInButtonRef = useRef<HTMLDivElement>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [deviceLogPopup, setDeviceLogPopup] = useState<Boolean | null>(false);
  const [whileSigningLoader, setWhileSigningLoader] = useState(false);
  const [redirectionAppDetails, setRedirectionAppDetails] = useState<any>(null);
  useEffect(() => {
    if (session) {
      setSessionData(session);
    }
    console.log("redirect_url:", redirect_url);

    if (redirect_url) {
      console.log("redirect_urls:", redirect_url);
      setLoadingState(false);
      // Find the app that matches the redirect URL
      const app = apps.find((app) =>
        app.environments.some((env) => env.hosted_url === redirect_url)
      );
      console.log("App:", app);

      setRedirectionAppDetails(app);

      if (app) {
        // Found the app, now get the signInMethods

        setSignInMethods(app?.signInMethods);
        console.log("signInMethods:", app?.signInMethods);
        if (app?.signInMethods?.length === 0) {
          setSignInMethods(["All"]);
        } // You can log it to the console
      } else {
        setSignInMethods(["All"]);
      }
      setLoadingState(false);

      if (redirect_url === "/dashboard") {
        setSignInMethods(["All"]);
        console.log("signInMethods:", signInMethods);
      }
    }
  }, [redirect_url, apps]);

  const toggleMoreSignInFuction = () => {
    setMoreSignInToggle((prev) => !prev);
  };

  const fetchApp = useCallback(async () => {
    setLoadingState(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/apps/getall`,
      {
        cache: "no-store",
        next: {
          revalidate: 0,
        },
      }
    );
    const resApps = await response.json();
    // console.log(resApps);

    // Ensure that we're correctly formatting the response to match our data model
    if (resApps) {
      const appList = resApps?.map((resApp: any) => ({
        ...resApp,
        module: resApp.modules?.join(", "),
        environment: resApp.environments
          ?.map((env: any) => env?.name)
          .join(", "),
        default: resApp.isDefault ? "Yes" : "No",
        autoGithubPat: resApp?.autoGithubPat ? true : false,
      }));
      setApps(appList);
    }
    setLoadingState(false);
    // Update the apps state
  }, []);

  useEffect(() => {
    setLoadingState(true);
    fetchApp();
    setLoadingState(false);
    const consent = Cookies.get("cookie-consent");
    if (!consent) {
      setShowCookieConsentPopup(true);
    } else {
      setCookiesConsent("accepted");
      setShowCookieConsentPopup(false);
    }
    const fullURL = window.location.href;

    const hasKeyword = keywords.some((keyword) => fullURL.includes(keyword));

    if (hasKeyword) {
      console.log("Disclaimer", fullURL);
      setSigninDisclaimerPopup(true);
      setSigninDisclaimer("rejected");
    } else {
      console.log("!!!!Disclaimer", fullURL);
      setSigninDisclaimerPopup(false);
    }
  }, []);

  useEffect(() => {
    //google sso auto trigger only if cookies consent given
    if (
      cookiesConsent &&
      signInOption === "googleSSO" &&
      googleSignInButtonRef.current
    ) {
      setLoadingState(true);

      setTimeout(() => {
        if (googleSignInButtonRef.current) {
          googleSignInButtonRef.current.click();
        }
      }, 2000);
    }
  }, [signInOption, cookiesConsent]);

  const getDomainFromUrl = (url: any) => {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (error) {
      return null;
    }
  };

  const fetchandUpdateRoles = async (user: any) => {
    if (!validateTecholutionEmail(email)) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/role/getall`,
        {
          cache: "no-store",
          next: {
            revalidate: 0,
          },
        }
      );
      const resRoles = await response.json();
      // console.log("resRoles are:", resRoles);
      setRoles(resRoles);
      const userRole = resRoles.find(
        (role: any) => role.name === "Resource_Alignment_User"
      );

      // console.log("ResourceAlignmentUserRole", userRole);

      setResourceAlignmentUserRole(userRole);
      const otherResourceAlignmentRoles = user?.role?.filter((role: any) =>
        role.name.includes("Resource_Alignment")
      );
      // console.log("otherResourceAlignmentRoles", otherResourceAlignmentRoles);

      if (otherResourceAlignmentRoles?.length > 0) {
        // console.log("dont aSSIGN USERROLE ra", otherResourceAlignmentRoles);
        return;
      }

      const userExistingRoles = user.role || [];

      try {
        const updateResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/user/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...user,
              id: user._id,
              role: [...userExistingRoles, userRole],
            }),
          }
        );
      } catch (err) {
        console.log("Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  };
  const validateTecholutionEmail = (email: string): boolean | null => {
    // Regular expression to match Gmail addresses
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@techolution\.com$/;
    if (gmailRegex.test(email)) {
      return true; // No error
    } else {
      return false;
    }
  };

  const fetchApps = async (userEmail: any) => {
    console.log("Fetch Apps", redirect_url);

    if (redirect_url === "/dashboard") {
      return true;
    }
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/me`
    );
    const user = await response.json();

    const roles = user?.role || [];

    let appObjects: any[] = [];

    roles?.forEach((role: any) => {
      role?.permissions.forEach((permission: any) => {
        appObjects = [...appObjects, ...permission.app.environments];
      });
    });

    const redirectDomain = getDomainFromUrl(redirect_url);
    const isPresent = appObjects.find(
      (appObject: any) =>
        getDomainFromUrl(appObject["hosted_url"]) == redirectDomain
    );

    console.log("App to be redirected:", redirectionAppDetails);

    console.log(
      "App to be redirected (AutoPAT):",
      redirectionAppDetails?.autoGithubPat
    );

    if (isPresent) {
      return true;
    }
    return false;
  };

  async function checkDevices(email: string) {
    let loggedDevices = await fetchLoggedDevices(email);
    console.log("Currentely Logged devices before", loggedDevices);
    loggedDevices = removeLoggedOutDevices(loggedDevices);
    console.log("Currentely Logged devices after", loggedDevices);

    if (loggedDevices.length >= deviceLimit) {
      setDevices(loggedDevices);
      setDeviceLogPopup(true);
      setWhileSigningLoader(false);
      return false;
    } else {
      console.log("logging device");

      setDeviceLogPopup(false);
      return true;
    }
    // router.replace(`${process.env.REACT_APP_BASE_URL}/signin?redirect`);
  }

  const handleCancel = () => {
    setWhileSigningLoader(true);

    setDeviceLogPopup(false);
    if (devices.length >= deviceLimit) {
      handleSignOut(`/signin?redirect_url=${redirect_url}`);
    } // Trigger sign-out if the user cancels or closes the popup
    else {
      router.replace(`/signin?redirect_url=${redirect_url}`);
      if (status !== "authenticated") handleLogin();
    }
  };
  async function handleRedirect(redirect_url: string) {
    const session = await getSession(); // Get session details
    if (session) {
      const { user } = session;
      // Perform the redirect to the specified URL
      console.log("Redirecting to specified URL...");
      router.replace(redirect_url);
    } else {
      console.error(
        "No session found, unable to proceed with the GitHub token update or authentication"
      );
    }
  }

  // Github Authorization for Repo Access (Special Case for Appmod)

  const checkRedirection = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/me`
    );
    const user = await response.json();
    if (redirect_url.includes("/oauth")) {
      const signInUrl = new URL(`${window.location.origin}/oauth`);
      searchParams.forEach((value, key) => {
        signInUrl.searchParams.set(key, value);
      });
      router.replace(signInUrl.toString());
    } else {
      //Code specifically for ResourceAlignment Requirement
      // To make sure all existing and new user with techolution email IDs have Resource_Alignment_User name by Default
      // handleGithubAccess();
      let userEmail = session?.user?.email;
      //console.log("userEmail");
      //console.log(userEmail);

      // userValidity

      console.log("User:", user);

      const currentDate = new Date();
      const userValidityDate = user?.userValidity
        ? new Date(user?.userValidity)
        : null;

      console.log("User Validity", userValidityDate);

      // Check if userValidity exists and has expired
      if (userValidityDate && userValidityDate < currentDate) {
        console.log("User validity has expired. Signing out.");
        handleSignOut("/NoAccess");
        return;
      }

      // Check if userValidity is missing
      if (!userValidityDate) {
        console.log("Setting up user validity to default");

        // Call the update API to add default validity
        const updateResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/user/update`, // Assume update endpoint
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: session?.user?._id,
              userValidity: new Date(
                new Date().setFullYear(new Date().getFullYear() + 100)
              ).toISOString(), // Default validity 100 years
            }),
          }
        );

        console.log(
          "User validity imposed:",
          new Date(
            new Date().setFullYear(new Date().getFullYear() + 100)
          ).toISOString()
        );

        const updateRes = await updateResponse.json();
        if (updateRes.status !== 200) {
          console.error(
            "Failed to set default user validity:",
            updateRes.message
          );
        }
      }
      if (redirect_url === "https://resource-alignment.techo.camp") {
        await fetchandUpdateRoles(user);
      }

      let canRedirect = await fetchApps(userEmail);

      console.log("In check redirection", canRedirect);

      if (canRedirect) {
        await handleRedirect(redirect_url);
      } else {
        router.push("/dashboard");
      }
    }
    return user;
  };

  const checkStatus = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/get-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?._id,
        }),
      }
    );

    const res = await response.json();
    console.log("---res status---", res, response, res.status !== "ACTIVE");

    if (res.status !== "ACTIVE") {
      handleSignOut("/NoAccess");
    } else {
      const continueRedirection = await checkDevices(
        session?.user?.email as string
      );

      if (continueRedirection) {
        if (
          session?.user?.provider &&
          session?.user?.provider?.provider === "github"
        ) {
          try {
            const response = await saveGithubProviderData(
              session?.user?.provider
            );
          } catch (err: any) {
            console.error(
              "Error Saving Github Provider details :",
              err.message
            );
          }
        }
        console.log("logging device");
        await logDevice(session?.user?.email || "", session?.deviceId || "");
        const user = await checkRedirection();

        const url = new URL(process.env.REACT_APP_BASE_URL || "");
        const parts = url.hostname.split(".");
        const rootDomain = parts.slice(-2).join(".");

        const currentTime = Date.now();
        const userValidityDate = user?.userValidity
          ? new Date(user.userValidity).getTime()
          : null;

        let maxAgeInSeconds = 48 * 60 * 60; // Default to 48 hours

        if (userValidityDate) {
          const timeUntilUserValidity = userValidityDate - currentTime;

          // If userValidity is less than 48 hours, set maxAge to remaining time
          if (timeUntilUserValidity < maxAgeInSeconds * 1000) {
            console.log("Has less validity than maxAge");

            maxAgeInSeconds = Math.floor(timeUntilUserValidity / 1000);
          }
        }

        const expirationDate = new Date(currentTime + maxAgeInSeconds * 1000);

        document.cookie = `email=${
          session?.user?.email
        }; domain=${rootDomain}; Max-Age=${maxAgeInSeconds}; expires=${expirationDate.toUTCString()};`;
        document.cookie = `userId=${
          session?.user?._id
        }; domain=${rootDomain}; Max-Age=${maxAgeInSeconds}; expires=${expirationDate.toUTCString()};`;
      }
    }
  };

  const handleSignOut = (route: string) => {
    signOut()
      .then(() => {
        window.location.href = route;
      })
      .catch((error: any) => {
        console.error("Sign-out error:", error);
      });
  };

  useEffect(() => {
    let userEmail = session?.user?.email;
    if (status === "authenticated") {
      if (session && userEmail) {
        //console.log("session data is:", session);

        try {
          setWhileSigningLoader(true);
          console.log("Status::", status);

          if (status === "authenticated") {
            checkStatus();
          }
        } catch (err: any) {
          setWhileSigningLoader(false);
        }
      } else if (!session?.user?._id) {
        handleSignOut("/signin/signInUserDetails");
      }
    }
  }, [status, deviceLogPopup]);

  const toggleCheckCircle = () => {
    setCheckCircle((prevState) => !prevState);
  };

  useEffect(() => {
    console.log("Device Present", devices);
  }, [devices]);
  useEffect(() => {
    // if (email) {
    //     setEmailError(validateEmail(email));
    // }
    if (password) {
      setPasswordError(validatePassword(password, false));
    }
    setError("");
  }, [password]);

  useEffect(() => {
    setEmailError(null);
  }, [email]);

  const emailHandler = (e: FocusEvent<HTMLInputElement>): void => {
    let email = e.target.value;
    setEmailError(validateEmail(email));
  };

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError("");
    showConsentForm();
    if (cookiesConsent == "rejected") {
      return;
    }
    if (!email) {
      setButtonLoading(false);
      setEmailError("All fields are necessary.");
      if (!password) {
        setPasswordError("All fields are necessary.");
        return;
      }
      return;
    }

    if (emailError || passwordError) {
      return;
    }
    let isMoveForward = await checkDevices(email);
    if (!isMoveForward) return;
    try {
      setButtonLoading(true);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        setError("Invalid Credentials");
        return;
      }

      localStorage.setItem("email", email);
      if (redirect_url === "/dashboard") {
        router.replace(redirect_url);
      }
    } catch (error) {
      console.error("Error during sign in: ", error);
    } finally {
      setButtonLoading(false);
    }
  };

  // const loginWithGithub = () => signIn("github");
  const showConsentForm = () => {
    const consent = Cookies.get("cookie-consent");
    if (consent == "true") {
      return;
    }
    setShowCookieConsentPopup(true);
  };

  const handleLogin = async () => {
    try {
      setButtonLoading(true);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        setError("Invalid Credentials");
        return;
      }

      localStorage.setItem("email", email);
      if (redirect_url === "/dashboard") {
        router.replace(redirect_url);
      }
    } catch (error) {
      console.error("Error during sign in: ", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    setLoadingState(true);

    try {
      await signIn("google");
    } catch (error: any) {
      console.error(error.message);
    }
    setLoadingState(false);
  };

  useEffect(() => {
    const signInDisclaimerPopupCookie = localStorage.getItem(
      "signInDisclaimerPopup"
    );
    if (signInDisclaimerPopupCookie === "false") {
      setShowSigninDisclaimerPopup(false);
    }
    if (!showSigninDisclaimerPopup) {
      localStorage.setItem("signInDisclaimerPopup", "false");
    }
  }, [showSigninDisclaimerPopup]);

  if (!signInMethods.length) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthLayout>
      {signInOption === "googleSSO" && (
        <LoadingScreen overlayColor="white" open={loadingState} />
      )}
      <LoadingScreen open={loadingState || whileSigningLoader} />

      {/* {cookiesConsent == "" && <CookieReconsentPopup />} */}

      {
        <div className="h-[90vh]">
          {deviceLogPopup && devices && (
            <DevicePopup
              userId={session?.user?._id || (devices[0].userId as string)}
              devices={devices}
              setDevices={setDevices}
              onRemoveDevice={removeDeviceHandler}
              onCancel={handleCancel}
            />
          )}
          <CookieConsentPopup
            showPopup={showCookieConsentPopup}
            setShowPopup={setShowCookieConsentPopup}
            setCookieConsent={setCookiesConsent}
          />
          {showSigninDisclaimerPopup && (
            <SigninDisclaimer
              setShowSigninDisclaimerPopup={setShowSigninDisclaimerPopup}
              setLoading={setLoadingState}
              signinDisclaimer={signinDisclaimer}
              showPopup={signinDisclaimerPopup}
              setSigninDisclaimer={setSigninDisclaimer}
              setSigninDisclaimerPopup={setSigninDisclaimerPopup}
            />
          )}
          <div className="bg-white md:hidden fixed top-0 left-0 p-4 py-6 shadow-sm w-full  ">
            <Image
              className="flex justify-start "
              src={AppLogo}
              style={{ width: "11.5rem", height: "1.75rem" }}
              alt="App Logo"
            ></Image>
          </div>

          <div className=" flex flex-col justify-center w-[23.125rem] min-h-full --font-Roboto bg-white shadow-md mt-48 md:mt-0 md:shadow-none px-6  rounded-lg py-6 md:bg-none md:px-0 md:py-0">
            {error && (
              <Alert
                className=" text-sm  mb-6"
                sx={{
                  color: "#E64646",
                  fontWeight: "500",
                  padding: " 0.3em 1em",
                }}
                severity="error"
              >
                {error}
              </Alert>
            )}

            {(signInMethods.includes("Credentials") ||
              signInMethods.includes("All") ||
              signInMethods.length === 0) && (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col    --font-Roboto"
                noValidate
              >
                <h1 className="text-2xl font-[500] text-[#0088A4] --font-Roboto">
                  Sign in
                </h1>
                <label
                  className="text-sm font-[300]  mt-6 mb-2"
                  htmlFor="email"
                >
                  Email Address
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
                        boxShadow: "0 0 0 2px transparent", // Adds a custom blue shadow
                      },
                    },
                  }}
                  variant="outlined"
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  onBlur={emailHandler}
                  error={Boolean(emailError)}
                  helperText={emailError}
                />
                <label
                  className="text-sm font-[300]  mt-6 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={passwordHandler}
                  placeholder="Password"
                  // onBlur={validatePassword}
                  // error={Boolean(passwordError)}
                  helperText={""}
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="flex w-full my-5 justify-between text-sm font-normal">
                  <div className="flex gap-2 justify-center items-center">
                    <CheckCircleIcon
                      sx={{
                        fontSize: "1.3em",
                        color: checkCircle
                          ? "var(--primary-color)"
                          : "transparent",
                        border: checkCircle
                          ? "transparent"
                          : "0.1em solid var(--primary-color)",
                        borderRadius: "50%",
                        margin: "0",
                        transform: checkCircle ? "scale(1.1)" : "none",
                      }}
                      onClick={toggleCheckCircle}
                    />
                    Remember me
                  </div>
                  <Link href={"/forgotpassword"}>Forgot Password?</Link>
                </div>

                <Button
                  className="h-[3.375em] text-lg font-bold my-4 rounded-md"
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
                    <CircularProgress size={20} style={{ color: "white" }} />
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
                {redirect_url === "https://resource-alignment.techo.camp" && (
                  <p className="flex justify-center font-light text-sm mt-4 text-right">
                    Don’t have an account?{" "}
                    <Link
                      className=" no-underline px-2 text-[var(--primary-color)] font-semibold"
                      href={
                        "/register?redirect_url=https://resource-alignment.techo.camp"
                      }
                    >
                      Sign Up
                    </Link>
                  </p>
                )}
                {redirect_url !== "https://resource-alignment.techo.camp" && (
                  <p className="flex justify-center font-light text-sm mt-4 text-right">
                    Don’t have an account?{" "}
                    <Link
                      className="  no-underline px-2 text-[var(--primary-color)] font-semibold"
                      href={"/register"}
                    >
                      Sign Up
                    </Link>
                  </p>
                )}
              </form>
            )}
            <div className=" flex flex-col justify-start">
              {(signInMethods.includes("Github SSO") ||
                signInMethods.includes("Google SSO") ||
                signInMethods.includes("All") ||
                signInMethods.length === 0) && (
                <p className="text-center text-[12px] text-gray-600 my-2 mt-6 underline">
                  Sign In Options
                </p>
              )}
              <div className="flex flex-col gap-4 text-4xl justify-evenly items-center my-8 min-h-[0.5rem] ">
                {(signInMethods.includes("Google SSO") ||
                  signInMethods.includes("All") ||
                  signInMethods.length === 0) && (
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      showConsentForm();
                      if (cookiesConsent == "accepted") {
                        handleGoogleSSO();
                      }
                    }}
                    ref={googleSignInButtonRef}
                  >
                    <Button
                      style={{
                        backgroundColor: "#4888F4",
                        color: "white",
                      }}
                      sx={{
                        display: "flex",
                        gap: "0.5em",
                        fontWeight: 700,
                        fontSize: "20px",
                        height: "2.5rem",
                        "&:hover": {
                          backgroundColor: "grey",
                        },
                        "&:active": {
                          backgroundColor: "grey",
                        },
                        "&:focus": {
                          backgroundColor: "grey",
                        },
                      }}
                      variant="contained"
                      onClick={async () => {
                        showConsentForm();
                        if (cookiesConsent == "accepted") {
                          setLoadingState(true);

                          try {
                            await signIn("google");
                          } catch (error: any) {
                            console.error(error.message);
                          }
                          setLoadingState(false);
                        }
                      }}
                    >
                      <div className="bg-white p-[2px] rounded-full">
                        <FcGoogle />
                      </div>

                      <p className="text-[10px]"> Sign In with Google</p>
                    </Button>
                  </div>
                )}

                {(signInMethods.includes("Github SSO") ||
                  signInMethods.includes("All") ||
                  signInMethods.length === 0) && (
                  <Button
                    style={{
                      backgroundColor: "black",
                      color: "white",
                    }}
                    sx={{
                      display: "flex",
                      gap: "0.5em",
                      fontWeight: 700,
                      fontSize: "20px",
                      height: "2.5rem",
                      "&:hover": {
                        backgroundColor: "grey",
                      },
                      "&:active": {
                        backgroundColor: "grey",
                      },
                      "&:focus": {
                        backgroundColor: "grey",
                      },
                    }}
                    variant="contained"
                    onClick={async () => {
                      showConsentForm();
                      if (cookiesConsent == "accepted") {
                        setLoadingState(true);

                        try {
                          await signIn("github");
                        } catch (error: any) {
                          console.error(error.message);
                        }
                        setLoadingState(false);
                      }
                    }}
                  >
                    <div className="bg-black p-[4px] rounded-full">
                      <FaGithub className="" />
                    </div>
                    <p className="text-[10px]"> Sign In with Github</p>
                  </Button>
                )}

                {(signInMethods.includes("Azure SSO") ||
                  signInMethods.includes("All") ||
                  signInMethods.length === 0) && (
                  <Button
                    style={{
                      backgroundColor: "#105298",
                      color: "white",
                    }}
                    sx={{
                      display: "flex",
                      gap: "0.5em",
                      fontWeight: 700,
                      fontSize: "20px",
                      height: "2.5rem",
                      "&:hover": {
                        backgroundColor: "grey",
                      },
                      "&:active": {
                        backgroundColor: "grey",
                      },
                      "&:focus": {
                        backgroundColor: "grey",
                      },
                    }}
                    variant="contained"
                    onClick={async () => {
                      showConsentForm();
                      if (cookiesConsent == "accepted") {
                        setLoadingState(true);

                        try {
                          await signIn("azure-ad");
                        } catch (error: any) {
                          console.error(error.message);
                        }
                        setLoadingState(false);
                      }
                    }}
                  >
                    <div className="bg-[#FFF] scale-[0.85]  text-[#105298]  p-[4px] rounded-full">
                      <VscAzure className="" />
                    </div>
                    <p className="text-[10px]"> Sign In with Azure</p>
                  </Button>
                )}
              </div>
              {!signInMethods.includes("All") && (
                <div className="flex flex-col w-full   ">
                  <p
                    onClick={toggleMoreSignInFuction}
                    className="text-[12px] w-full cursor-pointer    underline flex  justify-center items-center "
                  >
                    More Sign In Options
                  </p>
                  {moreSignInToggle && (
                    <div>
                      {!signInMethods.includes("Credentials") &&
                        !signInMethods.includes("All") && (
                          <>
                            {/* <h1 className="text-2xl font-[500] text-[#0088A4] --font-Roboto">
                                                            Sign in
                                                        </h1> */}
                            <form
                              onSubmit={handleSubmit}
                              className="flex flex-col w-full --font-Roboto"
                              noValidate
                            >
                              <label
                                className="text-sm font-[300]  mt-6 mb-2"
                                htmlFor="email"
                              >
                                Email Address
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
                                      boxShadow: "0 0 0 2px transparent", // Adds a custom blue shadow
                                    },
                                  },
                                }}
                                variant="outlined"
                                placeholder="Email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={emailHandler}
                                error={Boolean(emailError)}
                                helperText={emailError}
                              />
                              <label
                                className="text-sm font-[300]  mt-6 mb-2"
                                htmlFor="password"
                              >
                                Password
                              </label>
                              <TextField
                                autoComplete="off"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={passwordHandler}
                                placeholder="Password"
                                // onBlur={validatePassword}
                                // error={Boolean(passwordError)}
                                helperText={""}
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
                              <div className="flex w-full my-5 justify-between text-sm font-normal">
                                <div className="flex gap-2 justify-center items-center">
                                  <CheckCircleIcon
                                    sx={{
                                      fontSize: "1.3em",
                                      color: checkCircle
                                        ? "var(--primary-color)"
                                        : "transparent",
                                      border: checkCircle
                                        ? "transparent"
                                        : "0.1em solid var(--primary-color)",
                                      borderRadius: "50%",
                                      margin: "0",
                                      transform: checkCircle
                                        ? "scale(1.1)"
                                        : "none",
                                    }}
                                    onClick={toggleCheckCircle}
                                  />
                                  Remember me
                                </div>
                                <Link href={"/forgotpassword"}>
                                  Forgot Password?
                                </Link>
                              </div>
                              {redirect_url ===
                                "https://resource-alignment.techo.camp" && (
                                <p className="flex justify-center font-light text-sm mt-4 text-right">
                                  Don’t have an account?{" "}
                                  <Link
                                    className=" no-underline px-2 text-[var(--primary-color)] font-semibold"
                                    href={
                                      "/register?redirect_url=https://resource-alignment.techo.camp"
                                    }
                                  >
                                    Sign Up
                                  </Link>
                                </p>
                              )}
                              {redirect_url !==
                                "https://resource-alignment.techo.camp" && (
                                <p className="flex justify-center font-light text-sm mt-4 text-right">
                                  Don’t have an account?{" "}
                                  <Link
                                    className="  no-underline px-2 text-[var(--primary-color)] font-semibold"
                                    href={"/register"}
                                  >
                                    Sign Up
                                  </Link>
                                </p>
                              )}
                              <Button
                                className="h-[3.375em] text-lg font-bold my-4 rounded-md"
                                style={{
                                  background: "var(--primary-color)",
                                  marginBottom: "3px",
                                }}
                                variant="contained"
                                type="submit"
                                disabled={buttonLoading}
                                sx={{
                                  boxShadow: "none",
                                }}
                              >
                                {buttonLoading ? (
                                  <CircularProgress
                                    size={20}
                                    style={{
                                      color: "white",
                                    }}
                                  />
                                ) : (
                                  "SIGN IN"
                                )}
                              </Button>
                            </form>
                          </>
                        )}
                      <div>
                        {(!signInMethods.includes("Google SSO") ||
                          !signInMethods.includes("Github SSO")) &&
                          !signInMethods.includes("Credentials") && (
                            <p className="text-center text-[12px] text-gray-600 my-2 mt-6 underline">
                              Other Sign In Options
                            </p>
                          )}
                        <div className="flex text-4xl justify-evenly items-center my-8 ">
                          {!signInMethods.includes("Google SSO") && (
                            <div
                              className="cursor-pointer"
                              onClick={async () => {
                                showConsentForm();
                                if (cookiesConsent == "accepted") {
                                  handleGoogleSSO();
                                }
                              }}
                              ref={googleSignInButtonRef}
                            >
                              <FcGoogle />
                            </div>
                          )}
                          {!signInMethods.includes("Github SSO") && (
                            <FaGithub
                              className="cursor-pointer"
                              onClick={async () => {
                                showConsentForm();
                                if (cookiesConsent == "accepted") {
                                  setLoadingState(true);

                                  try {
                                    await signIn("github");
                                  } catch (error: any) {
                                    console.error(error.message);
                                  }
                                  setLoadingState(false);
                                }
                              }}
                            />
                          )}
                          {!signInMethods.includes("Azure SSO") && (
                            <VscAzure
                              className="cursor-pointer text-[#105298]"
                              onClick={async () => {
                                showConsentForm();
                                if (cookiesConsent == "accepted") {
                                  setLoadingState(true);

                                  try {
                                    await signIn("azure-ad");
                                  } catch (error: any) {
                                    console.error(error.message);
                                  }
                                  setLoadingState(false);
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      }
    </AuthLayout>
  );
};

{
  /* <div className="bg-white p-[2px] rounded-full">
                                        <FaGithub className="z-40" />
                                    </div>
                                     */
}

export default SignInForm;
