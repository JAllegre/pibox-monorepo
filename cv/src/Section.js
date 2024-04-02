import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  section: {
    overflow: 'hidden',
    margin: '0 0 15px 0',
    maxWidth: '1200px',
    width: '100%'
  }
});

function Section({ children }) {
  const classes = useStyles();
  return <div className={classes.section}>{children}</div>;
}

export default Section;
