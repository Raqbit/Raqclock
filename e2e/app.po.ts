import { browser, by, element } from 'protractor';

export class RaqclockClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('rqc-root h1')).getText();
  }
}
