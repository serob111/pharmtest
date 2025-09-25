import { IconMaterial } from '../shared/iconMaterial/IconMaterial'

export default function DashboardCard({count,title,icon}:{
    count:number,
    title:string,
    icon:string
}) {
    return (
        <div className='p-6 flex flex-col w-[300px] justify-start gap-2 rounded-3xl bg-lightblue'>
            <div className='rounded-full w-9 h-9 flex justify-center items-center bg-white '>
                <IconMaterial
                    icon={icon}
                    className="cursor-pointer text-secondary-extralight"
                    size={20}
                />
            </div>
            <span className='text-secondary-extralight font-medium'>
               {title}
            </span>
            <p className='text-2xl text-primary-dark font-medium'>
                {count}
            </p>
        </div>
    )
}
