"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const vendor_user_service_1 = require("../services/vendor-user.service");
const validator_service_1 = require("../services/validator.service");
const bcrypt = tslib_1.__importStar(require("bcryptjs"));
let VendorController = class VendorController {
    constructor(vendorRepository, vendorUserService) {
        this.vendorRepository = vendorRepository;
        this.vendorUserService = vendorUserService;
    }
    async register(vendor) {
        console.log('--- REQUÊTE REÇUE SUR /vendors/register ---');
        console.log('Données brutes reçues :', JSON.stringify(vendor, null, 2));
        (0, validator_service_1.validateCredentials)({ email: vendor.email, password: vendor.password });
        // Hash password
        const hashedPassword = await bcrypt.hash(vendor.password, 10);
        vendor.password = hashedPassword;
        const savedVendor = await this.vendorRepository.create(vendor);
        delete savedVendor.password;
        const token = await this.vendorUserService.generateToken(savedVendor);
        return {
            token,
            vendor: savedVendor,
        };
    }
    async login(credentials) {
        const vendor = await this.vendorUserService.verifyCredentials(credentials);
        const token = await this.vendorUserService.generateToken(vendor);
        delete vendor.password;
        return {
            token,
            vendor,
        };
    }
    async getCurrentVendor(currentUser) {
        const vendor = await this.vendorRepository.findById(currentUser.id, {
            fields: { password: false },
        });
        return vendor;
    }
    async count(where) {
        return this.vendorRepository.count(where);
    }
    async find(filter) {
        return this.vendorRepository.find({
            ...filter,
            fields: { password: false, ...filter?.fields },
        });
    }
    async findById(id, filter) {
        return this.vendorRepository.findById(id, {
            ...filter,
            fields: { password: false, ...filter?.fields },
        });
    }
    async updateById(id, vendor, currentUser) {
        // Ensure vendor can only update their own profile
        if (currentUser.id !== id) {
            throw new Error('Unauthorized');
        }
        vendor.updatedAt = new Date();
        await this.vendorRepository.updateById(id, vendor);
    }
    async toggleAvailability(id, currentUser) {
        if (currentUser.id !== id) {
            throw new Error('Unauthorized');
        }
        const vendor = await this.vendorRepository.findById(id);
        await this.vendorRepository.updateById(id, {
            isAvailable: !vendor.isAvailable,
            updatedAt: new Date(),
        });
    }
    async deleteById(id, currentUser) {
        if (currentUser.id !== id) {
            throw new Error('Unauthorized');
        }
        await this.vendorRepository.deleteById(id);
    }
};
exports.VendorController = VendorController;
tslib_1.__decorate([
    (0, rest_1.post)('/vendors/register'),
    (0, rest_1.response)(200, {
        description: 'Vendor registration',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        vendor: (0, rest_1.getModelSchemaRef)(models_1.Vendor, { exclude: ['password'] }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vendor, {
                    title: 'VendorRegistration',
                    exclude: ['id', 'createdAt', 'updatedAt'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "register", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vendors/login'),
    (0, rest_1.response)(200, {
        description: 'Vendor login',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        vendor: (0, rest_1.getModelSchemaRef)(models_1.Vendor, { exclude: ['password'] }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                    },
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vendors/me'),
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.response)(200, {
        description: 'Current vendor profile',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vendor, { exclude: ['password'] }),
            },
        },
    }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "getCurrentVendor", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vendors/count'),
    (0, rest_1.response)(200, {
        description: 'Vendor model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Vendor)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vendors'),
    (0, rest_1.response)(200, {
        description: 'Array of Vendor model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Vendor, {
                        includeRelations: true,
                        exclude: ['password'],
                    }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Vendor)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vendors/{id}'),
    (0, rest_1.response)(200, {
        description: 'Vendor model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vendor, {
                    includeRelations: true,
                    exclude: ['password'],
                }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Vendor, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/vendors/{id}'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(204, {
        description: 'Vendor PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vendor, { partial: true, exclude: ['id', 'email'] }),
            },
        },
    })),
    tslib_1.__param(2, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/vendors/{id}/availability'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(204, {
        description: 'Toggle vendor availability',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "toggleAvailability", null);
tslib_1.__decorate([
    (0, rest_1.del)('/vendors/{id}'),
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({ allowedRoles: ['vendor'] }),
    (0, rest_1.response)(204, {
        description: 'Vendor DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorController.prototype, "deleteById", null);
exports.VendorController = VendorController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.VendorRepository)),
    tslib_1.__param(1, (0, core_1.inject)('services.VendorUserService')),
    tslib_1.__metadata("design:paramtypes", [repositories_1.VendorRepository,
        vendor_user_service_1.VendorUserService])
], VendorController);
//# sourceMappingURL=vendor.controller.js.map