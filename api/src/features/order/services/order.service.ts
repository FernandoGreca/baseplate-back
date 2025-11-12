import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { CreateOrderDto, OrderItemDto } from '../dtos/order-item.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Order } from '../entities/order.entity';

type OrderModel = Model<HydratedDocument<Order>>;

@Injectable()
export class OrderService extends BaseService<HydratedDocument<Order>> {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: OrderModel,
  ) {
    super(orderModel);
  }

  async create(createOrderDto: CreateOrderDto) {
    const mappedItems = this.mapItems(createOrderDto.items);
    const orderTotal = this.calculateTotal(mappedItems);

    const newOrder = new this.orderModel({
      ...createOrderDto,
      items: mappedItems,
      order_total: orderTotal,
    });

    return await newOrder.save();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const updatePayload: Record<string, unknown> = { ...updateOrderDto };

    if (updateOrderDto.items) {
      const mappedItems = this.mapItems(updateOrderDto.items);
      updatePayload.items = mappedItems;
      updatePayload.order_total = this.calculateTotal(mappedItems);
    }

    return await this.orderModel.updateOne({ _id: id }, updatePayload);
  }

  async remove(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return await this.orderModel.deleteOne({ _id: id });
  }

  private mapItems(items: OrderItemDto[]) {
    return items.map((item) => ({
      product: new Types.ObjectId(item.product_id),
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
    }));
  }

  private calculateTotal(
    items: Array<{ unit_price: number; quantity: number }>,
  ) {
    return items.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0,
    );
  }
}
