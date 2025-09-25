export type TRole = {
    id: number;
    label: string;
    slug: string;
};

export type TUser = {
    profile_photo_thumbnail?: string;
    id: number;
    email: string;
    is_active: boolean;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    clinic_role: number | string;
    two_factor_enabled: boolean;
    language: string;
};

export type TUsersList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TUser[];
};