interface StoreConfigs {
  persist?: boolean;
  debug?: boolean;
  reactOnDelete?: boolean;
}

const defaultConfigs: StoreConfigs = {
  persist: false,
  debug: false,
  reactOnDelete: false
}

export { defaultConfigs, StoreConfigs }
