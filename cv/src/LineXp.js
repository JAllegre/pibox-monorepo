import React from 'react';
import { injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import theme from './theme';

const useStyles = createUseStyles({
  line: {
    display: 'flex',
    '@media (max-width: 400px)': {
      flexDirection: 'column'
    }
  },
  linePeriod: {
    flex: '0 0 130px',
    display: 'flex',
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    color: '#878787',
    fontWeight: 'bold',
    '@media (max-width: 400px)': {
      flex: '0 0 auto',
      marginBottom: '10px'
    }
  },
  lineContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0 0 0 0',
    '& ul': {
      paddingInlineStart: '30px'
    },
    '@media (max-width: 600px)': {
      padding: '0 0 0 0'
    }
  },
  lineRoleLoc: {
    marginBottom: '4px',
    fontSize: '16px'
  },
  lineRole: {
    fontWeight: 'bold'
  },
  lineLocation: {
    //marginBottom: '6px',
    color: '#878787'
  },
  lineText: {
    marginBottom: '0',
    textAlign: 'left',
    '& li': {
      paddingBottom: '9px'
    },
    '& ul': {
      marginTop: '4px',
      marginBottom: '4px'
    }
  },
  lineNotes: {
    opacity: '0.9',
    textAlign: 'left',
    margin: '0 0 30px 0',
    color: theme.color.bg.dark
  }
});

function formatXpText(str = '') {
  return {
    __html: '<ul><li> ' + str.replace(/\.\. /g, '</li><li>') + '</li></ul>'
  };
}

function formatPeriodText(str = '') {
  return {
    __html: str.length > 12 ? str.replace(/ - /g, ' -<br/>&nbsp;&nbsp;') : str
  };
}

function LineXp({ id, intl }) {
  const classes = useStyles();

  return (
    <div className={classes.line}>
      <div className={classes.linePeriod} dangerouslySetInnerHTML={formatPeriodText(intl.formatMessage({ id: `str.${id}.period` }))}></div>
      <div className={classes.lineContent}>
        <div className={classes.lineRoleLoc} style={{ display: 'flex' }}>
          <div className={classes.lineRole}>{intl.formatMessage({ id: `str.${id}.role` })}</div>
          <div className={classes.lineLocation}>
            {'\u00A0 \u00A0'} @{intl.formatMessage({ id: `str.${id}.location` })}
          </div>
        </div>
        <div className={classes.lineText} dangerouslySetInnerHTML={formatXpText(intl.formatMessage({ id: `str.${id}.text` }))} />
        <div className={classes.lineNotes}>{intl.formatMessage({ id: `str.${id}.notes` })}</div>
      </div>
    </div>
  );
}

export default injectIntl(LineXp);
