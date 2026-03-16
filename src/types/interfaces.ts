export interface EnvVars {
  PORT: number
  HOST: string
  APP_NAME: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
}
