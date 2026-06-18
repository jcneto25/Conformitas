import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3001;

  app.setGlobalPrefix('api/v1');

  app.use(helmet());

  app.enableCors({
    origin: process.env.WEB_BASE_URL ?? 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CONFORMITAS 3.0 API')
    .setDescription('Sistema Integrado de Gestão de Auditoria Interna Governamental — AUDIN/TJCE')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação')
    .addTag('usuarios', 'Usuários')
    .addTag('perfis', 'Perfis e RBAC')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
  logger.log(`API rodando em http://localhost:${port}`);
  logger.log(`Swagger em http://localhost:${port}/swagger`);
}

bootstrap();
