import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Creator, CreatorDocument } from '../../common/schemas';
import { GetCreatorQuery } from '../queries';
import { Model } from 'mongoose';
import { isEmpty, isNotEmpty } from 'class-validator';
import { UpsertCreatorDto } from '../dto';
import { ImageValidatorService } from './image-validator.service';
import {
  USER_UPLOADED_THUMBNAIL,
  VIDEO_MANAGER_SVC,
} from '../../common/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { UpsertCreatorEvent } from '../../common/events';
import { CreatorStatus } from '../../common/enums';

@Injectable()
export class CreatorsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreatorsService.name);

  constructor(
    @InjectModel(Creator.name)
    private readonly creatorModel: Model<CreatorDocument>,
    private readonly imageValidatorService: ImageValidatorService,
    @Inject(VIDEO_MANAGER_SVC)
    private readonly videoManagerClient: ClientRMQ,
  ) {}

  onApplicationBootstrap(): void {
    this.videoManagerClient
      .connect()
      .then(() =>
        this.logger.log(`${VIDEO_MANAGER_SVC} connection established`),
      )
      .catch(() => this.logger.error(`${VIDEO_MANAGER_SVC} connection failed`));
  }

  async create(dto: UpsertCreatorDto, userId: string) {
    const thumbnail = isNotEmpty(dto.thumbnailToken)
      ? await this.imageValidatorService.validateImageToken(
          dto.thumbnailToken,
          userId,
          USER_UPLOADED_THUMBNAIL,
        )
      : undefined;

    try {
      const creator = await this.creatorModel.create({
        userId,
        displayName: dto.displayName,
        nickname: dto.nickname,
        thumbnail,
      });
      this.logger.log(
        `Creator created for user (${creator.userId}) with id (${creator.id})`,
      );

      // Emit upsert_creator to sync creator with VideoManager Microservice
      this.videoManagerClient.emit(
        'upsert_creator',
        new UpsertCreatorEvent(creator),
      );

      return creator;
    } catch (e: any) {
      if (e?.code === 11000) {
        throw new ConflictException(e);
      }
      throw new BadRequestException(e);
    }
  }

  async update(dto: UpsertCreatorDto, userId: string) {
    const thumbnail = isNotEmpty(dto.thumbnailToken)
      ? await this.imageValidatorService.validateImageToken(
          dto.thumbnailToken,
          userId,
          USER_UPLOADED_THUMBNAIL,
        )
      : undefined;

    try {
      const creator = await this.creatorModel.findOneAndUpdate(
        { userId },
        {
          displayName: dto.displayName,
          nickname: dto.nickname,
          thumbnail,
        },
        { new: true, lean: true },
      );
      this.logger.log(
        `Creator updated for user (${creator.userId}) with id (${creator.id})`,
      );

      // Emit upsert_creator to sync creator with VideoManager Microservice
      this.videoManagerClient.emit(
        'upsert_creator',
        new UpsertCreatorEvent(creator),
      );

      return creator;
    } catch (e: any) {
      if (e?.code === 11000) {
        throw new ConflictException(e);
      }
      throw new BadRequestException(e);
    }
  }

  async getCreator(query: GetCreatorQuery) {
    if (isEmpty(query.userId) && isEmpty(query.nickname)) {
      throw new BadRequestException('No searchable fields specified');
    }

    const creator = await this.creatorModel
      .findOne(
        isEmpty(query.userId)
          ? { nickname: query.nickname }
          : { userId: query.userId },
      )
      .lean();

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async setRegistrationFailed(userId: string) {
    await this.creatorModel.updateOne(
      { userId },
      { $set: { status: CreatorStatus.RegistrationFailed } },
    );
  }
}
