import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/translation/selectors';

const getLabel = (lang, key) => {
  try {
    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    if (lang[lowerCaseKey]) return lang[lowerCaseKey];
    else {
      const remove_underscore_fromKey = key.replace(/_/g, ' ').split(' ');

      const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
        (word) => word[0].toUpperCase() + word.substring(1)
      );

      const label = conversionOfAllFirstCharacterofEachWord.join(' ');

      const result = window.localStorage.getItem('lang');
      if (!result) {
        let list = {};
        list[lowerCaseKey] = label;
        window.localStorage.setItem('lang', JSON.stringify(list));
      } else {
        let list = { ...JSON.parse(result) };
        list[lowerCaseKey] = label;
        window.localStorage.removeItem('lang');
        window.localStorage.setItem('lang', JSON.stringify(list));
      }
      return label;
    }
  } catch (error) {
    return 'No translate';
  }
};

const useLanguage = () => {
  const lang = useSelector(selectCurrentLang);

  const translate = (value) => getLabel(lang, value);

  return translate;
};

export default useLanguage;
