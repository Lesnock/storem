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

    if (!!this.configs.persist && !this.isRunningOnNode()) {
      this.data = loadData()
    }
  }

  private isRunningOnNode(): boolean {
    return typeof window === 'undefined'
  }

  /**
   * Set data to the store
   */
  set(data: StoreData): void {
    if (typeof data !== 'object') {
      throw new Error('Error in Storem "set" method: argument should be an object')
    }

    Object.keys(data).forEach(name => {
      const value = data[name]
      const oldValue = this.data[name]

      // Run effects
      this.runEffects(name, value, oldValue)

      // Set data
      this.data[name] = value
    })

    // Save data to storage
    if (!!this.configs.persist && !this.isRunningOnNode()) {
      saveData(this.data)
    }
  }

  /**
   * Get a single data from store
   */
  get(dataName: string | number) {
    return this.data[dataName]
  }

  /**
   * Return all data from store
   */
  all(): StoreData {
    return this.data
  }

  /**
   * Return specifics data from store
   */
  only(dataNames: Array<string | number>): StoreData {
    const data: StoreData = {}

    dataNames.forEach(name => {
      data[name] = this.data[name]
    })

    return data
  }

  delete(dataName: string | number | Array<string | number>) {
    // Delete function
    const deleteData = (name: string | number) => {
      const value = this.data[name]
      const oldValue = undefined

      // Delete data
      this.data[name] = undefined

      if (!!this.configs.reactOnDelete) {
        this.runEffects(name, value, oldValue)
      }
    }

    // String or Number
    if (typeof dataName === 'string' || typeof dataName === 'number') {
      deleteData(dataName)
    }

    // Array (Multiple deletes)
    if (Array.isArray(dataName)) {
      dataName.forEach(name => deleteData(name))
      return
    }

    // Save data to storage
    if (!!this.configs.persist && !this.isRunningOnNode()) {
      saveData(this.data)
    }
  }

  /**
   * Check if a specific data exists in the store
   */
  has(dataName: string) {
    return this.data[dataName] !== undefined
  }

  /**
   * Add an effect listener to a specific data in the store
   */
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

  private runEffects(dataName: string | number, value?: any, oldValue?: any) {
    if (this.effects[dataName]) {
      this.effects[dataName].forEach(effect => {
        effect(value, oldValue)
      })
    }
  }
}

export { Store }
