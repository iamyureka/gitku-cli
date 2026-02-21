module.exports = function help() {
  console.log(`
🚀 gitku — Git yang Ramah Pemula

DASAR:
  gitku mulai                    git init (+ set branch ke main)
  gitku ambil <url>              git clone
  gitku cek                      git status
  gitku tandai semua             git add .
  gitku tandai <file>            git add <file>
  gitku simpan "pesan"           git commit -m
  gitku kirim                    git push (auto tanya URL kalau belum ada)
  gitku kirim --paksa            git push --force
  gitku tarik                    git pull
  gitku tarik --izinkan-beda     git pull --allow-unrelated-histories

BRANCH:
  gitku cabang                   git branch (lihat semua)
  gitku cabang baru <nama>       git checkout -b
  gitku cabang hapus <nama>      git branch -d
  gitku pindah <nama>            git checkout
  gitku gabung <nama>            git merge

REMOTE:
  gitku remote                   lihat remote yang terdaftar
  gitku remote ganti <url>       ganti URL origin

LAINNYA:
  gitku riwayat                  git log --oneline --graph
  gitku reset                    buang semua perubahan (git restore .)
  gitku simpan-sementara         git stash
  gitku ambil-sementara          git stash pop
  gitku tolong                   tampilkan bantuan ini
`);
};