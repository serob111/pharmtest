import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import Card from '../card/Card';
import { useMeds } from '../../hooks/useMeds';
import UpdateDrugModal from '../update-drug-modal/UpdateDrugModal';
import { useTranslation } from 'react-i18next';

export interface DrugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  isOpenDrugModal: boolean,
  setIsOpenDrugModal: Dispatch<SetStateAction<boolean>>;
}

const DrugPanel: React.FC<DrugPanelProps> = ({
  isOpen,
  onClose,
  isOpenDrugModal,
  setIsOpenDrugModal,
  className = ''
}) => {

  const {
    selectedMed,
    drugDetail,
    getDrugDetail,
    setDrugDetail,
  } = useMeds()
  
  useEffect(() => {
    if (selectedMed) {
      getDrugDetail(selectedMed.id)
    } else {
      setDrugDetail(null);
    }
  }, [selectedMed?.id])
  const { t } = useTranslation()
  const i18nMedDirectory = (key: string): string =>
    t(`med-directory.${key}`);

  // Don't render if no medication is selected
  if (!selectedMed) {
    return null;
  }

  return (
    <>
      <UpdateDrugModal
        isOpen={isOpenDrugModal}
        onClose={() => setIsOpenDrugModal(false)}
      />
      <div
        className={`flex flex-col top-0 right-0 h-full w-[450px] bg-white border-l transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } ${className}`}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg flex items-center justify-center">
              <IconMaterial
                filled
                icon="article"
                className="cursor-pointer text-primeblue"
                size={20}
              />
            </div>
            <div>
              <h2
                className="text-lg font-semibold text-gray-900 font-montserrat  truncate max-w-[250px]"
                title={selectedMed?.brand_name}
              >
                {selectedMed?.brand_name}
              </h2>
              <p className="text-sm text-gray-600 font-montserrat">
                {selectedMed?.active_ingredient}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="p-2 text-gray-400 flex items-center justify-center border  hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <IconMaterial
                onClick={() => setIsOpenDrugModal(true)}
                filled
                icon="edit"
                className="cursor-pointer"
                size={20}
              />
            </div>
            <div
              className="p-2 text-gray-400 flex items-center justify-center border  hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <IconMaterial
                filled
                icon="close"
                className="cursor-pointer"
                size={20}
                onClick={onClose}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Card
            className='mt-2'
            title={i18nMedDirectory('general-information')}
            items={[
              {
                label: i18nMedDirectory('internal-id'),
                value: drugDetail?.id
              },
              {
                label: i18nMedDirectory('his-id'),
                value: drugDetail?.his_id
              },
              {
                label: i18nMedDirectory('his-system'),
                value: drugDetail?.his_system
              },
              {
                label: i18nMedDirectory("drug-id"),
                value: drugDetail?.drug_id
              },
              {
                label: i18nMedDirectory('use-in-kiro'),
                value: drugDetail?.use_in_kiro ? i18nMedDirectory('yes') : i18nMedDirectory('no'),
                hasIcon: true,
                useInKiro: drugDetail?.use_in_kiro
              }
            ]}
          />

          {drugDetail?.use_in_kiro && (
            <Card
              titleClass='bg-[#E1F0FB]'
              className='mt-2'
              title={i18nMedDirectory('kirolink-details')}
              items={[
                {
                  label: i18nMedDirectory('ingredient'),
                  value: drugDetail?.kiro_details.active_ingredient
                },
                {
                  label: i18nMedDirectory('name'),
                  value: drugDetail?.kiro_details.name
                },
                {
                  label: i18nMedDirectory('volume'),
                  value: drugDetail?.kiro_details.volume
                },
                {
                  label: i18nMedDirectory('concentration'),
                  value: drugDetail?.kiro_details.concentration + '/' + drugDetail?.kiro_details.concentration_unit
                },
                {
                  value: drugDetail?.kiro_details.vial_dose + '/' + drugDetail?.kiro_details.vial_unit,
                  label: i18nMedDirectory('dose')
                },
                {
                  label: i18nMedDirectory('density'),
                  value: drugDetail?.kiro_details.density ? drugDetail?.kiro_details.density + '(g/mL)' : null
                }
              ]}
            />
          )}

          <Card
            className='mt-2'
            title={i18nMedDirectory('names-ingredients')}
            items={[
              {
                label: i18nMedDirectory('brand-name-ru'),
                value: drugDetail?.brand_name_ru
              },
              {
                label: i18nMedDirectory('brand-name-kz'),
                value: drugDetail?.brand_name_kz
              },
              {
                label: i18nMedDirectory('active-ingredient'),
                value: drugDetail?.active_ingredient
              }
            ]}
          />

          <Card
            className='mt-2'
            title={i18nMedDirectory('dosage-administration')}
            items={[
              {
                label: i18nMedDirectory('dosage'),
                value: drugDetail?.dosage_value
              },
              {
                label: i18nMedDirectory('dosage-unit'),
                value: drugDetail?.dosage_unit
              },
              {
                label: i18nMedDirectory('his-concentration'),
                value: drugDetail?.damumed_concentration
              },
              {
                label: i18nMedDirectory('route'),
                value: drugDetail?.route
              }
            ]}
          />

          <Card
            className='mt-2'
            title={i18nMedDirectory('manufacturer')}
            items={[
              {
                label: i18nMedDirectory('manufacture'),
                value: drugDetail?.manufacture
              },
              {
                label: i18nMedDirectory('country'),
                value: drugDetail?.country
              }
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default DrugPanel;