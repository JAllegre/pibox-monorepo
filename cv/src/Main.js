import React from 'react';
import { createUseStyles } from 'react-jss';
import SectionEducation from './SectionEducation';
// import SectionInterests from './SectionInterrest';
import SectionSkills from './SectionSkills';
import SectionXp from './SectionXp';

const useStyles = createUseStyles({
  main: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '1200px',
    '@media (max-width: 1200px)': {
      padding: '10px',
      width: '100%'
    }
  }
});

function Main() {
  const classes = useStyles();
  return (
    <main className={classes.main}>
      <SectionXp />
      <SectionSkills />
      <SectionEducation />
    </main>
  );
}

export default Main;
