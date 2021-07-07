import { loadData, saveData } from './storage'
import { defaultConfigs, StoreConfigs } from './config'
import { StoreData, StoreEffects, Effect } from './types'

class Store {
  /**
   * Store Data
   */
  data: StoreData

  /**
   * Store effects
   */
  effects: StoreEffects

  /**
   * Store Configs
   */
  configs: StoreConfigs

  constructor(configs: StoreConfigs) {
    this.data = {}
    this.effects = {}
    this.configs = { ...defaultConfigs, ...configs }

    if (!this.isRunningOnNode && this.configs.persist) {
      this.data = loadData()
    }
  }

  private isRunningOnNode(): boolean {
    return window === undefined
  }
}

export { Store }
