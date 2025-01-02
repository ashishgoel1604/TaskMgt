import { BadRequestException, Injectable } from '@nestjs/common';
import { scrypt as _scrypt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '../entities/user.entity';
import { UserService } from '../user/user.service';



@Injectable()
export class AuthService {
    constructor(
        private jwtSvc: JwtService,
        private userSvc: UserService,
    ) { }

    async issueJwtToken(user: User) {
        const jwt = await this.jwtSvc.signAsync({ sub: user.id });
        return {
            token: jwt,
            ...user,
        };
    }

    private async checkEmailExists(email: string) {
        return await this.userSvc.findUserByEmail(email);
    };

    async signinUser(email: string, password: string) {
        const user = await this.checkEmailExists(email);
        if (!user || user.password !== password) {
            throw new BadRequestException('Invalid credentials!');
        }
        //issue jwt token
        const data = await this.issueJwtToken(user);
        return data;
    }

    async verifyToken(incomingToken: string, allowedRoles: string[]) {
        try {
            const data = await this.jwtSvc.verifyAsync(incomingToken, {
                secret: 'defaultSecretKey657876vt', // Ensure you pass the secret here
            });
            if (!data) {
                return {
                    error: 'invalid_token'
                }
            }
            const userId = data.sub;
            const user = await this.userSvc.getUserDetails(userId);
            if (!user) {
                return {
                    error: 'invalid_user'
                };
            }
            if (allowedRoles.length == 1) {
                const roleName = allowedRoles[0];
                if (user.role !== roleName) {
                    return {
                        error: 'invalid_user'
                    };
                }
            }
            return {
                ...user,
            };
        } catch (error) {
            console.log(error);
            return {
                error: 'invalid_token'
            };
        }
    }
}
