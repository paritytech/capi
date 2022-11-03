export class Counter {
  i = 0;

  inc = () => {
    const tmp = this.i;
    this.i++;
    return tmp;
  };
}
