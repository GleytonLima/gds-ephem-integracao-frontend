import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationPTBR from './locales/pt-BR/translation.json';

export const configureI18n = (): void => {
	i18n.use(initReactI18next).init({
		resources: {
			en: {
				translation: translationEN
			},
			ptBR: {
				translation: translationPTBR
			},
			es: {
				translation: translationES
			}
		},
		lng: 'ptBR',
		fallbackLng: 'ptBR',
		interpolation: {
			escapeValue: false
		}
	});
};

export default i18n;
