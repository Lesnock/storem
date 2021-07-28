import { log } from './log'
import { loadData, saveData } from './storage'
import { defaultConfigs, StoreConfigs } from './config'
import { StoreData, StoreEffects, Effect, Mutation } from './types'

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

  /**
   * Store mutations
   */
  mutations: { [name: string]: Mutation }

  constructor(configs: StoreConfigs = {}) {
    configs.debug && log('Initializing store')

    this.data = {}
    this.effects = {}
    this.mutations = {}
    this.configs = { ...defaultConfigs, ...configs }

    configs.debug && log('Configurations:', configs)

    if (!!this.configs.persist && !this.isRunningOnNode()) {
      this.data = loadData()
      configs.debug && log('Loaded data from localStorage:', this.data)
    }
  }

  /**
   * Check if storem is running on node platform
   * @returns {Boolean} isRunningOnNode
   */
  private isRunningOnNode(): boolean {
    return typeof window === 'undefined'
  }

  /**
   * Run the effects
   */
  private runEffects(dataName: string | number, value?: any, oldValue?: any) {
    if (this.effects[dataName]) {
      this.effects[dataName].forEach(effect => {
        effect(value, oldValue)
      })
    }
  }

  /**
   * Set data to the store
   */
  set(data: StoreData): void {
    if (typeof data !== 'object') {
      throw new TypeError('Error in Storem "set" method: argument should be an object')
    }

    Object.keys(data).forEach(name => {
      const value = data[name]
      const oldValue = this.data[name]

      // Run effects
      this.runEffects(name, value, oldValue)

      // Set data
      this.data[name] = value

      this.configs.debug && log(`Set data`, name, value)
    })

    // Save data to storage
    if (!!this.configs.persist && !this.isRunningOnNode()) {
      saveData(this.data)
      this.configs.debug && log('Save data to localStorage')
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

  /**
   * Delete specific data to the store
   */
  delete(dataName: string | number | Array<string | number>) {
    // Delete function
    const deleteData = (name: string | number) => {
      const value = this.data[name]
      const oldValue = undefined

      // Delete data
      this.data[name] = undefined

      this.configs.debug && log(`Delete data ${name}`)

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
    if (!this.effects[dataName]) {
      this.effects[dataName] = []
    }

    this.effects[dataName].push(effect)

    this.configs.debug && log(`Create effect for data: ${dataName}`)
  }

  /**
   * Set a store mutation
   */
  setMutation(name: string, mutation: Mutation) {
    this.mutations[name] = mutation

    this.configs.debug && log(`Create mutation: ${name}`)
  }

  /**
   * Run a mutation
   */
  runMutation(name: string) {
    if (!this.mutations[name]) {
      throw new ReferenceError(`Mutation ${name} does not exists`)
    }

    this.mutations[name](this.data)

    this.configs.debug && log(`Run mutation: ${name}`)
  }
}

export { Store }
