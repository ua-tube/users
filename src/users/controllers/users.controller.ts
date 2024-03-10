import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services';
import { AuthUserGuard } from '../../common/guards';
import { UserId } from '../../common/decorators';
import {
  USER_UPLOADED_BANNER,
  USER_UPLOADED_THUMBNAIL,
} from '../../common/constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthUserGuard)
  @Get('thumbnail/upload-token')
  getThumbnailUploadToken(@UserId() userId: string) {
    return this.usersService.getUploadToken(userId, USER_UPLOADED_THUMBNAIL);
  }

  @UseGuards(AuthUserGuard)
  @Get('banner/upload-token')
  getBannerUploadToken(@UserId() userId: string) {
    return this.usersService.getUploadToken(userId, USER_UPLOADED_BANNER);
  }

  @UseGuards(AuthUserGuard)
  @Get()
  getUserData(@UserId() userId: string) {
    return this.usersService.getUserData(userId);
  }

  @Get('nickname-check')
  nicknameAvailabilityCheck(@Query('nickname') nickname: string) {
    return this.usersService.nicknameAvailabilityCheck(nickname);
  }
}
