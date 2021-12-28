export interface Token {
    aud: string
    exp: number
    iat: number
    iss: string
    roles: string[]
    sub: string
}