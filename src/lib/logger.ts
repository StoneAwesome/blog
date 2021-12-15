class Logger {
  Log(message?: string, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }
}
const instance = new Logger();

export default instance;
