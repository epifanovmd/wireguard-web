export interface IntervalDataSourceSubscription {
  unsubscribe: () => void;
}

const TIMER_INTERVAL_DEFAULT = 5000;

export abstract class IntervalDataSource<Res, Req> {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  protected constructor(protected _fetchFn: (req: Req) => Promise<Res>) {}

  protected subscribe(
    onData: (res: Res) => void,
    timerInterval?: number,
  ): IntervalDataSourceSubscription {
    const _timerInterval = timerInterval || TIMER_INTERVAL_DEFAULT;

    const intervalId = setInterval(async () => {
      onData(await this._fetchDataInternal());
    }, _timerInterval);

    return {
      unsubscribe: () => {
        clearInterval(intervalId);
      },
    };
  }

  protected abstract getParams(): Req;

  protected abstract beforeFetch(): void;

  protected abstract afterFetch(v: Res): void | Res;

  private _fetchDataInternal(): Promise<Res> {
    this.beforeFetch();
    const args = this.getParams();
    const fetch = this._fetchFn(args);

    return fetch.then(v => this.afterFetch(v) || v);
  }
}
