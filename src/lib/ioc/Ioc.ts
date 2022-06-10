class IocContainer {
  private saved = {};

  /**
   * save key
   */
  register = (name: string, cb: Function) => {
    this.saved[name] = cb;
  }

  /**
   * get saved key
   */
  get = (name: string) => {
    if(this.saved.hasOwnProperty(name)){
      const resolver = this.saved[name];

      return resolver(this);
    }

    throw new Error(`IocContainer does not have saved key "${name}".`);
  }
}

export default IocContainer;
