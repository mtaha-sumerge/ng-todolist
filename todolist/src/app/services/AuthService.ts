import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firebaseConfig } from "../config/firestore";
import { tap } from "rxjs";

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private httpClient = inject(HttpClient);

    private _token: string | null = null;

    // Getter
    get token(): string | null {
        return this._token;
    }

    // Posts new credentials and stores the authorization token
    signUp(email: string, password: string) {
        return this.httpClient.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${firebaseConfig.apiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap(res => {
                this._token = res.idToken;
                sessionStorage.setItem('authToken', res.idToken);
            })
        );
    }

    // Checks user credentials and stores his token
    login(email: string, password: string) {
        return this.httpClient.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${firebaseConfig.apiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            },
        ).pipe(
            tap(res => {
                this._token = res.idToken;
                sessionStorage.setItem('authToken', res.idToken);
            })
        );
    }

    // Clears the session token
    logout() {
        this._token = null;
        sessionStorage.removeItem('authToken');
    }

}