import { GrLanguage } from 'react-icons/gr';
import { injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  lang: {
    display: 'flex',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '20px',
    '@media print': {
      display: 'none'
    },
    gap: '2px'
  }
});

function LanguageSelector({ language, onChangeLanguage, intl }) {
  const classes = useStyles();
  const langTooltip = intl.formatMessage({ id: 'str.change.language.tooltip' });

  function handleLangClick() {
    onChangeLanguage(language === 'fr' ? 'en' : 'fr');
  }

  return (
    <div className={classes.lang} onClick={handleLangClick} title={langTooltip}>
      <GrLanguage size={'1.3em'} />
      <span>{language.toUpperCase()}</span>
    </div>
  );
}

export default injectIntl(LanguageSelector);
