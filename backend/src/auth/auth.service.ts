import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {
    }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        return {
            token: await this.jwtService.signAsync(
                {
                    sub: user.id,
                    username: user.name,
                    email: user.email,
                }
            )
        };
    }

    async signUp(name: string, password: string, email: string): Promise<any> {
        await this.userService.create(name, password, email);
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new UnauthorizedException();
        }
        return {
            token: await this.jwtService.signAsync(
                {
                    sub: user.id,
                    username: user.name,
                    email: user.email,
                }
            )
        };
    }
}
