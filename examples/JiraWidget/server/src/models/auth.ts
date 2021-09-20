import { AuthToken } from "./token";
import { User } from "./user";

export interface Locals {
  user: User;
  auth: AuthToken;
  origin: string;
  projectId: string;
  projectBaseUrl: string;
  initialSave: boolean;
  refreshed?: boolean;
}
