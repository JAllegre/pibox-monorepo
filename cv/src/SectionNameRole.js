import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    padding: '0 0 40px 0'
  },
  name: {
    fontSize: '2em',
    fontWeight: '500'
  },
  role: {
    display: 'flex',
    fontSize: '1.5em',
    flex: '1 1 auto',
    textTransform: 'uppercase',
    fontWeight: '400',
    flexWrap: 'wrap'
  }
});

function SectionNameRole() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.name}>Julien Allègre</div>
      <div className={classes.role}>
        <FormattedMessage id="str.head.role" />
        &nbsp;-&nbsp;<span> Fullstack JS/TS </span>
      </div>
    </div>
  );
}

export default SectionNameRole;
