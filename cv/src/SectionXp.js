import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import LineXp from './LineXp';
import Section from './Section';
import SectionContent from './SectionContent';
import SectionTitle from './SectionTitle';
import { ReactComponent as Icon } from './images/handyman-black-18dp.svg';

const useStyles = createUseStyles({
  content: {
    display: 'flex',
    flexDirection: 'column'
  }
});

function SectionXp({ intl }) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  function handleCollapse(isCollapsed) {
    setCollapsed(isCollapsed);
  }

  return (
    <Section>
      <SectionTitle icon={<Icon />} collapsed={collapsed} onCollapsed={handleCollapse}>
        <FormattedMessage id="str.experiences.title" />
      </SectionTitle>
      <SectionContent collapsed={collapsed}>
        <div className={classes.content}>
          <LineXp key="xp6" id="xp6" />
          <LineXp key="xp5" id="xp5" />
          <LineXp key="xp4" id="xp4" />
          <LineXp key="xp3" id="xp3" />
          <LineXp key="xp2" id="xp2" />
          <LineXp key="xp1" id="xp1" />
        </div>
      </SectionContent>
    </Section>
  );
}

export default injectIntl(SectionXp);
