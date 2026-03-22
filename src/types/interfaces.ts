export type EnvVars = {
  PORT: number
  HOST: string
  APP_NAME: string
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
}

export type ErrorResponse = {
  message: string
}
