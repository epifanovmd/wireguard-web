import { IChartPoint } from "@components/wgChart";
import { EntityHolder } from "@store";

export interface IChartPoints {
  speed: IChartPoint[];
  traffic: IChartPoint[];
}

const EMPTY: IChartPoints = { speed: [], traffic: [] };

/**
 * Base class for stats stores that manage speed/traffic chart points.
 * Subclass must call makeAutoObservable(this) in its own constructor.
 */
export abstract class StatsChartBase {
  public chartHolder = new EntityHolder<IChartPoints>({
    initialData: EMPTY,
  });

  get speedPoints(): IChartPoint[] {
    return this.chartHolder.data?.speed ?? [];
  }

  get trafficPoints(): IChartPoint[] {
    return this.chartHolder.data?.traffic ?? [];
  }

  get isLoading(): boolean {
    return this.chartHolder.isLoading;
  }

  protected _startLoading(): void {
    this.chartHolder.setData(EMPTY);
    this.chartHolder.setLoading();
  }

  protected _setPoints(speed: IChartPoint[], traffic: IChartPoint[]): void {
    this.chartHolder.setData({ speed, traffic });
  }

  protected _appendStats(
    speedPoint: IChartPoint,
    trafficPoint: IChartPoint,
  ): void {
    const current = this.chartHolder.data ?? EMPTY;
    const shouldTrim = current.speed.length + 1 > 100;
    const speed = shouldTrim ? current.speed.slice(1) : [...current.speed];
    const traffic = shouldTrim
      ? current.traffic.slice(1)
      : [...current.traffic];

    speed.push(speedPoint);
    traffic.push(trafficPoint);

    this.chartHolder.setData({ speed, traffic });
  }
}
