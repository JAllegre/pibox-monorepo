import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import './App.css';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import Main from './Main';
import messagesEn from './i18n/en.json';
import messagesFr from './i18n/fr.json';
// import locale_en from 'react-intl/locale-data/en';
// import locale_de from 'react-intl/locale-data/fr';

const messages = {
  fr: messagesFr,
  en: messagesEn
};

let initLanguage = localStorage.getItem('jacv');
initLanguage = initLanguage || navigator.language.split(/[-_]/)[0];

function App() {
  const [language, setLanguage] = useState(initLanguage);

  function changeLanguage(newLanguage) {
    localStorage.setItem('jacv', newLanguage);
    setLanguage(newLanguage);
  }

  return (
    <IntlProvider locale={language} key={language} messages={messages[language]}>
      <div className="app">
        <Header />
        <LanguageSelector language={language} onChangeLanguage={changeLanguage} />
        <Main />
      </div>
    </IntlProvider>
  );
}

export default App;
