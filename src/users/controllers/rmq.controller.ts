import { Controller } from '@nestjs/common';
import { CreatorsService, UserChannelsService } from '../services';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatorCreatedPayload } from '../types';

@Controller()
export class RmqController {
  constructor(
    private readonly creatorsService: CreatorsService,
    private readonly userChannelsService: UserChannelsService,
  ) {}

  @EventPattern('creator_creation_success')
  async handleCreatorCreationSuccess(
    @Payload() payload: CreatorCreatedPayload,
  ) {
    await this.userChannelsService.createChannel(payload);
  }

  @EventPattern('creator_creation_failed')
  async handleCreatorCreationFailed(@Payload() payload: { id: string }) {
    await this.creatorsService.setRegistrationFailed(payload.id);
  }
}
