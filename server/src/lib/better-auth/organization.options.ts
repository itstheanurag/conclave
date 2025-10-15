import { OrganizationOptions } from "better-auth/plugins";
import { createAccessControl, Role } from "better-auth/plugins/access";

const statements = {
  project: ["create", "share", "update", "delete"],
  organization: ["update", "delete"],
} as const;

const ac = createAccessControl(statements);

const admin: Role = ac.newRole({ project: ["create", "update"] });

const owner: Role = ac.newRole({
  project: ["create", "update", "delete"],
  organization: ["update"],
});

export const organizationOptions: OrganizationOptions = {
  teams: { enabled: true },
  ac,

  roles: {
    owner,
    admin,
  },

  dynamicAccessControl: {
    enabled: true,
  },
};
