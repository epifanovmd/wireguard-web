import { DateFormatter } from "./dateFormatter";

class Formatter {
  readonly date = new DateFormatter();

  bytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  speed = (bps: number): string => {
    if (bps === 0) return "0 bps";
    if (bps < 1000) return `${bps.toFixed(0)} bps`;
    if (bps < 1_000_000) return `${(bps / 1000).toFixed(1)} Kbps`;

    return `${(bps / 1_000_000).toFixed(1)} Mbps`;
  };
}

export const formatter = new Formatter();
