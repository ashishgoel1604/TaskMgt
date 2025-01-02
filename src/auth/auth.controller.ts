import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

@Controller('auth/')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 201,
        description: 'It will return token!',
        type: User,  // Response type
    })
    @ApiBody({
        description: 'email, password',
        type: Object,
        examples: {
            'application/json': {
                value: {
                    email: 'admin@gmail.com',
                    password: '1234',
                },
            },
        },
    })
    login(@Body() body: { email: string; password: string }): Promise<User> {
        return this.authService.signinUser(body.email, body.password);
    }
}
