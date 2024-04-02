import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { ReactComponent as Icon } from './images/settings-black-18dp.svg';
import Section from './Section';
import SectionContent from './SectionContent';
import SectionTitle from './SectionTitle';
import theme from './theme';

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: '30px',
    '& > div': {
      width: 'auto',
      flex: '1 1 auto',
      margin: 0
    }
  },

  content: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },

  table: {
    width: '30%',
    padding: '8px 0',
    minWidth: '150px',
    border: '0',
    backgroundColor: 'transparent'
  },
  td: {
    padding: '2px'
  },
  tdStars: {
    textAlign: 'center'
  },
  tdTech: {
    textAlign: 'left',
    width: '50%'
  },
  rater: {
    display: 'flex',
    width: '100%',
    height: '10px'
  },
  rate: {
    border: '1px solid grey',

    flex: '1 0 auto',
    height: '8px'
  },
  rateOn: {
    backgroundColor: theme.color.bg.dark
  },
  rateOff: {}
});

function SkillLine({ tech, rate }) {
  const classes = useStyles();
  const rates = [];
  for (let cpt = 0; cpt < 5; cpt++) {
    const key = `rate-${cpt}`;
    rates.push(<div key={key} className={classes.rate + ' ' + (cpt < rate ? classes.rateOn : classes.rateOff)} />);
  }
  return (
    <tr>
      <td className={classes.td + ' ' + classes.tdTech}>{tech}</td>
      <td className={classes.td + ' ' + classes.tdStars}>
        <div className={classes.rater}>{rates}</div>
      </td>
    </tr>
  );
}

function SectionSkills({ intl }) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  function handleCollapse(isCollapsed) {
    setCollapsed(isCollapsed);
  }

  // const englishTechnical = intl.formatMessage({ id: 'str.skills.english.technical' });
  // const englishFluent = intl.formatMessage({ id: 'str.skills.english.fluent' });
  const english = intl.formatMessage({ id: 'str.skills.english' });
  return (
    <div className={classes.root}>
      <Section>
        <SectionTitle icon={<Icon />} collapsed={collapsed} onCollapsed={handleCollapse}>
          <FormattedMessage id="str.skills.title.main" />
        </SectionTitle>
        <SectionContent collapsed={collapsed}>
          <div className={classes.content}>
            <table className={classes.table}>
              <tbody>
                <SkillLine key="js" tech="JavaScript" rate={5} />
                <SkillLine key="ts" tech="TypeScript" rate={4} />
                <SkillLine key="html" tech="HTML/CSS" rate={5} />
                <SkillLine key="react" tech="React" rate={5} />
                <SkillLine key="redux" tech="Redux/RTK" rate={4} />
                <SkillLine key="mui" tech="MUI" rate={5} />
              </tbody>
            </table>
            <table className={classes.table}>
              <tbody>
                <SkillLine key="node" tech="Node/Express" rate={4} />
                <SkillLine key="github" tech="Git" rate={4} />
                <SkillLine key="git" tech="GitHub" rate={4} />
                <SkillLine key="scrum" tech="Agile/Scrum" rate={3} />
              </tbody>
            </table>
          </div>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle icon={<Icon />} collapsed={collapsed} onCollapsed={handleCollapse}>
          <FormattedMessage id="str.skills.title.other" />
        </SectionTitle>
        <SectionContent collapsed={collapsed}>
          <div className={classes.content}>
            <table className={classes.table}>
              <tbody>
                <SkillLine key="tailwind" tech="TailwindCSS" rate={3} />
                <SkillLine key="vue" tech="Vue" rate={2} />
                <SkillLine key="bootstrap" tech="Bootstrap" rate={2} />
                <SkillLine key="next" tech="NextJS" rate={2} />
                <SkillLine key="jest" tech="Jest/Enzyme" rate={3} />
                <SkillLine key="cypress" tech="Cypress" rate={2} />
                <SkillLine key="dock" tech="Docker" rate={3} />
              </tbody>
            </table>
            <table className={classes.table}>
              <tbody>
                <SkillLine key="rest" tech="RestAPI" rate={4} />
                <SkillLine key="graph" tech="GraphQL" rate={3} />
                <tr>
                  <td>
                    <br />
                    <br />
                  </td>
                </tr>
                <SkillLine key="english" tech={english} rate={4} />
              </tbody>
            </table>
          </div>
        </SectionContent>
      </Section>
    </div>
  );
}

export default injectIntl(SectionSkills);
