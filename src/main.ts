import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get('ConfigService');

  if (configService.isDev()) {
    configureSwagger(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        strategy: 'excludeAll',
      },
    }),
  );

  await app.listen(+configService.get('API_PORT'));
}

bootstrap();


function configureSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('Simple Nest APP')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('doc', app, document);
}
