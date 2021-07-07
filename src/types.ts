type StoreData = { [dataName: string]: any }

type StoreEffects = { [dataName: string]: Effect[] }

type Effect = (value?: any, oldValue?: any) => any

export {
  StoreData,
  StoreEffects,
  Effect
}
