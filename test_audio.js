const key = '1e87f0aee0mshf5e2257f259705ap17c1e3jsn8307f4e97006';
const host = 'youtube-video-fast-downloader-24-7.p.rapidapi.com';
async function test() {
  const r = await fetch('https://' + host + '/download_audio/dQw4w9WgXcQ?quality=Unknown', {
    headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': host }
  });
  console.log('Audio status:', r.status);
  console.log('Audio body:', await r.text());
}
test();
