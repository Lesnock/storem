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

  constructor(configs: StoreConfigs = {}) {
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

  set(data: StoreData): void {
    if (typeof data !== 'object') {
      throw new Error('Error in Storem "set" method: argument should be an object')
    }

    Object.keys(data).forEach(name => {
      const value = data[name]
      const oldValue = this.data[name]

      // Run effects
      if (this.effects[name]) {
        this.effects[name].forEach(effect => {
          effect(value, oldValue)
        })
      }

      // Set data
      this.data[name] = value
    })

    // Save data to storage
    if (!!this.configs.persist && !this.isRunningOnNode()) {
      saveData(this.data)
    }
  }

  listen(dataName: string | number, effect: Effect) {
    if (!this.data[dataName]) {
      throw new Error(
        `Error in Storem listen method: Data with name ${dataName} does not exists in the store.`
      )
    }

    if (!this.effects[dataName]) {
      this.effects[dataName] = []
    }

    this.effects[dataName].push(effect)
  }
}

export { Store }
