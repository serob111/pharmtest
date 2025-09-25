import { type JSX } from "react";
import { cn } from "../../lib/utils";
import { TooltipCell } from "../table/TooltipCell";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import { TOrder, useOrders } from "../../context/OrdersProvider";


type BodyTableProps = {
  id?: string | null;
  rows: any[];
};

export const BodyTableInfo = ({
  rows,
}: BodyTableProps): JSX.Element => {
  const baseCellClassName = cn(
    "p-[12px] typo-body-small-medium-14 text-black text-sm text-primary-light",
    "align-middle min-w-0",
  );
  const {
    selectedOrder
  } = useOrders()
  return (
    <>
      {rows.map((order, index) => {
        return (
          <tr
            key={index}
            className={`cursor-pointer hover:bg-gray-50
            ${selectedOrder?.external_order_id === order?.external_order_id ? 'bg-background-light-gray' : ''}`}
          >
            <td 
              className={cn(
                baseCellClassName,
                "relative overflow-hidden",
                selectedOrder?.external_order_id === order?.external_order_id ? "border-l-[2px] border-primeblue" : ""
              )}
            >
                <TooltipCell
                  content={order.order_name}
                  subcontent={order.external_order_id}
                />
              <div className="rounded-l-lg flex items-center group h-full w-full">
                <IconMaterial
                  filled
                  icon="chevron_right"
                  className="cursor-pointer hidden group-hover:block"
                  size={16}
                  iconColor="var(--tokens-text-secondary-text)" />
              </div>
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell
                content={order.prescription_detail.patient_first_name + ' ' + order.prescription_detail.patient_last_name}
                subcontent={"MRN: " + order.prescription_detail.patient_mrn}
              />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={order.due_date} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={order.medical_system} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={order.prescription_detail.prescription_name} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={order.status} />
            </td>
          </tr>

        );
      })}
    </>
  );
};
