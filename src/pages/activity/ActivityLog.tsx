import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import Input from '../../components/shared/ui/input/Input';
import useDebounce from '../../lib/Debounce';
import { useLocation, useNavigate } from 'react-router';
import { TOrder, TOrdersDashboard, useOrders } from '../../context/OrdersProvider';
import { TableOrder } from '../../components/table-orders/TableOrders';
import DashboardCard from '../../components/card/DashboardCard';


export default function ActivityLog() {
    const {
        limit,
        offset,
        ordersList,
        getOrderList,
        setLimit,
        setSelectedOrder,
        setOffset,
        getOrderDashboard
    } = useOrders();

    const { state } = useLocation();
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('');
    const [dashboard, setDashboard] = useState({} as TOrdersDashboard)
    const { t } = useTranslation()
    const i18nActivityDirectory = (key: string): string =>
        t(`activity-directory.${key}`);
    const tabs = [
        { id: 'hislogs', label: i18nActivityDirectory('hislogs') },
        { id: 'devicelogs', label: i18nActivityDirectory('devicelogs') },
        { id: 'useractions', label: i18nActivityDirectory('useractions') },
    ];

    const handleRowClick = (order: TOrder) => {
        setSelectedOrder(order);
        navigate(`/orders/${order.id}`, {
            state: { id: order.id }
        });
    };



    const handleFilter = (id: string) => {
        setActiveTab(id)
        getOrderList({ status: id })
    }

    // useEffect(() => {

    //     const fetch = async () => {
    //         const response = await getOrderDashboard()
    //         setDashboard(response)
    //     }
    //     fetch()
    // }, [])

    useEffect(() => {
        setActiveTab(state?.id)
        // getOrderList()
    }, [limit, offset,state.id]);

    return (
        <div className="relative h-screen flex flex-col overflow-hidden">
            <Header
                title={i18nActivityDirectory('activity-log')}
            />
            <div className="flex-1 flex relative overflow-hidden">
                <div className="flex flex-col transition-all duration-500 ease-in-out overflow-hidden">
                    <div className="flex-shrink-0 p-4 bg-white border-b">

                        <div className="flex justify-between items-center">
                            <div className="h-auto ">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleFilter(tab.id)}
                                        className={`flex-1 p-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'text-primeblue border-b-2 border-primeblue'
                                            : 'text-primary-light'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 px-4  overflow-auto">
                        {/* <TableOrder
                            offset={offset}
                            setOffset={setOffset}
                            handleRowClick={handleRowClick}
                            setLimit={setLimit}
                            ordersList={ordersList}
                            limit={limit}
                            filterNotFound={false}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}