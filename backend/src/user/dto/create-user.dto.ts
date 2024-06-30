import { User } from '../../database/entites/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto implements Pick<User, 'name' | 'password' | 'email'> {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;


}
