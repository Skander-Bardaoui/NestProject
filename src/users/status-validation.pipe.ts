import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class StatusValidationPipe implements PipeTransform {
  // Allowed status values
  readonly allowedStatuses = ['active', 'inactive', 'pending'];

  transform(value: any) {
    if (!value) return value; // allow empty (for optional updates)

    if (!this.allowedStatuses.includes(value)) {
      throw new BadRequestException(
        `Invalid status value. Allowed values: ${this.allowedStatuses.join(', ')}`,
      );
    }

    return value; // return the valid value
  }
}
