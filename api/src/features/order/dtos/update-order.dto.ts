import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './order-item.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
