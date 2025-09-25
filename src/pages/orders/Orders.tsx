import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import Input from '../../components/shared/ui/input/Input';
import useDebounce from '../../lib/Debounce';
import { useNavigate } from 'react-router';
import { TOrder, TOrdersDashboard } from '../../context/OrdersProvider';
import { useOrders } from '../../hooks/useOrders';
import { TableOrder } from '../../components/table-orders/TableOrders';
import DashboardCard from '../../components/card/DashboardCard';
import LoadingSpinner from '../../components/shared/ui/LoadingSpinner';


export default function Orders() {
    const {
        limit,
        offset,
        ordersList,
        ordersLoading,
        dashboardLoading,
        dashboard,
        setLimit,
        setSelectedOrder,
        setOffset,
        updateFilters,
        refetchDashboard
    } = useOrders();


    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [activeTab, setActiveTab] = useState('');
    const { t } = useTranslation()
    const i18nOrderDirectory = (key: string): string =>
        t(`orders-directory.${key}`);
    const debouncedSearch = useDebounce(searchValue, 500)
    const tabs = [
        { id: '', label: i18nOrderDirectory('all') },
        { id: 'in_progress', label: i18nOrderDirectory('in-progress') },
        { id: 'done', label: i18nOrderDirectory('completed') },
        { id: 'rejected', label: i18nOrderDirectory('failed') },
    ];

    const handleRowClick = (order: TOrder) => {
        setSelectedOrder(order);
        navigate(`/orders/${order.id}`, {
            state: { id: order.id }
        });
    };

    const handleSearch = (value: string) => {
        setOffset(0)
        setSearchValue(value)
    }

    const handleFilter = (id: string) => {
        setActiveTab(id)
        updateFilters({ status: id })
    }

    useEffect(() => {
        refetchDashboard()
    }, [])

    useEffect(() => {
        updateFilters({ search: debouncedSearch || undefined });
    }, [debouncedSearch, limit, offset]);

    return (
        <div className="relative h-screen flex flex-col overflow-hidden">
            <Header
                title={i18nOrderDirectory('orders')}
            />
            <div className="flex-1 flex relative overflow-hidden">
                <div className="flex flex-col transition-all duration-500 ease-in-out overflow-hidden">
                    <div className="flex-shrink-0 p-4 bg-white border-b">
                        {dashboardLoading ? (
                            <div className="flex justify-center mb-4">
                                <LoadingSpinner text="Loading dashboard..." />
                            </div>
                        ) : (
                            <div className='flex justify-around mb-4'>
                            <DashboardCard
                                title={i18nOrderDirectory('all-orders')}
                                count={dashboard?.all_orders_count}
                                icon='all_inbox'
                            />
                             <DashboardCard
                                title={i18nOrderDirectory('in-progress')}
                                count={dashboard?.orders_in_progress}
                                icon='arrow_outward'
                            />
                             <DashboardCard
                                title={i18nOrderDirectory('completed')}
                                count={dashboard?.orders_in_done}
                                icon='done_all'
                            />
                             <DashboardCard
                                title={i18nOrderDirectory('failed')}
                                count={dashboard?.orders_rejected}
                                icon='cancel'
                            />
                        </div>
                        )}
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
                            <div className="flex gap-2">
                                <div>
                                    <Input
                                        onClear={() => setSearchValue('')}
                                        name="search"
                                        onChange={(e) => handleSearch(e.target.value)}
                                        value={searchValue}
                                        placeholder={i18nOrderDirectory('search')}
                                        size="lg"
                                        clearable
                                        rightIcon="search"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {ordersLoading && (
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingSpinner size="lg" text="Loading orders..." />
                        </div>
                    )}
                    
                    <div className="flex-1 px-4  overflow-auto">
                        {!ordersLoading && <TableOrder
                            offset={offset}
                            setOffset={setOffset}
                            handleRowClick={handleRowClick}
                            setLimit={setLimit}
                            ordersList={ordersList}
                            limit={limit}
                            filterNotFound={false}
                        />}
                    </div>
                </div>
            </div>
        </div>
    );
}