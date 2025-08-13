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
import {Vendor} from '../models';
import {VendorRepository} from '../repositories';
import {VendorUserService} from '../services/vendor-user.service';
import {Credentials} from '../types';
import {validateCredentials} from '../services/validator.service';
import * as bcrypt from 'bcryptjs';

export class VendorController {
  constructor(
    @repository(VendorRepository)
    public vendorRepository: VendorRepository,
    @inject('services.VendorUserService')
    public vendorUserService: VendorUserService,
  ) {}

  @post('/vendors/register')
  @response(200, {
    description: 'Vendor registration',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            vendor: getModelSchemaRef(Vendor, {exclude: ['password']}),
          },
        },
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {
            title: 'VendorRegistration',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>,
  ) {

    console.log('--- REQUÊTE REÇUE SUR /vendors/register ---');
        console.log('Données brutes reçues :', JSON.stringify(vendor, null, 2));
        
    validateCredentials({email: vendor.email, password: vendor.password});

    // Hash password
    const hashedPassword = await bcrypt.hash(vendor.password, 10);
    vendor.password = hashedPassword;

    const savedVendor = await this.vendorRepository.create(vendor);
    delete (savedVendor as any).password;

    const token = await this.vendorUserService.generateToken(savedVendor);

    return {
      token,
      vendor: savedVendor,
    };
  }

  @post('/vendors/login')
  @response(200, {
    description: 'Vendor login',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            vendor: getModelSchemaRef(Vendor, {exclude: ['password']}),
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
              password: {type: 'string', minLength: 6},
            },
          },
        },
      },
    })
    credentials: Credentials,
  ) {
    const vendor = await this.vendorUserService.verifyCredentials(credentials);
    const token = await this.vendorUserService.generateToken(vendor);

    delete (vendor as any).password;

    return {
      token,
      vendor,
    };
  }

  @get('/vendors/me')
  @authenticate('jwt')
  @response(200, {
    description: 'Current vendor profile',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vendor, {exclude: ['password']}),
      },
    },
  })
  async getCurrentVendor(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<Vendor> {
    const vendor = await this.vendorRepository.findById(currentUser.id, {
      fields: {password: false},
    });
    return vendor;
  }

  @get('/vendors/count')
  @response(200, {
    description: 'Vendor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Vendor) where?: Where<Vendor>): Promise<Count> {
    return this.vendorRepository.count(where);
  }

  @get('/vendors')
  @response(200, {
    description: 'Array of Vendor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vendor, {
            includeRelations: true,
            exclude: ['password'],
          }),
        },
      },
    },
  })
  async find(@param.filter(Vendor) filter?: Filter<Vendor>): Promise<Vendor[]> {
    return this.vendorRepository.find({
      ...filter,
      fields: {password: false, ...filter?.fields},
    });
  }

  @get('/vendors/{id}')
  @response(200, {
    description: 'Vendor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vendor, {
          includeRelations: true,
          exclude: ['password'],
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: string,
    @param.filter(Vendor, {exclude: 'where'})
    filter?: FilterExcludingWhere<Vendor>,
  ): Promise<Vendor> {
    return this.vendorRepository.findById(id, {
      ...filter,
      fields: {password: false, ...filter?.fields},
    });
  }

  @patch('/vendors/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Vendor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {partial: true, exclude: ['id', 'email']}),
        },
      },
    })
    vendor: Partial<Vendor>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    // Ensure vendor can only update their own profile
    if (currentUser.id !== id) {
      throw new Error('Unauthorized');
    }

    vendor.updatedAt = new Date();
    await this.vendorRepository.updateById(id, vendor);
  }

  @patch('/vendors/{id}/availability')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Toggle vendor availability',
  })
  async toggleAvailability(
    @param.path.number('id') id: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    if (currentUser.id !== id) {
      throw new Error('Unauthorized');
    }

    const vendor = await this.vendorRepository.findById(id);
    await this.vendorRepository.updateById(id, {
      isAvailable: !vendor.isAvailable,
      updatedAt: new Date(),
    });
  }

  @del('/vendors/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Vendor DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    if (currentUser.id !== id) {
      throw new Error('Unauthorized');
    }
    await this.vendorRepository.deleteById(id);
  }
}