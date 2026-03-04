import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { User, StudentProfile } from '../../core/models/user.model';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

function confirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const parent = control.parent;
  if (!parent) return null;
  const newPw = parent.get('newPassword')?.value;
  return control.value === newPw ? null : { mismatch: true };
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profile: StudentProfile | null = null;

  avatarPreview: string = '';
  pendingAvatarBase64: string | null = null;

  infoForm!: FormGroup;
  passwordForm!: FormGroup;

  savingInfo = false;
  savingPassword = false;

  toast: Toast | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadProfile();
  }

  // ─── Forms ──────────────────────────────────────────────────────────────────

  private buildForms(): void {
    this.infoForm = this.fb.group({
      phone: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator as ValidatorFn]],
    });

    // Re-validate confirmPassword whenever newPassword changes
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.passwordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // ─── Load ────────────────────────────────────────────────────────────────────

  private loadProfile(): void {
    // Seed from localStorage immediately (no flash)
    this.user = this.authService.getCurrentUser();
    this.profile = this.authService.getCurrentProfile();
    this.patchForms();

    // Then refresh from API
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.profile = res.profile;
        this.patchForms();
      },
      error: () => { /* keep localStorage data on network error */ },
    });
  }

  private patchForms(): void {
    this.avatarPreview = this.profile?.avatarUrl ?? 'https://i.pravatar.cc/150?img=0';
    this.infoForm.patchValue({ phone: this.profile?.phone ?? '' });
  }

  // ─── Avatar upload ──────────────────────────────────────────────────────────

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      this.avatarPreview = b64;
      this.pendingAvatarBase64 = b64;
    };
    reader.readAsDataURL(file);
  }

  // ─── Save info ───────────────────────────────────────────────────────────────

  onSaveInfo(): void {
    if (this.infoForm.invalid) { this.infoForm.markAllAsTouched(); return; }

    const payload: { phone: string; avatarUrl?: string } = {
      phone: this.infoForm.value.phone,
    };
    if (this.pendingAvatarBase64) {
      payload.avatarUrl = this.pendingAvatarBase64;
    }

    this.savingInfo = true;
    this.profileService.updateProfile(payload).subscribe({
      next: (res) => {
        this.profile = res.profile;
        this.pendingAvatarBase64 = null;
        localStorage.setItem('profile', JSON.stringify(res.profile));
        this.showToast('success', 'Profile updated successfully.');
        this.savingInfo = false;
      },
      error: (err) => {
        this.showToast('error', err.error?.message ?? 'Failed to update profile.');
        this.savingInfo = false;
      },
    });
  }

  onCancelInfo(): void {
    this.pendingAvatarBase64 = null;
    this.patchForms();
  }

  // ─── Change password ─────────────────────────────────────────────────────────

  onChangePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.savingPassword = true;

    this.profileService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.showToast('success', 'Password changed successfully.');
        this.passwordForm.reset();
        this.savingPassword = false;
      },
      error: (err) => {
        this.showToast('error', err.error?.message ?? 'Failed to change password.');
        this.savingPassword = false;
      },
    });
  }

  // ─── Toast ───────────────────────────────────────────────────────────────────

  private showToast(type: 'success' | 'error', message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { type, message };
    this.toastTimer = setTimeout(() => (this.toast = null), 3500);
  }

  dismissToast(): void {
    this.toast = null;
  }

  // ─── Helpers for template ────────────────────────────────────────────────────

  get f() { return this.infoForm.controls; }
  get p() { return this.passwordForm.controls; }

  get joinedDate(): string {
    if (!this.profile?.createdAt) return '—';
    return new Date(this.profile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}

