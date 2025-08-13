"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ProductController = class ProductController {
    constructor(productRepository, vendorRepository) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
    }
    async create(product, currentUser) {
        product.vendorId = currentUser.id;
        return this.productRepository.create(product);
    }
    async count(where) {
        return this.productRepository.count(where);
    }
    async find(filter) {
        return this.productRepository.find(filter);
    }
    async getFeed() {
        return this.productRepository.findAvailableProducts();
    }
    async findByVendor(vendorId, filter) {
        return this.productRepository.find({
            ...filter,
            where: { vendorId, ...filter?.where },
        });
    }
    async getMyProducts(currentUser, filter) {
        return this.productRepository.find({
            ...filter,
            where: { vendorId: currentUser.id, ...filter?.where },
        });
    }
    async findById(id, filter) {
        return this.productRepository.findById(id, filter);
    }
    async updateById(id, product, currentUser) {
        // Verify ownership
        const existingProduct = await this.productRepository.findById(id);
        if (existingProduct.vendorId !== currentUser.id) {
            throw new Error('Unauthorized');
        }
        product.updatedAt = new Date();
        await this.productRepository.updateById(id, product);
    }
    async toggleAvailability(id, currentUser) {
        const product = await this.productRepository.findById(id);
        if (product.vendorId !== currentUser.id) {
            throw new Error('Unauthorized');
        }
        await this.productRepository.updateById(id, {
            isAvailable: !product.isAvailable,
            updatedAt: new Date(),
        });
    }
    async deleteById(id, currentUser) {
        const product = await this.productRepository.findById(id);
        if (product.vendorId !== currentUser.id) {
            throw new Error('Unauthorized');
        }
        await this.productRepository.deleteById(id);
    }
};
exports.ProductController = ProductController;
tslib_1.__decorate([
    (0, rest_1.post)('/products'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(200, {
        description: 'Product model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Product) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Product, {
                    title: 'NewProduct',
                    exclude: ['id', 'createdAt', 'updatedAt'],
                }),
            },
        },
    })),
    tslib_1.__param(1, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/count'),
    (0, rest_1.response)(200, {
        description: 'Product model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Product)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products'),
    (0, rest_1.response)(200, {
        description: 'Array of Product model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Product, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Product)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/feed'),
    (0, rest_1.response)(200, {
        description: 'Available products for feed',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Product, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "getFeed", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/vendor/{vendorId}'),
    (0, rest_1.response)(200, {
        description: 'Products by vendor',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Product, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('vendorId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Product)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findByVendor", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/my-products'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(200, {
        description: 'Current vendor products',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Product, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__param(1, rest_1.param.filter(models_1.Product)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "getMyProducts", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/{id}'),
    (0, rest_1.response)(200, {
        description: 'Product model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Product, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Product, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/products/{id}'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(204, {
        description: 'Product PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Product, { partial: true, exclude: ['id', 'vendorId'] }),
            },
        },
    })),
    tslib_1.__param(2, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/products/{id}/availability'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(204, {
        description: 'Toggle product availability',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "toggleAvailability", null);
tslib_1.__decorate([
    (0, rest_1.del)('/products/{id}'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(204, {
        description: 'Product DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "deleteById", null);
exports.ProductController = ProductController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ProductRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.VendorRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ProductRepository,
        repositories_1.VendorRepository])
], ProductController);
//# sourceMappingURL=product.controller.js.map