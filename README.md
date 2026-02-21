# 🚀 gitku

>Kenapa harus ribet kalau bisa simpel? gitku nge-refactor command Git yang keras dan bikin stress jadi bahasa manusiawi yang sat-set-sat-set.

```bash
# Daripada nulis ini 😵
git add . && git commit -m "fix bug" && git push origin main

# Cukup tulis ini ✨
gitku tandai semua
gitku simpan "fix bug"
gitku kirim
```

---

## Install

```bash
npm install -g gitku
```

Atau clone manual:

```bash
git clone https://github.com/USERNAME/gitku.git
cd gitku
npm link
```

> Tidak perlu `npm install` — gitku tidak punya dependency apapun. Murni Node.js built-in.

---

## Command

### Dasar

| gitku | git aslinya | keterangan |
|-------|------------|------------|
| `gitku mulai` | `git init` | Mulai pakai git di folder ini |
| `gitku ambil <url>` | `git clone <url>` | Download repo dari GitHub |
| `gitku cek` | `git status` | Lihat file apa yang berubah |
| `gitku tandai semua` | `git add .` | Tandai semua file |
| `gitku tandai <file>` | `git add <file>` | Tandai file tertentu |
| `gitku simpan "pesan"` | `git commit -m "pesan"` | Simpan perubahan |
| `gitku kirim` | `git push` | Kirim ke GitHub |
| `gitku tarik` | `git pull` | Ambil update terbaru |

### Branch / Cabang

| gitku | git aslinya | keterangan |
|-------|------------|------------|
| `gitku cabang` | `git branch` | Lihat semua cabang |
| `gitku cabang baru <nama>` | `git checkout -b <nama>` | Buat cabang baru |
| `gitku pindah <nama>` | `git checkout <nama>` | Pindah ke cabang lain |
| `gitku gabung <nama>` | `git merge <nama>` | Gabung cabang ke sini |

### Lainnya

| gitku | git aslinya | keterangan |
|-------|------------|------------|
| `gitku riwayat` | `git log --oneline --graph` | Lihat riwayat commit |
| `gitku simpan-sementara` | `git stash` | Sembunyikan perubahan sementara |
| `gitku ambil-sementara` | `git stash pop` | Kembalikan yang disembunyikan |
| `gitku help` | — | Tampilkan bantuan |

---

## Fitur

- ⚡ **Zero dependency** — tidak perlu `npm install`, langsung jalan
- 🗣️ **Pesan error yang manusiawi** — error git yang bikin bingung diterjemahkan jadi bahasa yang mudah dimengerti
- 💬 **Mode interaktif** — kalau lupa nulis pesan commit, langsung ditanya
- 💡 **Tips otomatis** — setiap selesai action, dikasih saran langkah selanjutnya
- 🚀 **Fast** — startup cepat karena tidak ada dependency yang di-load

### Contoh pesan error

```bash
# Git biasa 😵
fatal: not a git repository (or any of the parent directories): .git

# gitku ✅
⚠️  Folder ini belum pakai git.
    Coba: gitku mulai
```

---

## Workflow Pertama Kali

```bash
# 1. Buat folder project
mkdir project-ku && cd project-ku

# 2. Mulai git
gitku mulai

# 3. Buat file, coding, dll...

# 4. Tandai semua file
gitku tandai semua

# 5. Simpan dengan pesan
gitku simpan "commit pertama"

# 6. Kirim ke GitHub
gitku kirim
```

---

## Lisensi


MIT
