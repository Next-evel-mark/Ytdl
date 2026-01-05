// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err) {
      alert("Error searching");
    }
    setLoading(false);
  };

  const handleDownload = (url) => {
    // Redirect browser to the download API
    window.location.href = `/api/download?url=${encodeURIComponent(url)}`;
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>NEXT LEVEL MARK</title>
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>NEXT LEVEL MARK</h1>
        <p style={styles.subtitle}>Downloader</p>

        <form onSubmit={handleSearch} style={styles.form}>
          <input
            type="text"
            placeholder="Search for a song..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div style={styles.grid}>
          {results.map((video, index) => (
            <div key={index} style={styles.card}>
              <img src={video.thumbnail} alt={video.title} style={styles.image} />
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{video.title}</h3>
                <p>{video.author} • {video.duration}</p>
                <button 
                  onClick={() => handleDownload(video.url)}
                  style={styles.downloadBtn}
                >
                  Download MP3
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', padding: '0 0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif' },
  main: { padding: '5rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '800px' },
  title: { margin: 0, lineHeight: 1.15, fontSize: '4rem', textAlign: 'center', color: '#0070f3' },
  subtitle: { fontSize: '1.5rem', marginBottom: '2rem' },
  form: { display: 'flex', width: '100%', marginBottom: '2rem' },
  input: { flex: 1, padding: '15px', fontSize: '1.2rem', borderRadius: '5px 0 0 5px', border: 'none' },
  button: { padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' },
  grid: { display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' },
  card: { display: 'flex', border: '1px solid #333', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1e1e1e' },
  image: { width: '160px', objectFit: 'cover' },
  cardContent: { padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 },
  cardTitle: { margin: '0 0 10px 0', fontSize: '1.2rem' },
  downloadBtn: { marginTop: '10px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', maxWidth: '150px' },
};
