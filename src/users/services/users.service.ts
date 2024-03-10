import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Creator,
  CreatorDocument,
  UserChannel,
  UserChannelDocument,
} from '../../common/schemas';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Creator.name)
    private readonly creatorModel: Model<CreatorDocument>,
    @InjectModel(UserChannel.name)
    private readonly userChannelModel: Model<UserChannelDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async nicknameAvailabilityCheck(nickname: string) {
    if (!nickname) {
      throw new BadRequestException('No nickname specified to check');
    }

    const candidate = await this.creatorModel.findOne({ nickname }).lean();
    return { availability: !candidate };
  }

  async getUploadToken(userId: string, category: string) {
    const profile = await this.creatorModel.findOne({ userId });
    if (!profile) {
      throw new BadRequestException('Creator not found');
    }

    const token = await this.jwtService.signAsync({
      userId,
      category,
      imageId: randomUUID(),
    });

    return { token };
  }

  async getUserData(userId: string) {
    const [creator, channel] = await Promise.all([
      this.creatorModel.findOne({ userId }).lean(),
      this.userChannelModel.findOne({ userId }).lean(),
    ]);

    return { creator, channel };
  }
}
