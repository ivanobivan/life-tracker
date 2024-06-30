import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import "reflect-metadata";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });
    app.setGlobalPrefix('api', {
        exclude: [
            {
                path: 'auth/signIn', method: RequestMethod.POST
            },
            {
                path: 'auth/signUp', method: RequestMethod.POST
            }
        ],
    });
    app.enableVersioning({
        type: VersioningType.URI,
    });
    await app.listen(3000);
}

bootstrap();
