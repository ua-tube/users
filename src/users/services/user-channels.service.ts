import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Creator,
  CreatorDocument,
  UserChannel,
  UserChannelDocument,
} from '../../common/schemas';
import { Model } from 'mongoose';
import { GetChannelQuery } from '../queries';
import { isEmpty } from 'class-validator';
import { CreatorCreatedPayload } from '../types';
import { CreatorStatus } from '../../common/enums';

@Injectable()
export class UserChannelsService {
  constructor(
    @InjectModel(Creator.name)
    private readonly creatorModel: Model<CreatorDocument>,
    @InjectModel(UserChannel.name)
    private readonly userChannelModel: Model<UserChannelDocument>,
  ) {}

  async getUserChannelInfo(query: GetChannelQuery) {
    if (isEmpty(query.userId) && isEmpty(query.nickname)) {
      throw new BadRequestException('No searchable fields specified');
    }

    const searchFilter = isEmpty(query.userId)
      ? { nickname: query.nickname }
      : { userId: query.userId };

    const [creator, channel] = await Promise.all([
      this.creatorModel.findOne(searchFilter),
      this.userChannelModel.findOne(searchFilter),
    ]);

    return { creator, channel };
  }

  async getChannel(query: GetChannelQuery) {
    if (isEmpty(query.userId) && isEmpty(query.nickname)) {
      throw new BadRequestException('No searchable fields specified');
    }

    const channel = await this.userChannelModel
      .findOne(
        isEmpty(query.userId)
          ? { nickname: query.nickname }
          : { userId: query.userId },
      )
      .lean();

    return channel;
  }

  async createChannel(payload: CreatorCreatedPayload) {
    try {
      await this.userChannelModel.create({
        userId: payload.userId,
        nickname: payload.nickname,
      });
    } catch (e: any) {
      await this.creatorModel.updateOne(
        { nickname: payload.nickname },
        { $set: { status: CreatorStatus.RegistrationFailed } },
      );

      if (e?.code === 11000) {
        throw new ConflictException(e);
      }
      throw new BadRequestException(e);
    }

    await this.creatorModel.updateOne(
      { nickname: payload.nickname },
      { $set: { status: CreatorStatus.Registered } },
    );
  }
}
