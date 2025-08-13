import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Vendor } from '../models';
import { VendorRepository } from '../repositories';
import { VendorUserService } from '../services/vendor-user.service';
import { Credentials } from '../types';
export declare class VendorController {
    vendorRepository: VendorRepository;
    vendorUserService: VendorUserService;
    constructor(vendorRepository: VendorRepository, vendorUserService: VendorUserService);
    register(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
        token: string;
        vendor: Vendor;
    }>;
    login(credentials: Credentials): Promise<{
        token: string;
        vendor: Vendor;
    }>;
    getCurrentVendor(currentUser: UserProfile): Promise<Vendor>;
    count(where?: Where<Vendor>): Promise<Count>;
    find(filter?: Filter<Vendor>): Promise<Vendor[]>;
    findById(id: string, filter?: FilterExcludingWhere<Vendor>): Promise<Vendor>;
    updateById(id: string, vendor: Partial<Vendor>, currentUser: UserProfile): Promise<void>;
    toggleAvailability(id: string, currentUser: UserProfile): Promise<void>;
    deleteById(id: string, currentUser: UserProfile): Promise<void>;
}
