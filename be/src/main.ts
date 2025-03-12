import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { core } from 'src/common/config/core.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup swagger docs
  const config = new DocumentBuilder()
    .setTitle(core.docsTitle)
    .setDescription(core.docsDescription)
    .setVersion(core.defaultVersion)
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(core.docsPath, app, documentFactory);

  // setup api versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: core.defaultVersion,
  });

  await app.listen(process.env.PORT ?? core.port);
}
bootstrap();
