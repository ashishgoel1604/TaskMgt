import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signinUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    it('should return user and token on successful login', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            role: 'User',
            tasks: [],
        };

        const mockResponse = {
            token: 'jwt_token',
            ...mockUser,
        };

        mockAuthService.signinUser.mockResolvedValue(mockResponse);

        const result = await authController.login({ email: 'test@example.com', password: 'password123' });

        expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException for invalid credentials', async () => {
        mockAuthService.signinUser.mockRejectedValue(new BadRequestException('Invalid credentials!'));

        try {
            await authController.login({ email: 'invalid@example.com', password: 'wrongpassword' });
        } catch (e) {
            expect(e).toBeInstanceOf(BadRequestException);
            expect(e.message).toBe('Invalid credentials!');
        }
    });
});
