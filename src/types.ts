type StoreData = { [dataName: string]: any }

type StoreEffects = { [dataName: string]: Effect[] }

type Effect = (value?: any, oldValue?: any) => any

type Mutation = (state: StoreData) => void

export {
  StoreData,
  StoreEffects,
  Effect,
  Mutation
}
