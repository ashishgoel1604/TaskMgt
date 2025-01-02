import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { Reflector } from "@nestjs/core";
import { Role } from "../entities/user.entity";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(private authSvc: AuthService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext) {
        const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
        if (!allowedRoles || !allowedRoles.length) {
            throw new Error('Invalid Use of Guard!')
        }
        const requestObj = context.switchToHttp().getRequest();
        const headers = requestObj.headers;
        const userInfo = await this.authSvc.verifyToken(headers.token, allowedRoles);
        if (!userInfo || userInfo.error) {
            throw new ForbiddenException({
                "message": userInfo.error,
                "error": userInfo.error,
                "details": (userInfo && userInfo.error) ? userInfo.error : 'Invalid token!'
            });
        }
        requestObj.user = userInfo;
        return true;
    }
}