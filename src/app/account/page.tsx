// src/app/account/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

type UserProfile = {
  email: string;
  ownerName: string;
  petName: string;
  username: string;
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    ownerName: '',
    petName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setProfile({
        email: session.user.email || '',
        ownerName: (session.user as any).name || '',
        petName: '',
        username: (session.user as any).username || '',
      });
      setFormData({
        ownerName: (session.user as any).name || '',
        petName: '',
        email: session.user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [session]);

  const handleSave = async () => {
    setError('');
    setSaving(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const updateData: any = {};
      if (formData.ownerName) updateData.ownerName = formData.ownerName;
      if (formData.petName) updateData.petName = formData.petName;
      if (formData.email) updateData.email = formData.email;
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data.user);
        setEditing(false);
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        alert('Profile updated successfully');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || !mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Middleware will redirect
  }

  const username = (session.user as any)?.username;

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Account</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Pet Name</label>
                <input
                  type="text"
                  value={formData.petName}
                  onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full rounded border p-2"
                  placeholder="Leave blank to keep current"
                />
              </div>
              {formData.currentPassword && (
                <>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>
                </>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setError('');
                  }}
                  className="flex-1 rounded border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Email</p>
                <p className="font-medium">{profile?.email || session.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Username</p>
                <p className="font-medium">{username}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Owner Name</p>
                <p className="font-medium">{profile?.ownerName || session.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Pet Name</p>
                <p className="font-medium">{profile?.petName || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full rounded border px-4 py-2 text-center hover:bg-neutral-50"
            >
              View Order History
            </Link>
            {username && (
              <Link
                href={`/builder`}
                className="block w-full rounded border px-4 py-2 text-center hover:bg-neutral-50"
              >
                Edit Profile Page
              </Link>
            )}
            {username && (
              <Link
                href={`/${username}`}
                className="block w-full rounded border px-4 py-2 text-center hover:bg-neutral-50"
                target="_blank"
              >
                View Public Page
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

