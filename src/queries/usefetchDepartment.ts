import { useQuery } from "@tanstack/react-query";

import { fetchRole } from "../services/role/role";
import { fetchUser } from "../services/user/user";
import { fetchOperation } from "../services/operation/operation";
import { fetchEnvironment } from "../services/environment/environment";
import { fetchApplication } from "../services/application/application";
import { fetchPerm } from "../services/permission/permission";
// export const useDepartments = () => {
//     return useQuery({
//         queryKey: ["get-departments"],
//         queryFn: async () => {
//             const resUsers = await fetchDepartments();
//             return resUsers;
//         },
//     });
// };

export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const resUser = await fetchUser();
      return resUser;
    },
    ...options,
  });
};
export const useRoles = (options = {}) => {
  return useQuery({
    queryKey: ["get-role"],
    queryFn: async () => {
      const resRole = await fetchRole();
      return resRole;
    },
    ...options,
  });
};
export const usePermission = (options = {}) => {
  return useQuery({
    queryKey: ["get-perm"],
    queryFn: async () => {
      const resPerm = await fetchPerm();
      return resPerm;
    },
    ...options,
  });
};

export const useOperation = (options = {}) => {
  return useQuery({
    queryKey: ["get-operation"],
    queryFn: async () => {
      const resOpt = await fetchOperation();
      return resOpt;
    },
    ...options,
  });
};

export const useEnvironment = (options = {}) => {
  return useQuery({
    queryKey: ["get-env"],
    queryFn: async () => {
      const resEnv = await fetchEnvironment();
      return resEnv;
    },
    ...options,
  });
};
export const useApplication = (options = {}) => {
  return useQuery({
    queryKey: ["get-app"],
    queryFn: async () => {
      const resApp = await fetchApplication();
      return resApp;
    },
    ...options,
  });
};
