import { useState } from "react";
import "../assets/profilePage.css";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  language: string;
  emailNotifications: boolean;
}

const INITIAL_PROFILE: ProfileData = {
  fullName: "Your Name",
  email: "user@example.com",
  phone: "",
  bio: "",
  language: "English",
  emailNotifications: true,
};

export function ProfilePage() {
  const [savedProfile, setSavedProfile] =
    useState<ProfileData>(INITIAL_PROFILE);
  const [form, setForm] = useState<ProfileData>(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const updateField = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setShowSavedMessage(false);
  };

  const handleSave = () => {
    setSavedProfile({ ...form });
    setIsEditing(false);
    setShowSavedMessage(true);
  };

  const handleCancel = () => {
    setForm({ ...savedProfile });
    setIsEditing(false);
    setShowSavedMessage(false);
  };

  const initial = form.fullName.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="profile-page">
      <div className="profile-page__heading">
        <div>
          <p className="profile-page__eyebrow">ACCOUNT SETTINGS</p>
          <h1>My Profile</h1>
          <p className="profile-page__description">
            Manage your personal information and account preferences.
          </p>
        </div>

        {!isEditing && (
          <button
            className="profile-button profile-button--primary"
            type="button"
            onClick={() => {
              setIsEditing(true);
              setShowSavedMessage(false);
            }}
          >
            Edit profile
          </button>
        )}
      </div>

      {showSavedMessage && (
        <div className="profile-message" role="status">
          Your changes have been saved for this session. They will not persist
          after a page refresh.
        </div>
      )}

      <div className="profile-page__layout">
        <aside className="profile-card profile-summary">
          <div className="profile-avatar" aria-hidden="true">
            {initial}
          </div>

          <h2>{form.fullName.trim() || "Your Name"}</h2>
          <p className="profile-summary__email">{form.email}</p>
          <span className="profile-role">Account member</span>

          <div className="profile-summary__divider" />

          <div className="profile-summary__item">
            <span className="profile-summary__label">Account</span>
            <span className="profile-summary__value">Personal profile</span>
          </div>

          <p className="profile-summary__hint">
            Your profile is shared across the learning platform.
          </p>
        </aside>

        <div className="profile-page__content">
          <section className="profile-card">
            <div className="profile-section__heading">
              <div>
                <h2>Personal information</h2>
                <p>Basic information associated with your account.</p>
              </div>
            </div>

            <div className="profile-form">
              <label className="profile-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={form.fullName}
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                />
              </label>

              <label className="profile-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  aria-describedby="profile-email-help"
                />
                <small id="profile-email-help">
                  Email editing can be connected to your account settings later.
                </small>
              </label>

              <label className="profile-field">
                <span>Phone number</span>
                <input
                  type="tel"
                  value={form.phone}
                  placeholder="Enter your phone number"
                  disabled={!isEditing}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </label>

              <label className="profile-field">
                <span>About me</span>
                <textarea
                  value={form.bio}
                  placeholder="Write a short introduction..."
                  rows={4}
                  disabled={!isEditing}
                  onChange={(event) => updateField("bio", event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-section__heading">
              <div>
                <h2>Preferences</h2>
                <p>Choose how you want to use the platform.</p>
              </div>
            </div>

            <div className="profile-preference">
              <div>
                <strong>Display language</strong>
                <p>Choose your preferred interface language.</p>
              </div>

              <select
                value={form.language}
                disabled={!isEditing}
                onChange={(event) =>
                  updateField("language", event.target.value)
                }
                aria-label="Display language"
              >
                <option value="English">English</option>
                <option value="Vietnamese">Vietnamese</option>
              </select>
            </div>

            <div className="profile-preference">
              <div>
                <strong>Email notifications</strong>
                <p>Receive account and learning activity updates.</p>
              </div>

              <input
                className="profile-toggle"
                type="checkbox"
                checked={form.emailNotifications}
                disabled={!isEditing}
                onChange={(event) =>
                  updateField("emailNotifications", event.target.checked)
                }
                aria-label="Enable email notifications"
              />
            </div>
          </section>

          {isEditing && (
            <div className="profile-actions">
              <button
                className="profile-button profile-button--secondary"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                className="profile-button profile-button--primary"
                type="button"
                onClick={handleSave}
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
