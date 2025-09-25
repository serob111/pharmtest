
interface BadgeProps {
  status: string | boolean;
}

export default function Badge({ status }: BadgeProps) {
  let text = '';
  let classes = 'inline-flex px-3 py-1 text-xs font-medium rounded-full ';

  if (status === true || status === 'Active' || status === 'Online') {
    text = 'Active';
    classes += 'bg-blue-100 text-blue-800';
  } else if (status === false || status === 'inactive') {
    text = status || ' Deactivated';
    classes += 'bg-gray-100 text-gray-800';
  } else if (status === 'completed') {
    text = 'Done';
    classes += 'bg-background-light-gray text-dark border border-[#C2C6CF]';
  } else if (status === 'new') {
    text = 'New';
    classes += 'bg-green-100 text-green-800';
  } else if (status === 'in_progress') {
    text = 'In Progress';
    classes += 'bg-blue-100 text-blue-800';
  } else if (status === 'canceled') {
    text = 'Canceled';
    classes += 'bg-red-100 text-red-800';
  } else if (status === 'archived') {
    text = 'Archived';
    classes += 'bg-gray-100 text-gray-800';
  } else if (status === 'done') {
    text = 'Done';
    classes += 'bg-green-100 text-green-800';
  } else if (status === 'inactive') {
    text = 'Inactive';
    classes += 'bg-gray-100 text-gray-800';
  } else if (status === 'active') {
    text = 'Active';
    classes += 'bg-blue-100 text-blue-800';
  } else if (status === 'error') {
    text = 'Error';
    classes += 'bg-red-100 text-red-800';
  } else if (status === 'maintenance') {
    text = 'Maintenance';
    classes += 'bg-orange-100 text-orange-800';
  } else {
    text = 'Not Provided';
    classes += 'bg-yellow-100 text-yellow-800';
  }

  return <span className={classes}>{text}</span>;
}