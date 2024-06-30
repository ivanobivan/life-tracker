import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../database/entites/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email });
    }

    async findById(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async remove(id: number): Promise<void> {
        const user = await this.usersRepository.findOneBy({id});
        if (!user) {
            throw new UnauthorizedException();
        }
        await this.usersRepository.delete(user.id);
    }

    async create(name: string, password: string, email: string): Promise<void> {
        if (await this.usersRepository.existsBy({ email })) {
            throw new HttpException('Email already taken', HttpStatus.OK)
        }
        const newUser = this.usersRepository.create({
            name,
            password,
            email,
            activated: false,
        });
        await this.usersRepository.save(newUser);
    }

}
