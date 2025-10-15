import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  user: ["create", "read", "update", "delete", "ban"],
  content: ["create", "read", "update", "delete", "moderate"],
  settings: ["read", "update"],
} as const;

const accessControl = createAccessControl(statements);

export const roles = {
  user: accessControl.newRole({
    user: ["read"],
    content: ["read", "create"],
    settings: ["read"],
  }),

  moderator: accessControl.newRole({
    user: ["read"],
    content: ["read", "create", "update", "delete", "moderate"],
    settings: ["read"],
  }),

  admin: accessControl.newRole({
    ...adminAc.statements,
    user: ["create", "read", "update", "delete", "ban"],
    content: ["create", "read", "update", "delete", "moderate"],
    settings: ["read", "update"],
  }),
};

export { accessControl };
