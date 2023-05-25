export class ChromeStorageLocal {
  key: string;
  constructor(key: string) {
    this.key = key;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateState(key: string, value: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.key], ({ state }) => {
        const updatedState = {
          ...state,
          [key]: value,
        };
        chrome.storage.local.set({
          // remove bookmark folders from taking up unnecessary space
          state: updatedState,
        });
        resolve({ key, value, state: updatedState });
      });
    });
  }

  getState<T>(): Promise<T> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.key], ({ state }) => {
        resolve(state);
      });
    });
  }
}
