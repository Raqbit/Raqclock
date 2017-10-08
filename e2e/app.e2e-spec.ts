import { RaqclockClientPage } from './app.po';

describe('raqclock-client App', () => {
  let page: RaqclockClientPage;

  beforeEach(() => {
    page = new RaqclockClientPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to rqc!!'))
      .then(done, done.fail);
  });
});
