Community REST Site
E E E
A simple HTML site that uses Firebase Authentication and Firestore REST API.

## Features
- Login & Register
- Remember Me checkbox
- Password reset support
- Redirect after login
- Public profile viewer (read from Firestore)
- Works fully from `file://` or mobile browser

## Files
- `login_with_remember_and_redirect.html` â€” Login form
- `landing.html` â€” Welcome page after login
- `view_profiles_rest.html` â€” Public viewer for all users

## Hosting
1. Upload these files to GitHub
2. Deploy on [Vercel](https://vercel.com)

## Firebase
Make sure Firebase Auth is enabled and Firestore rules allow access like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
