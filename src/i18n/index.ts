import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/en.json';
import ru from './ru/ru.json';
import prescription from './en/prescription/prescription.json';
import editDevice from './en/device/edit-device.json';
import createDevice from './en/device/create-device.json';
import deviceDir from './en/device/device-dir.json';
import medDir from './en/med/med.json';
import createUser from './en/users/create-user.json';
import users from './en/users/users.json';
import orders from './en/orders/orders.json';
import prescriptionRu from './ru/prescription/prescription.json';
import editDeviceRu from './ru/device/edit-device.json';
import createDeviceRu from './ru/device/create-device.json';
import deviceDirRu from './ru/device/device-dir.json';
import medDirRu from './ru/med/med.json';
import createUserRu from './ru/users/create-user.json';
import usersRu from './ru/users/users.json';
import ordersRu from './ru/orders/orders.json';


const savedLanguage = localStorage.getItem('language') || 'en';

const resources = {
  en: {
    translation: {
      ...en,
      "users": users,
      "create-user": createUser,
      "med-directory": medDir,
      "device-directory": deviceDir,
      "create-device": createDevice,
      "edit-device": editDevice,
      "prescription-directory": prescription,
      "orders-directory": orders,
    },
  },
  ru: {
    translation: {
      ...ru,
      "users": usersRu,
      "create-user": createUserRu,
      "med-directory": medDirRu,
      "device-directory": deviceDirRu,
      "create-device": createDeviceRu,
      "edit-device": editDeviceRu,
      "prescription-directory": prescriptionRu,
      "orders-directory": ordersRu,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: savedLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
