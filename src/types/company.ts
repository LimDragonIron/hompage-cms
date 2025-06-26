export interface Company {
    id: number;
    name: string;
    postalCode?: string | null;
    address?: string | null;
    addressDetail?: string | null;
    phone?: string | null;
    email?: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}