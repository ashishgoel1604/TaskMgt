import { SetMetadata } from "@nestjs/common";

export const Roles = (...allowedRoles: string[]) => SetMetadata('allowedRoles', allowedRoles);