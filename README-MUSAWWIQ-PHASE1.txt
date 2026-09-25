UMRAHKASIH — MUSAWWIQ PHASE 1 FOUNDATION (V54.41)

Apa yang sudah dibina:
1. Pendaftaran Musawwiq + password.
2. ID Musawwiq automatik.
3. Login menggunakan ID + password.
4. Dashboard Musawwiq.
5. Referral URL + Copy / Share.
6. Ruang User Enquiry (Nama, Telefon, Pakej, Status).
7. Potential / Confirmed / Paid Commission.
8. Marketing Material.
9. Firestore security rules asas.
10. referral.js foundation untuk simpan referral selama 30 hari.

BELUM LIVE CLOUD sehingga Firebase disambungkan.

SETUP FIREBASE (sekali sahaja):
A. Create Firebase project.
B. Add Web App.
C. Enable Authentication > Email/Password.
D. Create Cloud Firestore database.
E. Copy Firebase Web Config ke firebase-config.js.
F. Publish firestore.rules.

Firebase SDK yang digunakan: browser module 12.19.0.

PENTING:
- No IC/KTP/Passport penuh TIDAK disimpan ke Firestore dalam versi ini. Hanya 4 digit terakhir disimpan.
- leads create masih disabled dalam Firestore Rules sehingga customer enquiry capture diaktifkan dengan flow yang selamat.
- Dashboard tidak menunjukkan data palsu. Ia hanya paparkan data sebenar selepas Firestore diisi.

Langkah seterusnya:
1. Sambungkan Firebase config.
2. Aktifkan customer enquiry capture daripada referral URL.
3. Bina Sales Office console untuk update lead status dan commission.
4. Sambungkan Marketing Material kepada Google Drive/Firestore.
