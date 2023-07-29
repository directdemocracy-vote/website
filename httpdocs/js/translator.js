"use strict"

class Translator {
  #url;
  #dictionary;
  #languages;
  #language;
  constructor(url, language) {
    if (!url.endsWith('/'))
      url += '/';
    #url = url;
    fetch(`${url}languages.json`)
      .then((r) => r.json())
      .then((languages) => {
        #languages = languages;
        #language = language;
      })
      .catch(() => {
        console.error(`Could not load "${url}languages.json".`);
      });
  }
  set language(language) {
    if (language === undefined)
      #language = navigator.languages ? navigator.languages[0] : navigator.language;
    if (!Object.keys(#languages).includes(language))
      #language = language.substr(0, 2);
    if (!Object.keys(#languages).includes(language))
      #language = 'en';
    if (document.documentElement.lang !== language)
      document.documentElement.lang = language;
    fetch(`${#url}${language}.json`)
      .then((r) => r.json())
      .then((dictionary) => {
        #dictionary = dictionary;
        this.translatePage();
      })
      .catch(() => {
        console.error(`Could not load "${#url}${language}.json".`);
      });
  }
  get language() {
    return document.documentElement.lang;
  }
  get languages() {
    return #languages;
  }
  translatePage() {
    #elements = document.querySelectorAll("[data-i18n]");
    #elements.forEach((element) => {
      let key = element.dataset.i18n;
      if (key in #dictionary)
        element.innerHTML = this.translate(key);
      else {
        console.error(`Missing translation for key "${key}" in language "${#language}".`);
        element.innerHTML = this.translate('en');
      }
    });
  }
  translate(key) {
    return #dictionary[key];
  }
}
export default Translator;
