async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/media/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173' })
    });
    const d = await res.json();
    console.log('TIKTOK VERIFIED REAL TITLE:', d.data.title);
    console.log('TIKTOK VERIFIED REAL AUTHOR:', d.data.author);
  } catch(e) { console.error(e); }
}
run();
