const { spawnSync } = require('child_process');
const readline = require('readline');

function git(...args) {
  const result = spawnSync('git', args.flat(), { stdio: ['inherit', 'pipe', 'pipe'] });
  const stdout = result.stdout ? result.stdout.toString() : '';
  const stderr = result.stderr ? result.stderr.toString() : '';

  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);

  if (result.status !== 0) {
    const err = new Error();
    err.stderr = stderr + stdout;
    throw err;
  }

  return stdout;
}

function gitOut(...args) {
  const result = spawnSync('git', args.flat());
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}

function tanya(pertanyaan) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(pertanyaan, answer => { rl.close(); resolve(answer.trim()); });
  });
}

async function tanyaYN(pertanyaan) {
  const jawab = await tanya(`${pertanyaan} (y/n): `);
  return jawab.toLowerCase() === 'y';
}

function branchAktif() {
  try { return gitOut('branch', '--show-current') || 'main'; } catch (_) { return 'main'; }
}

function remoteAda(nama) {
  return spawnSync('git', ['remote']).stdout.toString().trim().split('\n').includes(nama);
}

const run = {

  // git init
  async mulai() {
    console.log('\n🚀 Memulai git di folder ini...\n');
    git('init');
    try { git('checkout', '-b', 'main'); } catch (_) {}
    console.log('\n✅ Berhasil! Folder ini sekarang pakai git.');
    console.log('   Selanjutnya: gitku tandai semua → gitku simpan "pertama"\n');
  },

  // git clone
  async ambil([url, ...rest]) {
    if (!url) {
      console.error('\n❌ Kasih URL repo-nya ya.');
      console.error('   Contoh: gitku ambil https://github.com/user/repo\n');
      return;
    }
    console.log(`\n📥 Mengunduh repo dari ${url}...\n`);
    git('clone', url, ...rest);
    console.log('\n✅ Berhasil diunduh!\n');
  },

  // git status
  async cek() {
    console.log('\n🔍 Status perubahan:\n');
    git('status');
  },

  // git add
  async tandai([target, ...rest]) {
    if (!target || target === 'semua') {
      console.log('\n📌 Menandai semua file...\n');
      git('add', '.');
      console.log('✅ Semua file sudah ditandai!');
      console.log('   Selanjutnya: gitku simpan "pesan kamu"\n');
    } else {
      console.log(`\n📌 Menandai: ${target}\n`);
      git('add', target, ...rest);
      console.log(`✅ File "${target}" sudah ditandai!\n`);
    }
  },

  // git commit
  async simpan([pesan]) {
    if (!pesan) {
      pesan = await tanya('💬 Pesan simpanan kamu: ');
      if (!pesan) { console.error('❌ Pesan tidak boleh kosong.\n'); return; }
    }
    console.log('\n💾 Menyimpan perubahan...\n');
    const out = git('commit', '-m', pesan);
    if (/nothing to commit|nothing added/i.test(out)) {
      console.log('\n⚠️  Tidak ada yang perlu disimpan. Semua sudah up to date!\n');
      return;
    }
    console.log('\n✅ Tersimpan!');
    console.log('   Mau kirim ke GitHub? Ketik: gitku kirim\n');
  },

  // git push
  async kirim(args) {
    console.log('\n📤 Mengirim ke remote...\n');

    const paksa = args.includes('--paksa');
    const remote = args.includes('--remote') ? args[args.indexOf('--remote') + 1] : 'origin';
    let branch = branchAktif();

    if (branch === 'master') {
      const mauMain = await tanyaYN('⚠️  Branch kamu "master". Mau diganti ke "main"?');
      if (mauMain) {
        git('branch', '-m', 'master', 'main');
        branch = 'main';
        console.log('✅ Branch diganti ke "main"\n');
      }
    }

    if (!remoteAda(remote)) {
      console.log(`⚠️  Remote "${remote}" belum diatur.`);
      const url = await tanya('🔗 Masukkan URL repo GitHub kamu: ');
      if (!url) { console.error('❌ URL tidak boleh kosong.\n'); return; }
      git('remote', 'add', remote, url);
      console.log('✅ Remote ditambahkan!\n');
    }

    const pushArgs = ['push', '-u', remote, branch];
    if (paksa) {
      console.log('⚠️  Mode paksa aktif — override remote...\n');
      pushArgs.push('--force');
    }

    git(...pushArgs);
    console.log(`\n✅ Terkirim ke ${remote}/${branch}!\n`);
  },

  // git pull
  async tarik(args) {
    console.log('\n📥 Mengambil update terbaru...\n');
    const extra = args.includes('--izinkan-beda') ? ['--allow-unrelated-histories'] : [];
    git('pull', ...extra);
    console.log('\n✅ Berhasil diperbarui!\n');
  },

  // git branch
  async cabang([sub, nama]) {
    if (sub === 'baru') {
      if (!nama) { console.error('\n❌ Kasih nama cabangnya.\n   Contoh: gitku cabang baru fitur-login\n'); return; }
      console.log(`\n🌿 Membuat cabang "${nama}"...\n`);
      git('checkout', '-b', nama);
      console.log(`\n✅ Cabang "${nama}" dibuat!\n`);
    } else if (sub === 'hapus') {
      if (!nama) { console.error('\n❌ Kasih nama cabang yang mau dihapus.\n   Contoh: gitku cabang hapus fitur-login\n'); return; }
      const yakin = await tanyaYN(`⚠️  Yakin mau hapus cabang "${nama}"?`);
      if (!yakin) { console.log('Dibatalkan.\n'); return; }
      git('branch', '-d', nama);
      console.log(`\n✅ Cabang "${nama}" dihapus!\n`);
    } else {
      console.log('\n🌿 Daftar cabang:\n');
      git('branch');
      console.log('');
    }
  },

  // git checkout
  async pindah([nama]) {
    if (!nama) { console.error('\n❌ Kasih nama cabang tujuannya.\n   Contoh: gitku pindah main\n'); return; }
    console.log(`\n🔀 Pindah ke "${nama}"...\n`);
    git('checkout', nama);
    console.log(`\n✅ Sekarang di cabang "${nama}"!\n`);
  },

  // git merge
  async gabung([nama]) {
    if (!nama) { console.error('\n❌ Kasih nama cabang yang mau digabung.\n   Contoh: gitku gabung fitur-login\n'); return; }
    console.log(`\n🔀 Menggabung cabang "${nama}"...\n`);
    git('merge', nama);
    console.log(`\n✅ Cabang "${nama}" berhasil digabung!\n`);
  },

  // git log
  async riwayat() {
    console.log('\n📜 Riwayat commit:\n');
    git('log', '--oneline', '--graph', '--decorate', '-20');
    console.log('');
  },

  // git restore .
  async reset() {
    const yakin = await tanyaYN('⚠️  Ini akan MENGHAPUS semua perubahan yang belum disimpan. Yakin?');
    if (!yakin) { console.log('Dibatalkan.\n'); return; }
    git('restore', '.');
    console.log('\n✅ Perubahan dibuang. Folder kembali ke commit terakhir.\n');
  },

  // git remote
  async remote([sub, url]) {
    if (sub === 'ganti') {
      if (!url) { console.error('\n❌ Kasih URL barunya.\n   Contoh: gitku remote ganti https://github.com/user/repo\n'); return; }
      git('remote', 'set-url', 'origin', url);
      console.log(`\n✅ Remote origin diganti ke:\n   ${url}\n`);
    } else {
      console.log('\n🔗 Remote yang terdaftar:\n');
      git('remote', '-v');
      console.log('');
    }
  },

  async 'simpan-sementara'() {
    console.log('\n🗂  Menyembunyikan perubahan...\n');
    git('stash');
    console.log('✅ Disembunyikan! Kembalikan dengan: gitku ambil-sementara\n');
  },

  // git stash pop
  async 'ambil-sementara'() {
    console.log('\n🗂  Mengembalikan perubahan...\n');
    git('stash', 'pop');
    console.log('✅ Perubahan dikembalikan!\n');
  },

};

module.exports = { run };