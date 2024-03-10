import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatorsService } from '../services';
import { GetCreatorQuery } from '../queries';
import { AuthUserGuard } from '../../common/guards';
import { UserId } from '../../common/decorators';
import { UpsertCreatorDto } from '../dto';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @UseGuards(AuthUserGuard)
  @Post()
  create(@Body() dto: UpsertCreatorDto, @UserId() userId: string) {
    return this.creatorsService.create(dto, userId);
  }

  @UseGuards(AuthUserGuard)
  @Put()
  update(@Body() dto: UpsertCreatorDto, @UserId() userId: string) {
    return this.creatorsService.update(dto, userId);
  }

  @Get()
  getCreator(@Query() query: GetCreatorQuery) {
    return this.creatorsService.getCreator(query);
  }

  @UseGuards(AuthUserGuard)
  @Get('self')
  getSelf(@UserId() userId: string) {
    return this.creatorsService.getCreator({ userId });
  }
}
