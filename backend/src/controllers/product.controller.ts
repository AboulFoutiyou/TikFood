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
import {Product} from '../models';
import {ProductRepository, VendorRepository} from '../repositories';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(VendorRepository)
    public vendorRepository: VendorRepository,
  ) {}

  @post('/products')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<Product> {
    product.vendorId = currentUser.id;
    return this.productRepository.create(product);
  }

  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Product) where?: Where<Product>): Promise<Count> {
    return this.productRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Product) filter?: Filter<Product>): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @get('/products/feed')
  @response(200, {
    description: 'Available products for feed',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async getFeed(): Promise<Product[]> {
    return this.productRepository.findAvailableProducts();
  }

  @get('/products/vendor/{vendorId}')
  @response(200, {
    description: 'Products by vendor',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async findByVendor(
    @param.path.number('vendorId') vendorId: number,
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find({
      ...filter,
      where: {vendorId, ...filter?.where},
    });
  }

  @get('/products/my-products')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(200, {
    description: 'Current vendor products',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async getMyProducts(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find({
      ...filter,
      where: {vendorId: currentUser.id, ...filter?.where},
    });
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<Product> {
    return this.productRepository.findById(id, filter);
  }

  @patch('/products/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true, exclude: ['id', 'vendorId']}),
        },
      },
    })
    product: Partial<Product>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    // Verify ownership
    const existingProduct = await this.productRepository.findById(id);
    if (existingProduct.vendorId !== currentUser.id) {
      throw new Error('Unauthorized');
    }

    product.updatedAt = new Date();
    await this.productRepository.updateById(id, product);
  }

  @patch('/products/{id}/availability')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Toggle product availability',
  })
  async toggleAvailability(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (product.vendorId !== currentUser.id) {
      throw new Error('Unauthorized');
    }

    await this.productRepository.updateById(id, {
      isAvailable: !product.isAvailable,
      updatedAt: new Date(),
    });
  }

  @del('/products/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['vendor']})
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (product.vendorId !== currentUser.id) {
      throw new Error('Unauthorized');
    }
    await this.productRepository.deleteById(id);
  }
}