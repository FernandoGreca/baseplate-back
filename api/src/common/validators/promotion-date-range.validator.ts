import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '@nestjs/class-validator';

@ValidatorConstraint({ name: 'PromotionDateRange', async: false })
export class PromotionDateRangeValidator
  implements ValidatorConstraintInterface
{
  validate(_: unknown, args: ValidationArguments): boolean {
    const { promotion_start, promotion_end } = args.object as {
      promotion_start?: string | Date;
      promotion_end?: string | Date;
    };

    if (!promotion_start || !promotion_end) return true;

    const start = new Date(promotion_start);
    const end = new Date(promotion_end);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return false;
    }

    return start.getTime() <= end.getTime();
  }

  defaultMessage(): string {
    return 'promotion_start must be earlier than or equal to promotion_end';
  }
}
