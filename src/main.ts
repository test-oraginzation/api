import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'service-account.json';

async function bootstrap() {
  const port = process.env.PORT || '3000';
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('WishList')
    .setDescription('WishList api description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.log(`Server listen port: ${port}, working`);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
    }),
  });

  try {
    const firebaseAppName = admin.app().name;
    console.log('Connected to Firebase: ', firebaseAppName);
  } catch (error) {
    console.log('Not connected to Firebase');
  }
}

bootstrap();
