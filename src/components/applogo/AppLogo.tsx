import Logo from '../../assets/logo.svg?react'
import LogoPlus from '../../assets/logoplus.svg?react'


export default function AppLogo() {
    return (
        <div className="absolute inset-0 w-1/2 flex items-center justify-center cursor-pointer text-white">
        <div className="p-5 bg-indigo-400/20 rounded-2xl backdrop-blur-[9.85px] inline-flex flex-col justify-start items-start gap-2.5">
          <div className="w-40 h-8 relative flex items-center justify-center gap-2">
            <LogoPlus /> <Logo />
          </div>
        </div>
      </div>
      
    )
}
