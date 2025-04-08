import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { selectLangCode } from '@/redux/translation/selectors';
import { translateAction } from '@/redux/translation/actions';

import useLanguage from '@/locale/useLanguage';
import languages from '@/locale/languages';

import useResponsive from '@/hooks/useResponsive';

const SelectLanguage = () => {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();

  const langCode = useSelector(selectLangCode);

  return (
    <>
      <label
        htmlFor="rc_select_1"
        className="hiddenLabel"
        style={{
          width: '0px',
          marginRight: '-20px',
          position: 'relative',
        }}
      >
        _
      </label>
      <Select
        placeholder={translate('select language')}
        value={langCode}
        defaultOpen={false}
        style={{
          width: isMobile ? '100px' : '130px',
          float: 'right',
          marginTop: '5px',
          cursor: 'pointer',
          direction: 'ltr',
        }}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input.toLowerCase())}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        onSelect={(value) => {
          dispatch(translateAction.translate(value));
          window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
        }}
      >
        {languages.map((language) => (
          <Select.Option
            key={language.value}
            value={language.value}
            label={language.label.toLowerCase()}
            disabled={language.disabled}
          >
            <div className="demo-option-label-item">
              <span role="img" aria-label={language.label}>
                {language.icon}
              </span>
              {language.label}
            </div>
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default SelectLanguage;
