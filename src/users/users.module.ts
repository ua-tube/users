import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Creator,
  CreatorSchema,
  ImageFile,
  ImageFileSchema,
  UserChannel,
  UserChannelSchema,
} from '../common/schemas';
import {
  CreatorsController,
  RmqController,
  UserChannelsController,
  UsersController,
} from './controllers';
import {
  CreatorsService,
  ImageValidatorService,
  UserChannelsService,
  UsersService,
} from './services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from '../common/interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VIDEO_MANAGER_SVC } from '../common/constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          subject: 'upload-token',
          expiresIn: '5m',
          issuer: configService.get<string>('JWT_ISSUER'),
          audience: configService.get<string>('JWT_AUDIENCE'),
        },
        verifyOptions: {
          subject: 'upload-token',
          ignoreExpiration: false,
          issuer: configService.get<string>('JWT_ISSUER'),
          audience: configService.get<string>('JWT_AUDIENCE'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: ImageFile.name, schema: ImageFileSchema },
      { name: UserChannel.name, schema: UserChannelSchema },
      { name: Creator.name, schema: CreatorSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: VIDEO_MANAGER_SVC,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('RABBITMQ_VIDEO_MANAGER_QUEUE'),
            persistent: true,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [
    UsersController,
    UserChannelsController,
    CreatorsController,
    RmqController,
  ],
  providers: [
    UsersService,
    UserChannelsService,
    CreatorsService,
    ImageValidatorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class UsersModule {}
