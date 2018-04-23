import { HtdocsPage } from './app.po';

describe('htdocs App', () => {
  let page: HtdocsPage;

  beforeEach(() => {
    page = new HtdocsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
