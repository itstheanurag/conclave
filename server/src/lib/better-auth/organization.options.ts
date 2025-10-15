import { OrganizationOptions } from "better-auth/plugins";
import { accessControl, roles } from "./access-control-option";

export const organizationOptions: OrganizationOptions = {
  teams: { enabled: true },
  ac: accessControl,
  roles: roles,
  dynamicAccessControl: {
    enabled: true,
  },
};
