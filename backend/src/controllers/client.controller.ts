import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Client, Order} from '../models';
import {ClientRepository, OrderRepository} from '../repositories';
import * as bcrypt from 'bcryptjs';
import { Credentials } from '../types';
import { ClientUserService } from '../services/client-user.service';

export class ClientController {
  constructor(
    @inject('repositories.ClientRepository')
    public clientRepository: ClientRepository,
    @inject('repositories.OrderRepository')
    public orderRepository: OrderRepository,
    @inject('services.ClientUserService')
    public clientUserService: ClientUserService,
  ) {}

  // Inscription
  @post('/clients/register')
  @response(200, {
    description: 'Client registration',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            client: getModelSchemaRef(Client, {exclude: ['password']}),
          },
        },
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'ClientRegistration',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    // Hash password
    const hashedPassword = await bcrypt.hash(client.password, 10);
    client.password = hashedPassword;

    const savedClient = await this.clientRepository.create(client);
    delete (savedClient as any).password;

    return {client: savedClient};
  }

  // Connexion
  @post('/clients/login')
  @response(200, {
    description: 'Client login',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            client: getModelSchemaRef(Client, {exclude: ['password']}),
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 8},
            },
          },
        },
      },
    })
    credentials: Credentials,
  ) {
    const client = await this.clientUserService.verifyCredentials(credentials);
    const token = await this.clientUserService.generateToken(client);
    delete (client as any).password;
    return {token, client};
  }

  // Commander
  @post('/clients/{clientId}/orders')
  @response(200, {
    description: 'Client places an order',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order),
      },
    },
  })
  async placeOrder(
    @param.path.string('clientId') clientId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            exclude: ['id'],
          }),
        },
      },
    })
    orderData: Omit<Order, 'id' | 'clientId'>,
  ): Promise<Order> {
    return this.clientRepository.orders(clientId).create(orderData);
  }
}