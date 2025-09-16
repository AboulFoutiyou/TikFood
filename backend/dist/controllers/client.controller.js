"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const bcrypt = tslib_1.__importStar(require("bcryptjs"));
const client_user_service_1 = require("../services/client-user.service");
let ClientController = class ClientController {
    constructor(clientRepository, orderRepository, clientUserService) {
        this.clientRepository = clientRepository;
        this.orderRepository = orderRepository;
        this.clientUserService = clientUserService;
    }
    // Inscription
    async register(client) {
        // Hash password
        const hashedPassword = await bcrypt.hash(client.password, 10);
        client.password = hashedPassword;
        const savedClient = await this.clientRepository.create(client);
        delete savedClient.password;
        return { client: savedClient };
    }
    // Connexion
    async login(credentials) {
        const client = await this.clientUserService.verifyCredentials(credentials);
        const token = await this.clientUserService.generateToken(client);
        delete client.password;
        return { token, client };
    }
    // Commander
    async placeOrder(clientId, orderData) {
        return this.clientRepository.orders(clientId).create(orderData);
    }
};
exports.ClientController = ClientController;
tslib_1.__decorate([
    (0, rest_1.post)('/clients/register'),
    (0, rest_1.response)(200, {
        description: 'Client registration',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        client: (0, rest_1.getModelSchemaRef)(models_1.Client, { exclude: ['password'] }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Client, {
                    title: 'ClientRegistration',
                    exclude: ['id', 'createdAt', 'updatedAt'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientController.prototype, "register", null);
tslib_1.__decorate([
    (0, rest_1.post)('/clients/login'),
    (0, rest_1.response)(200, {
        description: 'Client login',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        client: (0, rest_1.getModelSchemaRef)(models_1.Client, { exclude: ['password'] }),
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
                        password: { type: 'string', minLength: 8 },
                    },
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.post)('/clients/{clientId}/orders'),
    (0, rest_1.response)(200, {
        description: 'Client places an order',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Order),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('clientId')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Order, {
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientController.prototype, "placeOrder", null);
exports.ClientController = ClientController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('repositories.ClientRepository')),
    tslib_1.__param(1, (0, core_1.inject)('repositories.OrderRepository')),
    tslib_1.__param(2, (0, core_1.inject)('services.ClientUserService')),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ClientRepository,
        repositories_1.OrderRepository,
        client_user_service_1.ClientUserService])
], ClientController);
//# sourceMappingURL=client.controller.js.map