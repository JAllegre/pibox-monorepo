import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  section: {
    overflow: 'hidden',
    margin: '0'
  }
});

function Section({ children }) {
  const classes = useStyles();
  return <div className={classes.section}>{children}</div>;
}

export default Section;
