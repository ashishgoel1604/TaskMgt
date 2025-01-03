import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userService: UserService;

    const mockJwtService = {
        signAsync: jest.fn().mockResolvedValue('jwt_token'),
        verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
    };

    const mockUserService = {
        findUserByEmail: jest.fn(),
        getUserDetails: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: JwtService, useValue: mockJwtService },
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should return user data and jwt token when login is successful', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            role: 'User',
            tasks: [],
        };

        mockUserService.findUserByEmail.mockResolvedValue(mockUser);

        const result = await authService.signinUser('test@example.com', 'password123');
        expect(result).toHaveProperty('token');
        expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('should throw BadRequestException when email does not exist', async () => {
        mockUserService.findUserByEmail.mockResolvedValue(null);

        try {
            await authService.signinUser('nonexistent@example.com', 'password123');
        } catch (e) {
            expect(e).toBeInstanceOf(BadRequestException);
            expect(e.message).toBe('Invalid credentials!');
        }
    });

    it('should throw BadRequestException when password is incorrect', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            role: 'User',
            tasks: [],
        };

        mockUserService.findUserByEmail.mockResolvedValue(mockUser);

        try {
            await authService.signinUser('test@example.com', 'wrongpassword');
        } catch (e) {
            expect(e).toBeInstanceOf(BadRequestException);
            expect(e.message).toBe('Invalid credentials!');
        }
    });

    it('should return user when token is valid', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            role: 'User',
            tasks: [],
        };

        mockUserService.getUserDetails.mockResolvedValue(mockUser);

        const result = await authService.verifyToken('jwt_token', ['User']);
        expect(result).toEqual(mockUser);
    });

    it('should return error for invalid token', async () => {
        mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

        const result = await authService.verifyToken('invalid_token', ['User']);
        console.log(`I am a result -->>>>>>>>>`);
        console.log(result);
        expect(result).toHaveProperty('error', 'invalid_token');
    });

    it('should return error for invalid user role', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            role: 'User',
            tasks: [],
        };

        mockUserService.getUserDetails.mockResolvedValue(mockUser);

        const result = await authService.verifyToken('jwt_token', ['Admin']);
        expect(result).toHaveProperty('error', 'invalid_user');
    });
});
