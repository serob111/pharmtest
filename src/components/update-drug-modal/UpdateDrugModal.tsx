import React, { useState, useEffect, useCallback } from 'react';
import { useMeds } from '../../hooks/useMeds';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import CheckboxInput from '../shared/ui/input/CheckBoxInput';
import SelectInput from '../shared/ui/input/SelectInput';
import Input from '../shared/ui/input/Input';
import { useTranslation } from 'react-i18next';

export interface UpdateDrugModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ActiveIngredient {
    id: string;
    name_en: string;
}

interface DosageUnit {
    id: string;
    name_ru: string;
}

type DrugFormData =  {
    use_in_kiro?: boolean;
    active_ingredient: string;
    concentration: string;
    concentration_unit: string;
    vial_dose: string;
    vial_unit: string;
    density: string;
} 

const defaultFormData: DrugFormData = {
    use_in_kiro: false,
    active_ingredient: '',
    concentration: '',
    concentration_unit: '',
    vial_dose: '',
    vial_unit: '',
    density: '',
};

const UpdateDrugModal: React.FC<UpdateDrugModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState<DrugFormData>(defaultFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { t } = useTranslation()
    const {
        activeIngredients,
        dosageUnits,
        ingredientsLoading,
        unitsLoading,
        fetchIngredients,
        fetchUnits,
        drugDetail,
        alertMsgs,
        editDrug,
        setDrugDetail,
        setAlertMsgs
    } = useMeds();
    
    useEffect(() => {
        if (isOpen && drugDetail) {
            const ingredient = activeIngredients.find((elm) =>
                elm.name_en === drugDetail.kiro_details.active_ingredient
            );
            const concentration = dosageUnits.find((elm) =>
                elm.name_ru === drugDetail.kiro_details.concentration_unit
            )
            const vialUnit = dosageUnits.find((elm) =>
                elm.name_ru === drugDetail.kiro_details.vial_unit
            )
            setFormData({
                use_in_kiro: drugDetail.use_in_kiro || false,
                active_ingredient: String(ingredient?.id) || '',
                concentration: drugDetail.kiro_details.concentration || '',
                concentration_unit: String(concentration?.id) || '',
                vial_dose: drugDetail.kiro_details.vial_dose || '',
                vial_unit: String(vialUnit?.id) || '',
                density: drugDetail.kiro_details.density || ''
            });


            setSubmitted(false);
        }
    }, [isOpen, drugDetail, activeIngredients]);

    useEffect(() => {
        if (!isOpen) return;
        fetchIngredients();
        fetchUnits();
    }, [isOpen]);

    const handleInputChange = useCallback(
        (field: keyof DrugFormData, value: any) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [submitted]
    );

    const handleSave = async () => {
        setSubmitted(true);
        setIsLoading(true);
        if (formData.use_in_kiro) {
            const response = await editDrug(drugDetail?.id as string, formData);
            if (response) {
                setDrugDetail(response);
                onClose();
            }
        }else{
            const response = await editDrug(drugDetail?.id as string, {} as DrugFormData);
            if (response) {
                setDrugDetail(response);
                onClose();
            }
        }
        
        setIsLoading(false);
    };

    const handleCancel = () => {
        setFormData(defaultFormData);
        setSubmitted(false);
        onClose();
        setAlertMsgs({})
    };
    const i18nMedDirectory = (key: string): string =>
        t(`med-directory.${key}`);
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            className="flex flex-col"
            title="Edit Medication"
            size="xl"
            headerClass="bg-gray-50 pb-4 text-gray-900 text-lg font-normal"
        >
            <div className="flex-1 overflow-y-auto bg-white">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="divide-y"
                >
                    <div className="px-6">
                        <div className="space-y-2 border-b p-4">
                            <h3 className="text-md font-semibold text-gray-900">{i18nMedDirectory('general')}</h3>
                            <p className="text-sm text-gray-600">
                                {i18nMedDirectory('general-desc')}
                            </p>
                        </div>
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-center border-b text-sm text-gray-900 gap-8">
                            <p className="font-medium">{i18nMedDirectory("kiro")}</p>
                            <CheckboxInput
                                className="flex items-center"
                                label={i18nMedDirectory("use-in-kirolink")}
                                checked={formData.use_in_kiro}
                                onChange={(e) => handleInputChange('use_in_kiro', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="px-6">
                        <div className="space-y-2 border-b p-4">
                            <h3 className="text-md font-semibold text-gray-900">{i18nMedDirectory('ingridients')}</h3>
                            <p className="text-sm text-gray-600">
                                {i18nMedDirectory('ingridients-desc')}
                            </p>
                        </div>
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-center border-b text-sm text-gray-900 gap-8">
                            <p className="font-medium">{i18nMedDirectory("active-ingridients")}</p>
                            <SelectInput
                                size='lg'
                                value={formData.active_ingredient}
                                onChange={(e) => handleInputChange('active_ingredient', e)}
                                searchable
                                options={activeIngredients.map(ingredient => ({
                                    id: ingredient.id,
                                    label: ingredient.name_en,
                                    name: ingredient.name_en
                                }))}
                                error={alertMsgs['active_ingredient']?.[0] || ''}
                                required
                                important
                                disabled={ingredientsLoading}
                                noResultsText={i18nMedDirectory('no-ingridients')}
                            />
                        </div>
                    </div>

                    <div className="px-6">
                        <div className="space-y-2 border-b p-4">
                            <h3 className="text-md font-semibold text-gray-900">{i18nMedDirectory('dosage-admin')}</h3>
                            <p className="text-sm text-gray-600">
                                {i18nMedDirectory('dosage-admin-desc')}
                            </p>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-gray-900 gap-8">
                            <p className="font-medium">{i18nMedDirectory('concentration')}</p>
                            <div className="flex gap-5">
                                <Input
                                    label={i18nMedDirectory('concentration')}
                                    important
                                    required
                                    className="max-w-[250px]"
                                    value={formData.concentration}
                                    onChange={(e) => handleInputChange('concentration', e.target.value)}
                                    placeholder="0.0000"
                                    error={alertMsgs['concentration'] ? alertMsgs['concentration'][0] : ''}

                                />
                                <SelectInput
                                    label={i18nMedDirectory('concentration-unit')}
                                    important
                                    required
                                    options={dosageUnits.map((u) => ({
                                        id: u.id,
                                        label: u.name_ru,
                                        name: u.name_ru,
                                    }))}
                                    className="max-w-[250px]"
                                    value={formData.concentration_unit}
                                    onChange={(value: any) => handleInputChange('concentration_unit', value)}
                                    searchable
                                    disabled={unitsLoading}
                                    noResultsText={i18nMedDirectory('no-units')}
                                    error={alertMsgs['concentration_unit']?.[0] || ''}

                                />
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-gray-900 gap-8">
                            <p className="font-medium">{i18nMedDirectory('vial-dose')}</p>
                            <div className="flex gap-5">
                                <Input
                                    label={i18nMedDirectory('vial-dose')}
                                    important
                                    required
                                    className="max-w-[250px]"
                                    value={formData.vial_dose}
                                    onChange={(e) => handleInputChange('vial_dose', e.target.value)}
                                    placeholder="0.0000"
                                    error={alertMsgs['vial_dose'] ? alertMsgs['vial_dose'][0] : ''}

                                />
                                <SelectInput
                                    label={i18nMedDirectory('vial-dose-unit')}
                                    important
                                    required
                                    options={dosageUnits.map((u) => ({
                                        id: u.id,
                                        label: u.name_ru,
                                        name: u.name_ru,
                                    }))}
                                    className="max-w-[250px]"
                                    value={formData.vial_unit}
                                    onChange={(value: any) => handleInputChange('vial_unit', value)}
                                    searchable
                                    disabled={unitsLoading}
                                    noResultsText={i18nMedDirectory('no-units')}
                                    error={alertMsgs['vial_unit']?.[0] || ''}
                                />
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-gray-900 gap-8">
                            <p className="font-medium">{i18nMedDirectory('density')} (mg/ml)</p>
                            <Input
                                type='number'
                                className="max-w-[520px]"
                                value={formData.density}
                                onChange={(e) => handleInputChange('density', e.target.value)}
                                placeholder="0.0000"
                                error={alertMsgs['density']?.[0] || ''}

                            />
                        </div>
                        <div className="h-4"></div>
                    </div>
                </form>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0 z-10">
                <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading}>
                    {i18nMedDirectory('cancel')}
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? i18nMedDirectory('saving') : `${i18nMedDirectory('save')}`}
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateDrugModal;