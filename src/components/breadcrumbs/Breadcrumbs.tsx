import { TCrumb } from "../header/Header";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";

export default function Breadcrumbs({ crumbs }: { crumbs: TCrumb[] }) {
  return (
    <div className="flex items-center text-sm text-gray-500   space-x-1">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={index} className="flex items-center justify-center gap-2 " >
            {index > 0 && <span className="text-gray-400">   <IconMaterial
              filled
              icon='chevron_right'
              className="cursor-pointer mt-1"
              size={16}
              iconColor="var(--tokens-text-secondary-text)"

            /></span>}
            <a href={isLast ? '' : crumb.path} className={isLast ? "font-medium text-gray-500" : "hover:underline"}>
              {crumb.name}
            </a>
          </div>
        );
      })}
    </div>
  );
}
