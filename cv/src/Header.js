import React from 'react';
import { BiSolidContact } from 'react-icons/bi';
import { FaGear } from 'react-icons/fa6';
import { GrLanguage } from 'react-icons/gr';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
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
    color: theme.color.text.dark,
    position: 'relative',
    display: 'flex',
    flex: '0 0 17em',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: '15px 15px',
    gap: '20px',
    marginBottom: '10px'
    // '@media (max-width: 1200px)': {
    //   padding: '10px 10px',
    //   width: '100%'
    // }
  },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    borderBottom: 'solid 1px',
    textTransform: 'uppercase',
    paddingBottom: '3px',
    marginBottom: '5px',
    fontWeight: '500',
    '& svg': {
      fontSize: '1.3em',
      marginBottom: '2px'
    }
  },
  sectionList: {
    paddingLeft: '10px',
    lineHeight: '1.6'
  },

  myFace: {
    // margin: '20px 20px 20px 40px',
    borderRadius: '50%',
    width: '10em',
    height: '10em',
    boxShadow: '0 0 10px #555555'
  },

  phone: {
    display: 'none',
    '@media print': {
      display: 'block'
    }
  },

  linkedInLink: {
    color: '#00b8ff',
    textDecoration: 'none',
    fontSize: '0.9em'
  },
  empty: {
    //flex: '0 0 350px'
  },
  educationLine: {
    fontSize: '0.9em'
  }
});
const now = new Date();
const myAge = Math.floor((now.getFullYear() * 12 + now.getMonth() + 1 - (1976 * 12 + 5)) / 12);

function Header({ intl }) {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <div className={classes.avatar}>
        <img className={classes.myFace} src={myFace} alt="my face" />
      </div>

      <div className={classes.section}>
        <div className={classes.sectionTitle}>
          <BiSolidContact />
          <FormattedMessage id="str.title.profile" />
        </div>
        <div className={classes.sectionList}>
          <div>ju.allegre@gmail.com</div>
          <div className={classes.phone}>07 85 31 03 14</div>
          <div>34920 Le Crès</div>
          <div>{myAge} ans</div>
          Ln :{' '}
          <a className={classes.linkedInLink} href="https://www.linkedin.com/in/julien-allegre-7933bb139/" target="_blank" rel="noreferrer">
            /julien-allegre-7933bb139/
          </a>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.sectionTitle}>
          <FaGear />
          <FormattedMessage id="str.skills.title.main" />
        </div>
        <div className={classes.sectionList}>
          <div>JavaScript/TypeScript</div>
          <div>HTML/CSS</div>
          <div>React</div>
          <div>Node.js/Express</div>
          <div>TailwindCSS</div>
          <div>MUI/ChakraUI</div>
          <div>Redux/RTK</div>
          <div>Git/GitHub</div>
          <div>Scrum/Kanban</div>
          <div>REST</div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.sectionTitle}>
          <FaGear />
          <FormattedMessage id="str.skills.title.other" />
        </div>
        <div className={classes.sectionList}>
          <div>VueJs</div>
          <div>Next</div>
          <div>Bootstrap</div>
          <div>Jest</div>
          <div>Docker</div>
          <div>Cypress</div>
          <div>GraphQL</div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.sectionTitle}>
          <GrLanguage />
          <FormattedMessage id="str.skills.title.languages" />
        </div>
        <div className={classes.sectionList}>
          <div>
            <FormattedMessage id="str.skills.french" />
          </div>
          <div>
            <FormattedMessage id="str.skills.english" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default injectIntl(Header);
