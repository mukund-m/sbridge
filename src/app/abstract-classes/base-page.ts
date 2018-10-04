export abstract class BasePage {
  loading: Boolean = false;
  success: Boolean = false;
  failure: Boolean = false;
  resultMessage: String = 'This is a message';
  loadingStatus: String = 'Loading...';
}
