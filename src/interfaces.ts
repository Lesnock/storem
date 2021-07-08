import { StoreConfigs } from './config'

interface IStore {
  constructor(configs: StoreConfigs): void
}

export {
  IStore
}
