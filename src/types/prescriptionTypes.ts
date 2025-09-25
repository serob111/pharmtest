export type TPrescription = {
    archived_stamp: Date;
    cancelled_stamp: Date;
    created_stamp: Date;
    his_created_date: string;
    his_hospital_pharmacy_stock_id: number;
    his_status: string;
    id: string;
    status: string;
    modified_stamp: Date;
    prescription_created_stamp: Date;
    prescription_id: number;
    details: TPrescriptionDetail[];
};

export type TPrescriptionsList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TPrescription[];
    last_updated_stamp?: Date;
};

export type TCreatePrescriptionProp = {
    model: number | string;
    name: string;
    location: string;
    config: {
        ip_address: string;
        port: number;
        description?: string;
        kiro_prescription_type?: number;
        kiro_prescription_id?: number;
    };
};

export type TPrescriptionDetalItem = {
    id: string;
    item_id: string;
    medicine_id: number;
    appointment_date: string;
    medicine_name: string;
    dosage: string;
    dosage_unit: string;
    amount_in_package: string;
    package_unit: string;
};

export type TPrescriptionDetail = {
    id: string;
    his_prescription_details_id: number;
    patient_first_name: string;
    patient_last_name: string;
    patient_mrn: number;
    patient_date_of_birth: string;
    prescription_name: string;
    route: string;
    administration_speed: string;
    items: TPrescriptionDetalItem[];
    status: string;
    appoint_date: Date;
    final_container: string;
};