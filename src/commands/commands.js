const { spawnSync } = require('child_process');
const readline = require('readline');

// Jalankan git, output langsung ke terminal
function git(...args) {
  const result = spawnSync('git', args.flat(), { stdio: 'inherit' });
  if (result.status !== 0) {
    const err = new Error();
    err.stderr = result.stderr ? result.stderr.toString() : '';
    throw err;
  }
}

// Jalankan git, ambil output sebagai string
function gitOut(...args) {
  const result = spawnSync('git', args.flat());
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}

// Tanya user input
function tanya(pertanyaan) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(pertanyaan, answer => { rl.close(); resolve(answer.trim()); });
  });
}

const run = {

  async mulai() {
    console.log('\n🚀 Memulai git di folder ini...\n');
    git('init');
    console.log('\n✅ Berhasil! Folder ini sekarang pakai git.');
    console.log('   Selanjutnya: gitku tandai semua → gitku simpan "pertama"\n');
  },

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

  async cek() {
    console.log('\n🔍 Status perubahan:\n');
    git('status');
  },

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

  async simpan([pesan]) {
    if (!pesan) {
      pesan = await tanya('💬 Pesan simpanan kamu: ');
      if (!pesan) { console.error('❌ Pesan tidak boleh kosong.\n'); return; }
    }
    console.log('\n💾 Menyimpan perubahan...\n');
    git('commit', '-m', pesan);
    console.log('\n✅ Tersimpan!');
    console.log('   Mau kirim ke GitHub? Ketik: gitku kirim\n');
  },

  async kirim(args) {
    console.log('\n📤 Mengirim ke remote...\n');

    let branch = 'main';
    try { branch = gitOut('branch', '--show-current'); } catch (_) {}

    const remote = args.includes('--remote') ? args[args.indexOf('--remote') + 1] : 'origin';

    // Cek apakah remote sudah ada
    const remoteList = spawnSync('git', ['remote']).stdout.toString().trim();
    if (!remoteList.includes(remote)) {
      console.log(`⚠️  Remote "${remote}" belum diatur.`);
      const url = await tanya('🔗 Masukkan URL repo GitHub kamu: ');
      if (!url) { console.error('❌ URL tidak boleh kosong.\n'); return; }
      git('remote', 'add', remote, url);
      console.log(`✅ Remote ditambahkan!\n`);
    }

    git('push', '-u', remote, branch);
    console.log(`\n✅ Terkirim ke ${remote}/${branch}!\n`);
  },

  async tarik(args) {
    console.log('\n📥 Mengambil update terbaru...\n');
    const extra = args.includes('--izinkan-beda') ? ['--allow-unrelated-histories'] : [];
    git('pull', ...extra);
    console.log('\n✅ Berhasil diperbarui!\n');
  },

  async cabang([sub, nama]) {
    if (sub === 'baru') {
      if (!nama) { console.error('\n❌ Kasih nama cabangnya.\n   Contoh: gitku cabang baru fitur-login\n'); return; }
      console.log(`\n🌿 Membuat cabang "${nama}"...\n`);
      git('checkout', '-b', nama);
      console.log(`\n✅ Cabang "${nama}" dibuat!\n`);
    } else {
      console.log('\n🌿 Daftar cabang:\n');
      git('branch');
      console.log('');
    }
  },

  async pindah([nama]) {
    if (!nama) { console.error('\n❌ Kasih nama cabang tujuannya.\n   Contoh: gitku pindah main\n'); return; }
    console.log(`\n🔀 Pindah ke "${nama}"...\n`);
    git('checkout', nama);
    console.log(`\n✅ Sekarang di cabang "${nama}"!\n`);
  },

  async gabung([nama]) {
    if (!nama) { console.error('\n❌ Kasih nama cabang yang mau digabung.\n   Contoh: gitku gabung fitur-login\n'); return; }
    console.log(`\n🔀 Menggabung cabang "${nama}"...\n`);
    git('merge', nama);
    console.log(`\n✅ Cabang "${nama}" berhasil digabung!\n`);
  },

  async riwayat() {
    console.log('\n📜 Riwayat commit:\n');
    git('log', '--oneline', '--graph', '--decorate', '-20');
    console.log('');
  },

  async 'simpan-sementara'() {
    console.log('\n🗂  Menyembunyikan perubahan...\n');
    git('stash');
    console.log('✅ Disembunyikan! Kembalikan dengan: gitku ambil-sementara\n');
  },

  async 'ambil-sementara'() {
    console.log('\n🗂  Mengembalikan perubahan...\n');
    git('stash', 'pop');
    console.log('✅ Perubahan dikembalikan!\n');
  },

};

module.exports = { run };