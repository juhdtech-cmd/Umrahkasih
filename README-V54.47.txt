V54.47 — FIRESTORE ENQUIRY LIVE FIX

Punca utama yang dijumpai:
1. product.html memanggil customer-enquiry.js tetapi TIDAK memuatkan firebase-config.js.
   Akibatnya firebaseReady=false pada halaman pakej dan enquiry jatuh ke WhatsApp fallback.
2. Firestore rules lama hanya membenarkan lead apabila request.auth == null.
   Ini menyebabkan ujian referral gagal jika browser yang sama masih login sebagai Musawwiq.

UPLOAD KE ROOT GITHUB (Replace):
- product.html
- customer-enquiry.js
- firebase-config.js
- firebase-client.js
- musawwiq-dashboard.html
- musawwiq-dashboard.js
- referral-proof.css

FIREBASE CONSOLE (bukan GitHub):
- Firestore Database > Rules
- Gantikan rules dengan kandungan firestore.rules dalam patch ini
- Tekan Publish

UJIAN:
1. Login Musawwiq dan Copy Link referral.
2. Buka link referral.
3. Pilih pakej > Saya Berminat.
4. Isi Nama + No Telefon.
5. Hantar Pertanyaan.
6. Mesti keluar Pendaftaran/Pertanyaan berjaya dengan ID Musawwiq + Ref Enquiry.
7. Refresh Dashboard Musawwiq: User Asking bertambah dan lead memaparkan nama, telefon, pakej serta referral proof.

Nota: Firebase web apiKey memang public identifier untuk web SDK; keselamatan data dikawal melalui Firestore Rules.
