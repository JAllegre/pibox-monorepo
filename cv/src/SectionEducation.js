import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { ReactComponent as Icon } from './images/school-black-18dp.svg';
import Section from './Section';
import SectionContent from './SectionContent';
import SectionTitle from './SectionTitle';

const useStyles = createUseStyles({
  table: {
    width: '100%',
    border: '0',
    backgroundColor: 'transparent',
    padding: '0'
  },
  tr: {
    textAlign: 'left'
  },
  td: {
    textAlign: 'left',
    padding: '4px 0'
  },
  tdText: {
    paddingLeft: '10px',
    textAlign: 'left'
  },
  tdYear: {
    color: '#909090',
    fontWeight: 'bold',
    width: '100px',
    textAlign: 'left'
  }
});

function Line({ year, children }) {
  const classes = useStyles();
  return (
    <tr className={classes.tr}>
      <td className={classes.td + ' ' + classes.tdYear}>{year}</td>
      <td className={classes.td + ' ' + classes.tdText}>{children}</td>
    </tr>
  );
}

function SectionEducation() {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  function handleCollapse(isCollapsed) {
    setCollapsed(isCollapsed);
  }
  return (
    <Section>
      <SectionTitle icon={<Icon />} collapsed={collapsed} onCollapsed={handleCollapse}>
        <FormattedMessage id="str.formations.title" />
      </SectionTitle>
      <SectionContent collapsed={collapsed}>
        <table className={classes.table}>
          <tbody>
            <Line year="2007">
              <FormattedMessage id="str.formations.cnam" />
            </Line>
            <Line year="2000">
              <FormattedMessage id="str.formations.du" />
            </Line>
            <Line year="1999">
              <FormattedMessage id="str.formations.dut" />
            </Line>
          </tbody>
        </table>
      </SectionContent>
    </Section>
  );
}

export default SectionEducation;
