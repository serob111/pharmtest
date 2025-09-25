
import { useTranslation } from 'react-i18next';


function Home() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t('welcome')}</h1>
        </div>
        <p className="text-gray-600 mb-6">{t('description')}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => changeLanguage('en')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('ru')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Русский
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;