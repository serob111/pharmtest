import type { JSX } from "react";
import { ProfileFoto } from "../shared/ui/ProfilePhoto";
import { TooltipCell } from "../table/TooltipCell";
import { TUser } from "../../context/UsersProvider";



type FullNameCeilProps = {
  user: TUser;
  className?: string;
  color?: string;
  showRole?: true | false
  size?: 'sm' | 'md' | 'lg'
};

export const FullNameCeil = ({ user, className,  showRole = true, size }: FullNameCeilProps): JSX.Element => {
  return (
    <div className="gap-2  group min-w-0 flex cursor-pointer items-center">
      <ProfileFoto
        size={size}
        photo={user.profile_photo_thumbnail}
        name={user.first_name}
        lastName={user.last_name}
       className={className}
      />
      <div className="min-w-0 flex-shrink">
        <TooltipCell
          content={`${user.first_name} ${user.last_name}`}
          className="typo-body-small-medium-14 truncate group-hover:underline"
        />

        {
          showRole &&
          <p
            className="typo-caption-regular-12 text-xs text-start truncate text-secondary"
          >
            {user.clinic_role}
          </p>
        }
      </div>
    </div>
  );
};
