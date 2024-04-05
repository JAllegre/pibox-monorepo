import React from 'react';
import { injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import theme from './theme';

const useStyles = createUseStyles({
  line: {},

  lineRole: {
    paddingRight: '10px',
    paddingBottom: '20px',
    fontSize: '1.2em',
    fontWeight: 'bold'
  },
  lineLocation: {
    fontSize: '1.1em',
    color: '#878787'
  },
  linePeriod: {
    fontWeight: 'bold',
    color: theme.color.bg.dark
  },
  lineText: {
    marginBottom: '0',
    textAlign: 'left',
    '& li': {
      paddingBottom: '9px'
    },
    '& ul': {
      marginTop: '4px',
      marginBottom: '4px',
      paddingLeft: '25px'
    }
  },
  lineNotes: {
    opacity: '0.9',
    textAlign: 'left',
    margin: '0 0 30px 0',
    color: theme.color.bg.dark,
    fontStyle: 'italic'
  }
});

function formatXpText(str = '') {
  return {
    __html: '<ul><li> ' + str.replace(/\.\. /g, '</li><li>') + '</li></ul>'
  };
}

function LineXp({ id, intl }) {
  const classes = useStyles();

  return (
    <div className={classes.line}>
      <span className={classes.lineRole}>{intl.formatMessage({ id: `str.${id}.role` })}</span>
      <span className={classes.lineLocation}>@{intl.formatMessage({ id: `str.${id}.location` })}</span>
      <div className={classes.linePeriod}>{intl.formatMessage({ id: `str.${id}.period` })}</div>
      <div className={classes.lineText} dangerouslySetInnerHTML={formatXpText(intl.formatMessage({ id: `str.${id}.text` }))} />
      <div className={classes.lineNotes}>{intl.formatMessage({ id: `str.${id}.notes` })}</div>
    </div>
  );
}

export default injectIntl(LineXp);
