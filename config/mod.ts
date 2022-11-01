export class Config<DiscoveryValue = any> {
  #discoveryValue?: DiscoveryValue | Promise<DiscoveryValue>;

  constructor(readonly initDiscoveryValue: () => DiscoveryValue | Promise<DiscoveryValue>) {}

  get discoveryValue() {
    if (!this.#discoveryValue) {
      this.#discoveryValue = this.initDiscoveryValue();
    }
    return this.#discoveryValue;
  }
}
