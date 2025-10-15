import { organization, apiKey, bearer, admin } from "better-auth/plugins";
import { organizationOptions } from "./organization.options";

export const betterAuthPlugins = [
  organization(organizationOptions),
  apiKey(),
  bearer(),
  admin(),
];
