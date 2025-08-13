"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const db_datasource_1 = require("../datasources/db.datasource");
const models_1 = require("../models");
let ProductRepository = class ProductRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, vendorRepositoryGetter, orderRepositoryGetter) {
        super(models_1.Product, dataSource);
        this.vendorRepositoryGetter = vendorRepositoryGetter;
        this.orderRepositoryGetter = orderRepositoryGetter;
        this.orders = this.createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter);
        this.registerInclusionResolver('orders', this.orders.inclusionResolver);
        this.vendor = this.createBelongsToAccessorFor('vendor', vendorRepositoryGetter);
        this.registerInclusionResolver('vendor', this.vendor.inclusionResolver);
    }
    async findAvailableProducts() {
        return this.find({
            where: {
                isAvailable: true,
            },
            include: [
                {
                    relation: 'vendor',
                    scope: {
                        where: {
                            isAvailable: true,
                        },
                    },
                },
            ],
        });
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.db')),
    tslib_1.__param(1, repository_1.repository.getter('VendorRepository')),
    tslib_1.__param(2, repository_1.repository.getter('OrderRepository')),
    tslib_1.__metadata("design:paramtypes", [db_datasource_1.MongodbDataSource, Function, Function])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map