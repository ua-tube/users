import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, isNotEmpty } from 'class-validator';

@Injectable()
export class ImageValidatorService {
  private readonly logger = new Logger(ImageValidatorService.name);

  constructor(private readonly jwtService: JwtService) {}

  async validateImageToken(
    token: string,
    validUserId: string,
    validCategory?: string,
  ) {
    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(token);
    } catch {
      this.logger.error('Failed to validate thumbnail upload token');
      throw new UnauthorizedException(
        'Failed to validate thumbnail upload token',
      );
    }

    if (
      isEmpty(decoded.userId) ||
      isEmpty(decoded.imageFileId) ||
      validUserId != decoded.userId ||
      (isNotEmpty(validCategory) && validCategory !== decoded.category)
    ) {
      throw new BadRequestException('Upload token is invalid');
    }

    return { imageFileId: decoded.imageFileId, url: decoded.url };
  }
}
