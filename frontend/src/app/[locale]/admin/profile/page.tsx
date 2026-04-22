'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { adminApi } from '@/lib/api';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface Child {
  nameEn: string;
  nameAr: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  medicalConditions: string;
}

export default function ProfilePage() {
  const { user, accessToken, initAuth } = useAuthStore();

  // Profile form
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    if (user) {
      setNameEn(user.nameEn || '');
      setNameAr(user.nameAr || '');
      setPhone((user as any).phone || '');
      setNationality((user as any).nationality || '');
      setNationalId((user as any).nationalId || '');
      const kids = (user as any).children || [];
      setChildren(
        kids.map((c: any) => ({
          nameEn: c.nameEn || '',
          nameAr: c.nameAr || '',
          dateOfBirth: c.dateOfBirth ? c.dateOfBirth.slice(0, 10) : '',
          gender: c.gender || '',
          grade: c.grade || '',
          medicalConditions: c.medicalConditions || '',
        }))
      );
    }
  }, [user]);

  const handleProfileSave = async () => {
    if (!accessToken) return;
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const payload: any = { nameEn, nameAr, phone, nationality, nationalId };
      if (user?.role === 'PARENT') {
        payload.children = children.map((c) => ({
          ...c,
          dateOfBirth: c.dateOfBirth || undefined,
        }));
      }
      await adminApi.updateProfile(payload, accessToken);
      // Refresh user data in store
      initAuth();
      setProfileMsg('Profile updated successfully.');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!accessToken) return;
    if (newPassword !== confirmPassword) {
      setPwMsg('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg('Password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    setPwMsg('');
    try {
      const res = await adminApi.changePassword(accessToken, currentPassword, newPassword);
      // Update tokens in store
      if (res.data?.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        useAuthStore.setState({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        });
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwMsg('Password changed successfully.');
    } catch (err: any) {
      setPwMsg(err.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  // Children helpers
  const addChild = () => {
    setChildren([...children, { nameEn: '', nameAr: '', dateOfBirth: '', gender: '', grade: '', medicalConditions: '' }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      {/* User Info Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
            {(user.nameEn || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user.nameEn}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name (English)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name (Arabic)</label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              dir="rtl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">National ID</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {profileMsg && (
          <p className={`mt-4 text-sm ${profileMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {profileMsg}
          </p>
        )}

        <button
          onClick={handleProfileSave}
          disabled={profileLoading}
          className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {profileLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Children Section (PARENT only) */}
      {user.role === 'PARENT' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Children</h2>
            <button
              onClick={addChild}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <Plus className="h-4 w-4" /> Add Child
            </button>
          </div>

          {children.length === 0 && (
            <p className="text-sm text-gray-400">No children added yet.</p>
          )}

          <div className="space-y-6">
            {children.map((child, index) => (
              <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Child {index + 1}</span>
                  <button
                    onClick={() => removeChild(index)}
                    className="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Name (English)</label>
                    <input
                      type="text"
                      value={child.nameEn}
                      onChange={(e) => updateChild(index, 'nameEn', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Name (Arabic)</label>
                    <input
                      type="text"
                      value={child.nameAr}
                      onChange={(e) => updateChild(index, 'nameAr', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Date of Birth</label>
                    <input
                      type="date"
                      value={child.dateOfBirth}
                      onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Gender</label>
                    <select
                      value={child.gender}
                      onChange={(e) => updateChild(index, 'gender', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Grade</label>
                    <input
                      type="text"
                      value={child.grade}
                      onChange={(e) => updateChild(index, 'grade', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Medical Conditions</label>
                    <input
                      type="text"
                      value={child.medicalConditions}
                      onChange={(e) => updateChild(index, 'medicalConditions', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {pwMsg && (
          <p className={`mt-4 text-sm ${pwMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {pwMsg}
          </p>
        )}

        <button
          onClick={handlePasswordChange}
          disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
          className="mt-6 flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
        >
          {pwLoading ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}
