import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, StudentProfile } from '../models/user.model';

export interface ProfileResponse {
  user: User;
  profile: StudentProfile | null;
}

export interface UpdateProfilePayload {
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/users/profile`, {
      headers: this.headers,
    });
  }

  updateProfile(data: UpdateProfilePayload): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/users/profile`, data, {
      headers: this.headers,
    });
  }

  changePassword(data: ChangePasswordPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/users/profile/change-password`,
      data,
      { headers: this.headers }
    );
  }
}
