import { User } from "../components/user/user.entity";

export interface LoginHttpResponse {
    access_token: string,
    refresh_token: string,
    expires_at: Date,
    token_type: string,
    user: User

}