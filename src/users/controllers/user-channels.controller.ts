import { Controller, Get, Query } from '@nestjs/common';
import { UserChannelsService } from '../services';
import { GetChannelQuery } from '../queries';

@Controller('user-channels')
export class UserChannelsController {
  constructor(private readonly userChannelsService: UserChannelsService) {}

  @Get('info')
  getUserChannelInfo(@Query() query: GetChannelQuery) {
    return this.userChannelsService.getUserChannelInfo(query);
  }

  @Get()
  getChannel(@Query() query: GetChannelQuery) {
    return this.userChannelsService.getChannel(query);
  }
}
