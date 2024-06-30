import { Controller, Delete, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../database/entites/user.entity';

@Controller({
    path: 'user',
    version: '1',
})
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Get()
    async getUser(@Request() req): Promise<Pick<User, 'email' | 'name' | 'boards'> | null> {
        const user = await this.userService.findById(req.user.sub);
        if (user) {
            const {email, name, boards} = user;
            return {
                email,
                name,
                boards: boards || [],
            };
        }
        return null;
    }

    @Delete()
    async remove(@Request() req): Promise<void> {
        await this.userService.remove(req.user.sub);
    }


}
