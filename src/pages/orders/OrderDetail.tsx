import { useEffect } from 'react';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import { useOrders } from '../../hooks/useOrders';
import { useLocation, useNavigate } from 'react-router';
import Accordeon from '../../components/accordeon/Accordeon';
import { TooltipCell } from '../../components/table/TooltipCell';
import Alert, { AlertType } from '../../components/alert/Alert';
import { TableInfo } from '../../components/table-info/TableInfo';
import { IconMaterial } from '../../components/shared/iconMaterial/IconMaterial';
import Button from '../../components/shared/ui/Button/baseBtn';
import { AlertsWrapper } from '../../components/alert/AlertsWrapper';

function OrderDetail() {
    const { t } = useTranslation()
    const {
        alertMsgs,
        getOrderDetail,
        orderDetail,
        sendOrder,
        setAlertMsgs
    } = useOrders()
    const { state } = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        if (state?.id) {
            getOrderDetail(state?.id)
        }
    }, [state?.id])

    const i18nOrderDirectory = (key: string): string =>
        t(`orders-directory.${key}`);

    const handleCancel = () => {
        navigate('/orders')
    }

    const handleSave = async (id: string, device?: string) => {
        await sendOrder(id, device);
    };
    return (
        <div className="relative h-screen flex justify-between flex-col overflow-x-hidden">
            <AlertsWrapper alertState={alertMsgs} setAlertMessages={setAlertMsgs} />
            <div>
                <Header
                    title={`OR-${orderDetail?.prescription_detail?.his_prescription_details_id ?? ""}`}
                    status={orderDetail?.medical_system_status}
                    crumbs={[{ path: '/orders/', name: i18nOrderDirectory('orders') }, { name: 'OR-' + orderDetail?.prescription_detail.his_prescription_details_id }]}
                />
                <Accordeon event={orderDetail?.medical_system_status} title={i18nOrderDirectory('order-info')} >
                    <div className="divide-y ">
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start  text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('identification')}</p>
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-sm text-secondary-extralight'>
                                        {i18nOrderDirectory('order-id')}
                                    </span>
                                    <div className='w-[242px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                        <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.his_prescription_details_id} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-sm text-secondary-extralight'>
                                        {i18nOrderDirectory('order-name')}
                                    </span>
                                    <div className='w-[242px] border h-[44px] rounded-lg p-2 flex items-center bg-background-light-gray text-primary-dark'>
                                        <TooltipCell className='mt-2' content={orderDetail?.order_name} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start  text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('preparation')}</p>
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-sm text-secondary-extralight'>
                                        {i18nOrderDirectory('due-date')}
                                    </span>
                                    <div className='w-[500px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                        <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.appoint_date} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start  text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('device-info')}</p>
                            <div className='flex flex-col gap-4'>
                                <div className='flex gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-secondary-extralight'>
                                            {i18nOrderDirectory('device-type')}
                                        </span>
                                        <div className='w-[242px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                            <TooltipCell className='mt-2'
                                                content={orderDetail?.target_device?.model}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-secondary-extralight'>
                                            {i18nOrderDirectory('device-id')}
                                        </span>
                                        <div className='w-[242px] border h-[44px] rounded-lg p-2 flex items-center bg-background-light-gray text-primary-dark'>
                                            <TooltipCell className='mt-2' content={orderDetail?.target_device?.protocol} />
                                        </div>
                                    </div>
                                </div>
                                <Alert className='max-w-[500px]' type={AlertType.Sync} alertMsgs={i18nOrderDirectory('system-auto')} />

                            </div>
                        </div>
                    </div>
                </Accordeon>

                <Accordeon title={i18nOrderDirectory('patient-info')} >
                    <div className="divide-y ">
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('first-name')}</p>
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <div className='w-[500px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                        <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.patient_first_name} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('last-name')}</p>
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <div className='w-[500px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                        <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.patient_last_name} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start  text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('patient-identifers')}</p>
                            <div className='flex gap-4'>
                                <div className='flex gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-secondary-extralight'>
                                            {i18nOrderDirectory('mrn')}
                                        </span>
                                        <div className='w-[242px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                            <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.patient_mrn} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-secondary-extralight'>
                                            {i18nOrderDirectory('dob')}
                                        </span>
                                        <div className='w-[242px] border h-[44px] rounded-lg p-2 flex items-center bg-background-light-gray text-primary-dark'>
                                            <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.patient_date_of_birth} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordeon>

                <Accordeon title={i18nOrderDirectory('admin-params')} >
                    <div className="divide-y ">
                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('preparation-id')}</p>
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <div className='w-[500px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                        <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.his_prescription_details_id} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-start  text-sm text-primary-dark gap-8">
                            <p className="font-medium text-primary-light">{i18nOrderDirectory('title')}</p>
                            <div className='flex gap-4'>
                                <div className='flex gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-secondary-extralight'>
                                            {i18nOrderDirectory('admin-speed')}
                                        </span>
                                        <div className='w-[500px] border h-[44px] rounded-lg p-2 flex justify-start items-center bg-background-light-gray text-primary-dark '>
                                            <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.administration_speed} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Accordeon>

                <Accordeon title={i18nOrderDirectory('vial-info')} >
                    <div className="divide-y ">
                        <TableInfo infoList={orderDetail?.prescription_detail?.items} />
                    </div>
                </Accordeon>

                <div className='p-4 bg-background-light-gray mx-8 rounded-xl gap-2 my-4 justify-start flex items-center'>
                    <IconMaterial
                        icon="takeout_dining"
                        className="cursor-pointer group-hover:block text-primeblue"
                        size={20}
                    />
                    <span className='text-xs text-primeblue'>
                        {i18nOrderDirectory('final-cont')}
                    </span>
                    <span className='text-primary-dark text-sm'>
                        <TooltipCell className='mt-2' content={orderDetail?.prescription_detail.final_container} />
                    </span>
                </div>
            </div>
            <div className='flex w-full gap-2 justify-end p-4 bg-background-light-gray'>
                <Button
                    size='md'
                    variant="outline"
                    onClick={handleCancel}
                >
                    {i18nOrderDirectory('cancel')}
                </Button>
                <Button
                    size='md'
                    onClick={() => handleSave(state.id, orderDetail?.target_device?.protocol)}
                >
                    {i18nOrderDirectory('send-order')}
                </Button>
            </div>
        </div>
    );
}

export default OrderDetail;