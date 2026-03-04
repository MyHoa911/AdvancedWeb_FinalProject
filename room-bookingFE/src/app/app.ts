import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('room-booking');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Keep Render backend alive by pinging every 10 minutes
    this.pingBackend();
    setInterval(() => this.pingBackend(), 10 * 60 * 1000);
  }

  private pingBackend(): void {
    const base = environment.apiBaseUrl.replace('/api', '');
    this.http.get(base, { responseType: 'text' }).subscribe({ error: () => {} });
  }
}
