import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Order, OrderStatus} from '../models';
import {OrderRepository, ProductRepository} from '../repositories';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

@post('/orders')
@response(200, {
  description: 'Order model instance',
  content: {'application/json': {schema: getModelSchemaRef(Order)}},
})
async create(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {
          title: 'NewOrder',
          exclude: ['id', 'createdAt', 'updatedAt'],
        }),
      },
    },
  })
  order: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Order> {
  const product = await this.productRepository.findById(order.productId);
  order.vendorId = product.vendorId;
  return this.orderRepository.create(order as Order);
}

  @get('/orders/count')
  @response(200, {
    description: 'Order model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Order) where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }

  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Order) filter?: Filter<Order>): Promise<Order[]> {
    return this.orderRepository.find(filter);
  }

  @get('/orders/my-orders')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(200, {
    description: 'Current vendor orders',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async getMyOrders(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.filter(Order) filter?: Filter<Order>,
  ): Promise<Order[]> {
    return this.orderRepository.find({
      ...filter,
      where: {vendorId: currentUser.id, ...filter?.where},
      include: ['product'],
      order: ['createdAt DESC'],
    });
  }

  @get('/orders/analytics')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(200, {
    description: 'Order analytics for current vendor',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            totalOrders: {type: 'number'},
            totalRevenue: {type: 'number'},
            todayOrders: {type: 'number'},
            todayRevenue: {type: 'number'},
            weeklyOrders: {type: 'array', items: {type: 'number'}},
            weeklyRevenue: {type: 'array', items: {type: 'number'}},
            topProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string'},
                  orders: {type: 'number'},
                  revenue: {type: 'number'},
                },
              },
            },
            ordersByStatus: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  status: {type: 'string'},
                  count: {type: 'number'},
                },
              },
            },
          },
        },
      },
    },
  })
  async getAnalytics(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<any> {
    const orders = await this.orderRepository.find({
      where: {vendorId: currentUser.id},
      include: ['product'],
    });

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayOrders = orders.filter(order => order.orderDate! >= todayStart);
    
    // Weekly data (last 7 days)
    const weeklyOrders = new Array(7).fill(0);
    const weeklyRevenue = new Array(7).fill(0);
    
    orders.forEach(order => {
      const daysDiff = Math.floor((today.getTime() - order.orderDate!.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        const dayIndex = 6 - daysDiff;
        weeklyOrders[dayIndex]++;
        weeklyRevenue[dayIndex] += order.totalPrice;
      }
    });

    // Top products
    const productStats: { [key: string]: { name: string; orders: number; revenue: number } } = {};
    
    orders.forEach(order => {
      const productName = (order as any).product?.name || 'Unknown Product';
      if (!productStats[order.productId]) {
        productStats[order.productId] = {
          name: productName,
          orders: 0,
          revenue: 0
        };
      }
      productStats[order.productId].orders++;
      productStats[order.productId].revenue += order.totalPrice;
    });
    
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Orders by status
    const statusCounts: { [key: string]: number } = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalPrice, 0),
      weeklyOrders,
      weeklyRevenue,
      topProducts,
      ordersByStatus,
    };
  }

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Order, {exclude: 'where'})
    filter?: FilterExcludingWhere<Order>,
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @patch('/orders/{id}/status')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Update order status',
  })
  async updateStatus(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['status'],
            properties: {
              status: {
                type: 'string',
                enum: Object.values(OrderStatus),
              },
            },
          },
        },
      },
    })
    statusUpdate: {status: OrderStatus},
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    // Verify ownership
    const order = await this.orderRepository.findById(id);
    if (order.vendorId !== currentUser.id) {
      throw new Error('Unauthorized');
    }

    await this.orderRepository.updateById(id, {
      status: statusUpdate.status,
      updatedAt: new Date(),
    });
  }

  @patch('/orders/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Order PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true, exclude: ['id', 'vendorId', 'productId']}),
        },
      },
    })
    order: Partial<Order>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    // Verify ownership
    const existingOrder = await this.orderRepository.findById(id);
    if (existingOrder.vendorId !== currentUser.id) {
      throw new Error('Unauthorized');
    }

    order.updatedAt = new Date();
    await this.orderRepository.updateById(id, order);
  }

  @del('/orders/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Order DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (order.vendorId !== currentUser.id) {
      throw new Error('Unauthorized');
    }
    await this.orderRepository.deleteById(id);
  }
}