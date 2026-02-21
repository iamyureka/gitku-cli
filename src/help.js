module.exports = function help() {
  console.log(`
🚀 gitku — Git yang Ramah Pemula

DASAR:
  gitku mulai                  git init
  gitku ambil <url>            git clone
  gitku cek                    git status
  gitku tandai semua           git add .
  gitku tandai <file>          git add <file>
  gitku simpan "pesan"         git commit -m
  gitku kirim                  git push
  gitku tarik                  git pull

BRANCH:
  gitku cabang                 git branch
  gitku cabang baru <nama>     git checkout -b
  gitku pindah <nama>          git checkout
  gitku gabung <nama>          git merge

LAINNYA:
  gitku riwayat                git log
  gitku simpan-sementara       git stash
  gitku ambil-sementara        git stash pop
  gitku tolong                 tampilkan bantuan ini
`);
};