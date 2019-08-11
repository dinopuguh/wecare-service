import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('WeCare Webservice')
    .setDescription('The WeCare API Description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('user')
    .addBearerAuth()
    .setHost(process.env.SWAGGER_HOST)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
})();
