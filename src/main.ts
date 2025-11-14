import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer la validation automatique sur tous les DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // ignore les champs non définis dans le DTO
      forbidNonWhitelisted: true, // renvoie une erreur si un champ inconnu est envoyé
      transform: true,            // transforme automatiquement les types (string -> number)
    }),
  );

  await app.listen(3001);
}
bootstrap();
