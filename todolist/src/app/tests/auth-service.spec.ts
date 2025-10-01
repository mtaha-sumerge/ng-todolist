import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthResponseData, AuthService } from '../services/AuthService';
import { firebaseConfig } from '../config/firestore';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    const mockResponse: AuthResponseData = {
        kind: 'identitytoolkit#SignupNewUserResponse',
        idToken: 'fake-token',
        email: 'test@test.com',
        refreshToken: 'fake-refresh',
        expiresIn: '3600',
        localId: 'local-123',
        registered: true
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        sessionStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        sessionStorage.clear();
    })


    it('Auth Service should be injected', () => {
        expect(service).toBeTruthy();
    });

    it('signUp should send POST request and store token', () => {
        service.signUp('test@test.com', 'testing').subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(service.token).toBe('fake-token');
            expect(sessionStorage.getItem('authToken')).toBe('fake-token');
        });

        const req = httpMock.expectOne(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${firebaseConfig.apiKey}`);

        expect(req.request.method).toBe('POST');
        expect(req.request.body.email).toBe('test@test.com');

        req.flush(mockResponse);
    });

    it('login should send POST request and store token', () => {
        service.login('test@test.com', '123456').subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(service.token).toBe('fake-token');
            expect(sessionStorage.getItem('authToken')).toBe('fake-token');
        });

        const req = httpMock.expectOne(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${firebaseConfig.apiKey}`);

        expect(req.request.method).toBe('POST');
        expect(req.request.body.email).toBe('test@test.com');

        req.flush(mockResponse);
    });

    it('logout should clear token and end session', () => {
        (service as any)._token = 'fake-token';
        sessionStorage.setItem('authToken', 'fake-token');

        service.logout();

        expect(service.token).toBeNull();
        expect(sessionStorage.getItem('authToken')).toBeNull();
    });
});