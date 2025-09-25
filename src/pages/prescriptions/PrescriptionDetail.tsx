import { useEffect, useState } from 'react';
import { IconMaterial } from '../../components/shared/iconMaterial/IconMaterial';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import { TPrescriptionDetail, TPrescriptionDetalItem } from '../../types/prescriptionTypes';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { useLocation, useParams } from 'react-router';
import LoadingSpinner from '../../components/shared/ui/LoadingSpinner';





function PrescriptionDetail() {
    const [activeTab, setActiveTab] = useState('prescription');
    const [expandedPrescriptions, setExpandedPrescriptions] = useState<string[]>([]);
    const { t } = useTranslation()
    const { id } = useParams();
    const { getPrescriptionDetail, prescriptionDetail, prescriptionsLoading } = usePrescriptions();
    const { state } = useLocation();
    
    useEffect(() => {
        if (state?.id) {
            getPrescriptionDetail(state?.id)
        }
    }, [state?.id])

    const i18nPrescriptionDirectory = (key: string): string =>
        t(`prescription-directory.${key}`);
    const togglePrescription = (id: string) => {
        setExpandedPrescriptions(prev =>
            prev.includes(id)
                ? prev.filter(prescId => prescId !== id)
                : [...prev, id]
        );
    };

    const [sortConfig, setSortConfig] = useState<{
        field: keyof TPrescriptionDetalItem | null;
        direction: 'asc' | 'desc';
    }>({
        field: null,
        direction: 'asc',
    });


    const handleSort = (field: keyof TPrescriptionDetalItem) => {
        setSortConfig((prev) => {
            const direction = prev.direction === 'asc' ? 'desc' : 'asc';
            return { field, direction };
        });
    };




    const columns = [
        { id: "item_id", label: i18nPrescriptionDirectory("id"), icon: "swap_vert", onclick: () => handleSort("item_id") },
        { id: "medicine_id", label: i18nPrescriptionDirectory("med-id") },

        { id: "medicine_name", label: i18nPrescriptionDirectory("name") },
        { id: "dosage", label: i18nPrescriptionDirectory("dosage") },
        { id: "dosage_unit", label: i18nPrescriptionDirectory("dosage-unit") },
        { id: "amount_in_package", label: i18nPrescriptionDirectory("amount") },
        { id: "package_unit", label: i18nPrescriptionDirectory("unit") },
    ];

    return (
        <div className="relative h-screen  flex flex-col overflow-x-hidden">
            <Header
                title={`P-${id} (from ${prescriptionDetail?.his_created_date})`}
                status={prescriptionDetail?.his_status}
                crumbs={[{ path: '/prescriptions/', name: i18nPrescriptionDirectory('prescriptions') }, { name: id ? 'P-' + id : "P-", path: '' }]}
            />

            <div className=" border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('prescription')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'prescription'
                                    ? 'border-primeblue text-primeblue'
                                    : 'border-transparent  text-primary-light'
                                    }`}
                            >
                                {i18nPrescriptionDirectory("presc-details")}
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity'
                                    ? 'border-primeblue text-primeblue'
                                    : 'border-transparent  text-primary-light'
                                    }`}
                            >
                                {i18nPrescriptionDirectory("activity-log")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {prescriptionsLoading && (
                <div className="flex items-center justify-center p-8">
                    <LoadingSpinner text="Loading prescription details..." />
                </div>
            )}

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm  overflow-hidden">
                    <div className=" w-full px-6 py-3 ">
                        <div className="w-full flex justify-between">
                            {
                                columns.map((col, index) =>
                                    <div key={index} className="col-span-1 text-secondary-extralight w-full text-xs flex">
                                        <p title={col.label} className="truncate">{col.label}</p>
                                        {col.icon && (
                                            <IconMaterial
                                                filled
                                                icon={col.icon}
                                                className="cursor-pointer shrink-0"
                                                size={20}
                                                iconColor="var(--tokens-text-secondary-text)"
                                                onClick={col?.onclick}
                                            />
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {prescriptionDetail?.details.map((prescription: TPrescriptionDetail) => (
                            <div key={prescription.id}>
                                <div
                                    className="py-4 bg-background-light-gray  cursor-pointer  rounded-xl overflow-hidden transition-colors"
                                    onClick={() => togglePrescription(prescription.id)}
                                >
                                    <div className="flex items-center">
                                        <div className="flex items-center ">
                                            {expandedPrescriptions.includes(prescription.id) ? (
                                                <IconMaterial
                                                    filled
                                                    icon="expand_less"
                                                    className="cursor-pointer ml-4 text-primary-light"
                                                    size={20}
                                                />
                                            ) : (
                                                <IconMaterial
                                                    filled
                                                    icon="expand_more"
                                                    className="cursor-pointer ml-4 text-primary-light"
                                                    size={20}
                                                />
                                            )}
                                        </div>
                                        <div className="gap-4 items-center flex-1 px-4">
                                            <div className="w-full flex justify-between ">
                                                <span className=" w-full flex text-primary-dark items-center gap-2 text-sm">
                                                    {prescription.his_prescription_details_id} : {prescription.prescription_name}
                                                    <p className='text-secondary-extralight text-xs'>{`${prescription.route}`}</p>
                                                    <p className='text-secondary-extralight text-xs'>{`(${prescription.administration_speed})`}</p>
                                                </span>
                                            </div>
                                            <div className="w-full">
                                                <div className="text-xs mt-1 flex gap-1">
                                                    <span className='text-secondary-extralight'>Patient:</span>
                                                    <div className='flex gap-2 text-secondary-extralight font-medium'>
                                                        <span>{prescription.patient_first_name} {prescription.patient_last_name}</span>
                                                        <span>MRN: {prescription.patient_mrn}</span>
                                                        <span>DoB: {prescription.patient_date_of_birth}</span>
                                                        <span>{i18nPrescriptionDirectory("date")}: {prescription?.appoint_date?.toDateString() || t('common.notProvidedYet')}</span>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {expandedPrescriptions.includes(prescription.id) && (
                                    <div className="bg-gray-50/50">
                                        {[...prescription.items]
                                            .sort((a, b) => {
                                                if (!sortConfig.field) return 0;
                                                const aVal = a?.[sortConfig.field];
                                                const bVal = b?.[sortConfig.field];

                                                if (aVal == null && bVal == null) return 0;
                                                if (aVal == null) return 1;
                                                if (bVal == null) return -1;

                                                const aStr = String(aVal).toLowerCase();
                                                const bStr = String(bVal).toLowerCase();

                                                if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
                                                if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
                                                return 0;
                                            })
                                            .map((med: TPrescriptionDetalItem) => (
                                                <div key={med.id} className="px-6 py-3 border-t border-gray-100">
                                                    <div className="w-full flex justify-between items-center text-sm text-primary-light">
                                                        <div className="w-full">{med.item_id || t('common.notProvidedYet')}</div>
                                                        <div className="w-full">{med.medicine_id || t('common.notProvidedYet')}</div>
                                                        <div className="w-full">{med.medicine_name || t('common.notProvidedYet')}</div>
                                                        <div className="w-full">{med.dosage || t('common.notProvidedYet')}</div>
                                                        <div className="w-full">{med.dosage_unit || t('common.notProvidedYet')}</div>
                                                        <div className="w-full">{med.amount_in_package || t('common.notProvidedYet')}</div>
                                                        <div className="w-full">{med.package_unit || t('common.notProvidedYet')}</div>
                                                    </div>
                                                </div>
                                            ))}

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrescriptionDetail;