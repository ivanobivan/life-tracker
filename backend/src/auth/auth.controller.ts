import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './decorator/public.decorator';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signIn')
    signIn(@Body() body: SignInDto) {
        return this.authService.signIn(body.email, body.password);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signUp')
    signUp(@Body() body: SignUpDto) {
        return this.authService.signUp(body.name, body.password, body.email);
    }

}
