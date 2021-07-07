interface StoreConfigs {
  persist?: boolean;
  debug?: boolean;
}

const defaultConfigs = {
  persist: false,
  debug: false
}

export { defaultConfigs, StoreConfigs }
