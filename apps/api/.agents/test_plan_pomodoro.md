| ID Uji | Skenario Pengujian | Tindakan Pengujian (Simulasi) | Hasil yang Diharapkan |
| :---- | :---- | :---- | :---- |
| **STP-DB-01** | Pengujian Cascade Delete | Menghapus satu *record* *User* yang memiliki beberapa *record* *PomodoroLogs* di dalam *database*.  | Saat User dihapus, seluruh record di PomodoroLogs milik user tersebut otomatis terhapus. |
| **STP-DB-02** | Pengujian SetNull | Menghapus satu *record* *Task* yang sudah memiliki ikatan riwayat sesi *PomodoroLogs*.  | Saat Task dihapus, record PomodoroLogs tetap tersimpan dengan nilai taskId menjadi NULL. |
| **STP-DB-03** | Validasi Integritas FK | Melakukan *insert* data baru ke tabel *PomodoroLogs* dengan nilai `userId` kosong atau tidak valid.  | Sistem memastikan tidak ada PomodoroLog yang masuk tanpa userId yang valid. |
| **STP-DB-04** | Efisiensi Akses Data | Mengeksekusi *query* penarikan riwayat *Pomodoro* berdasarkan `userId` dan `taskId` pada *database* bervolume tinggi.  | Waktu respon *query* untuk menarik riwayat Pomodoro berdasarkan User atau Task berada dalam ambang batas efisiensi yang ditentukan. |
