import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const signInMethods = [
  "All",
  "Github SSO",
  "Google SSO",
  "Credentials",
  "Azure SSO",
];
export const deviceLimit = 3;
export const USER_VALIDITY_OPTIONS = [
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "5 days", value: 5 },
  { label: "15 days", value: 15 },
  { label: "1 month", value: 30 },
  { label: "3 months", value: 90 },
  { label: "6 months", value: 180 },
  { label: "12 months", value: 365 },
  { label: "Until Changed", value: 36500 },
];

export const getFeedback = (password: String, strength: number) => {
  if (strength >= 25 && strength < 50) {
    return "The password is weak!";
  } else if (strength >= 50 && strength < 75) {
    return "The password is good, but make it stronger.";
  } else if (strength >= 75) {
    return "The password is really good!";
  }
};

export const getHint = (password: String, strength: number) => {
  if (strength >= 25 && strength < 50) {
    return "Weak";
  } else if (strength >= 50 && strength < 75) {
    return "Good";
  } else if (strength >= 75) {
    return "Strong";
  }
};

export const getColor = (password: String, strength: number) => {
  if (strength >= 0 && strength < 25) {
    return "#E64646";
  } else if (strength >= 25 && strength < 50) {
    return "#E64646";
  } else if (strength >= 50 && strength < 75) {
    return "#70B6C1";
  } else if (strength >= 75) {
    return "#70B6C1";
  }
};

export const calculateStrength = (password: string) => {
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  let score = 0;
  if (password.length > 0) {
    score += 1;
  }

  if (uppercaseRegex.test(password) && password.length >= 8) {
    score += 1;
  }
  if (numberRegex.test(password) && password.length >= 8) {
    score += 1;
  }
  if (specialCharRegex.test(password) && password.length >= 8) {
    score += 1;
  }

  //const maxLengthPenalty = password.length > 15 ? 0 : 1;
  return score * 25;
};

export const validateEmail = (email: any) => {
  if (!email) {
    return "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return "Invalid email address";
  } else {
    return "";
  }
};

export const validatePhoneNumber = (phoneNumber: any) => {
  // Regex pattern to validate international phone numbers with country codes (e.g., +123456789012)
  // const phoneRegex = /^\+?[1-9]\d{1,2}[0-9]{10,}$/;
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;

  if (!phoneNumber) {
    return "Phone is required";
  } else if (!phoneRegex.test(phoneNumber)) {
    return "Invalid phone number. Include country code if applicable.";
  } else {
    return "";
  }
};

export const validateURL = (url: string | undefined) => {
  if (!url) {
    return "URL is required";
  } else if (!/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/.test(url)) {
    return "Invalid URL format";
  } else {
    return "";
  }
};

export const validatePassword = (password: string, creation: Boolean) => {
  // At least 8 characters
  const minLength = 8;
  const maxLength = 15;

  // At least one lowercase letter
  const lowercaseRegex = /[a-z]/;

  // At least one uppercase letter
  const uppercaseRegex = /[A-Z]/;

  // At least one digit
  const digitRegex = /\d/;

  // At least one special character
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  // Check if the password is provided
  if (!password) {
    return "Password is required";
  }

  // Check minimum length
  if (password.length < minLength) {
    return "Password must be at least 8 characters.";
  }

  // Check maximum length
  // if (password.length > maxLength) {
  //     return "Password should not exceed 15 characters.";
  // }

  if ((creation = true)) {
    // Check lowercase
    if (!lowercaseRegex.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    // Check uppercase
    if (!uppercaseRegex.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    // Check digit
    if (!digitRegex.test(password)) {
      return "Password must contain at least one digit.";
    }

    // Check special character
    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character.";
    }
  }

  // Password is valid
  return "";
};

export const convertTimestampToDate = (timestamp: number) => {
  // Convert the timestamp to milliseconds (if it's not already in milliseconds)
  const timestampInMilliseconds = timestamp * 1000;

  // Create a new Date object using the timestamp
  const date = new Date(timestampInMilliseconds);

  // Format the date as a string (you can customize the format as needed)
  const formattedDate = date.toLocaleString("en-US", { timeZone: "UTC" });

  return formattedDate;
};
export const getInitials = (name: string): string => {
  const words = name.split(" ");

  if (words.length === 0) {
    return "";
  }

  const initials = words.map((word) => word[0]).join("");

  return initials.toUpperCase();
};

// export const handleGitHubAuth = async () => {
//     try {
//         const response = await fetch("/api/user/generate-github-pat", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ code: "" }),
//         });

//         if (!response.ok) {
//             throw new Error("Failed to retrieve GitHub token.");
//         }

//         const data = await response.json();
//         console.log("GitHub Token Response:", data);
//     } catch (err: any) {
//         console.error(err.message || "An error occurred.");
//     }
// };

export async function logDevice(email: string, deviceId: string) {
  try {
    const userAgent = navigator.userAgent;
    console.log("Device ID");

    localStorage.setItem("deviceId", deviceId);
    const response = await fetch("/api/user/log-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, userAgent, deviceId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to log device");
    }

    console.log("Device logged successfully:", data.message);
  } catch (error) {
    console.error("Error logging device:", error);
  }
}

export const removeDeviceHandler = async (
  userId: string,
  deviceId: string | string[]
) => {
  console.log("Remove user device ");

  try {
    const response = await fetch("/api/user/remove-device", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, deviceId: deviceId }),
    });
    console.log("Helper remove device response", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Device removed:", data);
    } else {
      const errorData = await response.json();
      console.error("Error removing device:", errorData);
    }
    return response;
  } catch (error) {
    console.error("Error calling remove device API:", error);
  }
};

export const removeLoggedOutDevices = (loggedInDevices: any) => {
  if (!loggedInDevices || loggedInDevices.length === 0) return [];
  let loggedOutDevices: string[] = [];
  let userId = loggedInDevices[0].userId;
  loggedInDevices = loggedInDevices.filter((device: any) => {
    let logginInTime = new Date(device.createdAt as string) as any;
    let currentTime = new Date() as any;
    const diff = currentTime - logginInTime;
    console.log("diffInTime", diff);
    if (diff > 48 * 60 * 60 * 1000) {
      loggedOutDevices.push(device.deviceId);
    }
    return diff < 48 * 60 * 60 * 1000;
  });
  if (loggedOutDevices.length > 0 && userId) {
    removeDeviceHandler(userId, loggedOutDevices);
  }
  return loggedInDevices;
};

export async function fetchLoggedDevices(email: string) {
  if (!email) {
    console.error("Email parameter is required to fetch devices.");
    return [];
  }

  try {
    const response = await fetch(`/api/user/logged-devices-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        email: email,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch devices.");
    }

    return data.devices;
  } catch (error: any) {
    console.error("Error fetching devices:", error.message || error);
    return [];
  }
}

export async function getSessionByDeviceId(deviceId: string) {
  try {
    if (!deviceId) {
      throw new Error("Device ID is required");
    }

    const response = await fetch(
      `/api/user/get-device-status?deviceId=${deviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch session");
    }

    return data.session; // Return session details
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error; // Rethrow the error for further handling
  }
}

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export interface TreeNode {
  name?: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

export function formateDataForRelations(type: string, data: any) {
  let formatedData: TreeNode = {};
  console.log("dataConsole", data);
  switch (type) {
    case "Users":
      let usersData = {
        name: data.email,
        children: [
          {
            name: data.role.length > 1 ? "Role" : "Roles",
            type: "label",
            children: data.role.map((role: any) => {
              return {
                name: role.name,
                children: [
                  {
                    name:
                      role.permissions.length > 1
                        ? "Permissions"
                        : "Permission",
                    type: "label",
                    children: role.permissions.map((permission: any) => {
                      let operations = permission.operations.map(
                        (operation: any) => {
                          return { name: operation.name };
                        }
                      );
                      return {
                        name: permission.name,
                        children: [
                          {
                            name:
                              operations.length > 1
                                ? "Operations"
                                : "Operation",
                            type: "label",
                            children: operations,
                          },
                          {
                            name: "App",
                            type: "label",
                            children: [
                              {
                                name: permission.app.name,

                                children: [
                                  {
                                    name: permission.app.modules
                                      ? "Modules"
                                      : "Module",
                                    type: "label",
                                    children: permission.app.modules.map(
                                      (module: any) => {
                                        return {
                                          name: module,
                                        };
                                      }
                                    ),
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      };
                    }),
                  },
                ],
              };
            }),
          },
        ],
      };
      return usersData;
    case "Roles":
      return {
        name: data.name,
        children: [
          {
            name: data.permissions.length > 1 ? "Permissions" : "Permission",
            type: "label",
            children: data.permissions.map((permission: any) => {
              let operations = permission.operations.map((operation: any) => {
                return { name: operation.name };
              });
              return {
                name: permission.name,
                children: [
                  {
                    name: operations.length > 1 ? "Operations" : "Operation",
                    type: "label",
                    children: operations,
                  },
                  {
                    name: "App",
                    type: "label",
                    children: [
                      {
                        name: permission.app.name,

                        children: [
                          {
                            name:
                              permission.app.modules.length > 1
                                ? "Modules"
                                : "Module",
                            type: "label",
                            children: permission.app.modules.map(
                              (module: any) => {
                                return {
                                  name: module,
                                };
                              }
                            ),
                          },
                        ],
                      },
                    ],
                  },
                ],
              };
            }),
          },
        ],
      };
    case "Permissions":
      let operations = data.operations.map((operation: any) => {
        return { name: operation.name };
      });
      return {
        name: data.name,
        children: [
          {
            name: operations.length > 1 ? "Operations" : "Operation",
            type: "label",
            children: operations,
          },
          {
            name: "App",
            type: "label",
            children: [
              {
                name: data.app.name,
                children: [
                  {
                    name: data.app.modules.length > 1 ? "Modules" : "Module",
                    type: "label",
                    children: data.app.modules.map((module: any) => {
                      return {
                        name: module,
                      };
                    }),
                  },
                ],
              },
            ],
          },
        ],
      };
    case "Apps":
      return {
        name: data.name,
        children: [
          {
            name: data.modules.length > 1 ? "Modules" : "Module",
            type: "label",
            children: data.modules.map((module: any) => {
              return {
                name: module,
              };
            }),
          },
          {
            name: data.environments.length > 1 ? "Enviornments" : "Enviornment",
            type: "label",
            children: data.environments.map((environment: any) => {
              return {
                name: environment.name,
              };
            }),
          },
        ],
      };
  }
  formatedData = {
    name: "T",
    children: [
      {
        name: "A",
        children: [
          { name: "A1" },
          { name: "A2" },
          { name: "A3" },
          {
            name: "C",
            children: [
              {
                name: "C1",
              },
              {
                name: "D",
                children: [
                  {
                    name: "D1",
                  },
                  {
                    name: "D2",
                  },
                  {
                    name: "D3",
                  },
                ],
              },
            ],
          },
        ],
      },
      { name: "Z" },
      {
        name: "B",
        children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }],
      },
    ],
  };
  return formatedData;

  // case "Organisations":
  //     return {
  //         name: data.name,
  //         children: data.rolesData.map((role: any) => {
  //             return {
  //                 name: role.name,
  //                 children: role.permissions.map((permission: any) => {
  //                     let operations = permission.operations.map((operation:any)=>{
  //                         return {name:operation.name}}
  //                     )
  //                     return {
  //                         name: permission.name,
  //                         children: [
  //                             ...operations,
  //                             {
  //                             name: permission.application.name,
  //                             children: permission.application.modules.map((module: any) => {
  //                                 return {
  //                                     name: module.name,
  //                                     children: module.pages.map((page: any) => {
  //                                         return {
  //                                             name: page.name
  //                                         }
  //                                     })
  //                                 }
  //                             })
  //                         }]
  //                     }
  //                 })
  //             }
  //         })
  //     }
  // case "Facilities":
  //     return {
  //         name: data.name,
  //         children: data.rolesData.map((role: any) => {
  //             return {
  //                 name: role.name,
  //                 children: role.permissions.map((permission: any) => {
  //                     let operations = permission.operations.map((operation:any)=>{
  //                         return {name:operation.name}}
  //                     )
  //                     return {
  //                         name: permission.name,
  //                         children: [
  //                             ...operations,
  //                             {
  //                             name: permission.application.name,
  //                             children: permission.application.modules.map((module: any) => {
  //                                 return {
  //                                     name: module.name,
  //                                     children: module.pages.map((page: any) => {
  //                                         return {
  //                                             name: page.name
  //                                         }
  //                                     })
  //                                 }
  //                             })
  //                         }]
  //                     }
  //                 })
  //             }
  //         })
  //     }
  // case "Departments":
  //     return {
  //         name: data.name,
  //         children: data.rolesData.map((role: any) => {
  //             return {
  //                 name: role.name,
  //                 children: role.permissions.map((permission: any) => {
  //                     let operations = permission.operations.map((operation:any)=>{
  //                         return {name:operation.name}}
  //                     )
  //                     return {
  //                         name: permission.name,
  //                         children: [
  //                             ...operations,
  //                             {
  //                             name: permission.application.name,
  //                             children: permission.application.modules.map((module: any) => {
  //                                 return {
  //                                     name: module.name,
  //                                     children: module.pages.map((page: any) => {
  //                                         return {
  //                                             name: page.name
  //                                         }
  //                                     })
  //                                 }
  //                             })
  //                         }]
  //                     }
  //                 })
  //             }
  //         })
  //     }
  // case "Modules":
  //     return {
  //         name: data.name,
  //         children: data.pagesList.map((page: any) => {
  //             return {
  //                 name: page.name
  //             }
  //         })
  //     }
}
