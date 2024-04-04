import React from 'react';
import { createUseStyles } from 'react-jss';
// import SectionInterests from './SectionInterrest';
import SectionEducation from './SectionEducation';
import SectionNameRole from './SectionNameRole';
import SectionXp from './SectionXp';

const useStyles = createUseStyles({
  main: {
    padding: '20px 15px',
    display: 'flex',
    flexDirection: 'column'
  }
});

function Main() {
  const classes = useStyles();
  return (
    <main className={classes.main}>
      <SectionNameRole />
      <SectionXp />
      <SectionEducation />
    </main>
  );
}

export default Main;
