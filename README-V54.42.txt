UmrahKasih V54.42 — Firebase Live Connection

Upload/replace at GitHub root:
- firebase-config.js

Firebase prerequisites:
1. Authentication > Email/Password enabled.
2. Firestore Database created.
3. Firestore rules published.
4. Add authorized domains in Firebase Authentication > Settings > Authorized domains:
   - umrahkasih.vercel.app
   - umrahkasih.online (when production domain is connected)

Then test:
- musawwiq.html -> register
- copy generated Musawwiq ID
- musawwiq-login.html -> login using ID + password
- musawwiq-dashboard.html -> dashboard should load
