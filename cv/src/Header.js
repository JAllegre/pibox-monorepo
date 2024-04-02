import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import globe from './images/globe.svg';
import linkedInIcon from './images/linkedin.png';
import myFace from './images/maFace.jpg';
import theme from './theme';

const useStyles = createUseStyles({
  hideOnSmall: {
    '@media (max-width: 600px)': {
      display: 'none'
    }
  },
  header: {
    backgroundColor: theme.color.bg.dark,
    // borderRadius: '0 0 4px 4px ',
    position: 'relative',
    width: '1200px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '15px 15px',
    marginBottom: '10px',
    '@media (max-width: 1200px)': {
      padding: '10px 10px',
      width: '100%'
    }
  },
  identity: {
    display: 'flex'
    //flex: '0 0 350px'
  },
  myFace: {
    // margin: '20px 20px 20px 40px',
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    boxShadow: '0 0 10px #555555'
  },

  locate: {
    marginLeft: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontSize: '1.1em',
    color: 'white'
  },
  name: {
    fontSize: '1.3em',
    fontWeight: '500'
  },
  phone: {
    display: 'none',
    '@media print': {
      display: 'block'
    }
  },
  role: {
    color: 'white',
    fontSize: '1.5em',
    flex: '1 1 auto',
    paddingRight: '10%',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '400',

    '@media (max-width: 1200px)': {
      paddingRight: '0',
      fontSize: '1.1em',
      paddingTop: '20px'
    }
  },
  linkedInIcon: {
    border: '1.5px solid white',
    borderRadius: '4px',
    width: '25px',
    height: '25px',
    verticalAlign: 'bottom',
    margin: '2px 6px 0 0'
  },
  linkedInLink: {
    color: '#00b8ff',
    textDecoration: 'none',
    fontSize: '0.9em',
    '@media print': {
      display: 'none'
    }
  },
  empty: {
    //flex: '0 0 350px'
  },
  lang: {
    display: 'flex',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '10px',
    '@media print': {
      display: 'none'
    }
  },
  globe: {
    width: '20px',
    marginRight: '5px'
  }
});
const now = new Date();
const myAge = Math.floor((now.getFullYear() * 12 + now.getMonth() + 1 - (1976 * 12 + 5)) / 12);

function Header({ language, onChangeLanguage, intl }) {
  const classes = useStyles();

  function handleLangClick() {
    onChangeLanguage(language === 'fr' ? 'en' : 'fr');
  }

  const langTooltip = intl.formatMessage({ id: 'str.change.language.tooltip' });

  return (
    <header className={classes.header}>
      <div className={classes.identity}>
        <img className={classes.myFace} src={myFace} alt="my face" />
        <div className={classes.locate}>
          <div className={classes.name}>Julien Allègre</div>
          <div>{myAge} ans</div>
          <div>ju.allegre@gmail.com</div>
          <div className={classes.phone}>07 85 31 03 14</div>
          <div>34920 Le Crès</div>
          <div>
            <a className={classes.linkedInLink} href="https://www.linkedin.com/in/julien-all%C3%A8gre-7933bb139">
              <img className={classes.linkedInIcon} src={linkedInIcon} alt="LinkedIn icon" />
            </a>
          </div>
        </div>
      </div>
      <div className={classes.role}>
        <FormattedMessage id="str.head.role" />
        <span> Fullstack JS/TS</span>
      </div>
      <div className={classes.lang} onClick={handleLangClick} title={langTooltip}>
        <img className={classes.globe} src={globe} alt="flag" />
        <span>{language.toUpperCase()}</span>
      </div>
    </header>
  );
}

export default injectIntl(Header);
