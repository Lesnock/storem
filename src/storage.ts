import { StoreData } from "./types"

const storageKey = 'storem-data'

/**
 * Loads the store data from localStorage
 */
function loadData(): StoreData {
  if (!localStorage.getItem(storageKey)) {
    return {}
  }

  const content = <string>localStorage.getItem(storageKey)

  return JSON.parse(content)
}

/**
 * Save the store data in localStorage
 */
function saveData(data: StoreData): void {
  const json = JSON.stringify(data)
  localStorage.setItem(storageKey, json)
}

export { loadData, saveData }
