const { run } = require('./commands/commands');
const help = require('./help');

async function main(args) {
  if (args.length === 0 || args[0] === 'help' || args[0] === 'help') {
    help();
    return;
  }

  const [command, ...rest] = args;
  const handler = run[command];

  if (!handler) {
    console.error(`\n❌ Command "${command}" tidak dikenal.`);
    console.error('   Ketik "gitku help" untuk lihat daftar command.\n');
    return;
  }

  try {
    await handler(rest);
  } catch (err) {
    handleError(err);
  }
}

function handleError(err) {
  const msg = err.stderr || err.message || String(err);

  const errors = [
    { match: /not a git repository/i,        pesan: 'Folder ini belum pakai git.\n   Coba: gitku mulai' },
    { match: /nothing to commit/i,            pesan: 'Tidak ada perubahan. Semua sudah up to date!' },
    { match: /nothing added to commit/i,      pesan: 'Belum ada file yang ditandai.\n   Coba: gitku tandai semua' },
    { match: /unrelated histories/i,          pesan: 'Repo punya riwayat berbeda.\n   Coba: gitku tarik --izinkan-beda' },
    { match: /rejected.*failed to push/i,     pesan: 'Gagal kirim. Ada update baru.\n   Coba: gitku tarik dulu, lalu kirim lagi.' },
    { match: /CONFLICT/i,                     pesan: 'Ada konflik file. Selesaikan manual, lalu:\n   gitku tandai semua → gitku simpan "resolve konflik"' },
  ];

  for (const { match, pesan } of errors) {
    if (match.test(msg)) {
      console.error(`\n⚠️  ${pesan}\n`);
      return;
    }
  }

  console.error('\n❌ Terjadi kesalahan:');
  console.error(msg);
}

module.exports = { main };