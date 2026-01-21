export interface Address {
    id: string;
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    mobile: string;
}

export interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
}