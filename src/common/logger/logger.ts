export class Logger {
  env: string;
  prefix: string;
  private static instance: Logger;
  private constructor(prefix = "j5s") {
    this.prefix = prefix;
    this.env = process.env.NODE_ENV || "development";
    console.log(this.env);
  }
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...args: any[]) {
    if (this.env === "production") return;
    console.info(`[${this.prefix}]`, ...args);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...args: any[]) {
    if (this.env === "production") return;
    console.log(`[${this.prefix}]`, ...args);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...args: any[]) {
    if (this.env === "production") return;
    console.warn(`[${this.prefix}]`, ...args);
  }
}
