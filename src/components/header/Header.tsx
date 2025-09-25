import { useEffect, useState } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import { FullNameCeil } from '../table-user/FullNameCeil';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import { useNavigate } from 'react-router';
import { useDashboard } from '../../context/DashboardProvider';
import RU from '../../assets/ru.svg?react'
import EN from '../../assets/en.svg?react'
import { useSessionEnd } from '../../context/AuthProvider';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import Badge from '../shared/ui/Badge';

export type TCrumb = {
    name: string;
    path?: string
}
type THeader = {
    title: string,
    crumbs?: TCrumb[],
    status?: any,
    create?: string;
}
const Header = ({ title, crumbs, create, status }: THeader) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { profile, changeLanguage } = useDashboard();
    const savedLanguage = profile.language;
    const languageName = savedLanguage === 'ru' ? 'Russian' : 'English';

    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState(languageName);
    const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);
    const sessionEnd = useSessionEnd();

    const languages = [
        { code: 'ru', name: 'Russian', flag: <RU /> },
        { code: 'en', name: 'English', flag: <EN /> }
    ];

    const handleLanguageSelect = (language: string, code: string) => {
        changeLanguage(code)
        localStorage.setItem('language', code);
        setSelectedLanguage(language);
        setShowLanguageSubmenu(false);
    };
    useEffect(() => {
        if (i18n.isInitialized) {
            const storedLang = localStorage.getItem('language');
            if (storedLang) {
                i18n.changeLanguage(storedLang);
                setSelectedLanguage(storedLang === 'ru' ? 'Russian' : 'English');
            } else if (profile?.language) {
                const code = profile.language;
                i18n.changeLanguage(code);
                localStorage.setItem('language', code);
                setSelectedLanguage(code === 'ru' ? 'Russian' : 'English');
            }
        }
    }, [profile?.language, i18n.isInitialized]);


    const handleSignOut = () => {
        sessionEnd()
        navigate('/')
    }

    const { t } = useTranslation()
    return (
        <div className="bg-gray-50">
            <header className="bg-white py-[12px] border-b border-gray-200 px-6 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-semibold text-gray-900">{title} {status && <Badge status={status} />}</h1>
                        {
                            create && profile.clinic_role == 'Super admin' &&
                            <div className="bg-primary flex items-center justify-center text-white p-3 rounded-full">
                                <IconMaterial
                                    filled
                                    icon='add'
                                    className="cursor-pointer"
                                    size={20}
                                    iconColor="var(--tokens-text-secondary-text)"
                                    onClick={() => navigate(create)}
                                />
                            </div>
                        }
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center space-x-3 p-2 rounded-lg  text-primeblue ${isDropdownOpen && 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}
                        >
                            <FullNameCeil className='bg-primary text-white' user={profile} />
                            <IconMaterial
                                filled
                                icon={isDropdownOpen ? 'expand_less' : 'expand_more'}
                                className="cursor-pointer"
                                size={20}
                                iconColor={isDropdownOpen ? '#305997' : "var(--tokens-text-secondary-text)"}
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div onClick={() => { navigate('/accountsettings/') }} className="px-4 cursor-pointer py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{t('profile.account-settings')}</p>
                                    <p className="text-xs text-gray-500 mt-1">{t('profile.manage-account')}</p>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowLanguageSubmenu(!showLanguageSubmenu)}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-Stroke-Light"
                                    >
                                        <div className="flex flex-col  items-start">
                                            <p className="text-sm font-medium text-gray-900">
                                                {t('profile.change-language')}
                                            </p>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {selectedLanguage}
                                            </span>
                                        </div>
                                        <IconMaterial
                                            filled
                                            icon={showLanguageSubmenu ? 'expand_less' : 'expand_more'}
                                            className="cursor-pointer"
                                            size={20}
                                            iconColor={showLanguageSubmenu ? '#305997' : "var(--tokens-text-secondary-text)"}
                                        />
                                    </button>

                                    {showLanguageSubmenu && (
                                        <div className="w-full bg-white pl-3">
                                            <div className='border-l-[2px] w-full border-primeblue '>
                                                {languages.map((language) => (
                                                    <button
                                                        key={language.code}
                                                        onClick={() => handleLanguageSelect(language.name, language.code)}
                                                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-md"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg">{language.flag}</span>
                                                            <span className="text-primary-light font-medium font-montserrat text-sm leading-[22px]">
                                                                {language.name}
                                                            </span>
                                                        </div>
                                                        {selectedLanguage === language.name && (
                                                            <div className='rounded-full bg-primary text-white flex items-center justifiy-center '>
                                                                <IconMaterial
                                                                    filled
                                                                    icon={'check'}
                                                                    className="cursor-pointer"
                                                                    size={20}
                                                                    iconColor={"var(--tokens-text-secondary-text)"}
                                                                />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-2">
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150">
                                        <IconMaterial
                                            filled
                                            icon='logout'
                                            className="cursor-pointer"
                                            size={20}
                                            iconColor="var(--tokens-text-secondary-text)"
                                        />
                                        <span>{t('profile.logout')}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {
                    crumbs &&
                    <div className=" border-gray-100">
                        <Breadcrumbs crumbs={crumbs} />
                    </div>
                }
            </header>


            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default Header;