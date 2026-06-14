const input = document.getElementById("artistaInput");
const boton = document.getElementById("buscarBtn");
const contenedor = document.getElementById("noticias");

boton.addEventListener("click", buscar);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") buscar();
});

function buscar() {
  const artista = input.value.trim();

  if (!artista) {
    contenedor.innerHTML = "<p>Por favor, escribe el nombre de un artista.</p>";
    return;
  }

  contenedor.innerHTML = "<p>Buscando últimos lanzamientos y novedades...</p>";

  // API Oficial de Apple Music/iTunes: Libre, sin claves, rápida y con CERO bloqueos de CORS
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artista)}&entity=album&limit=10&country=CO`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Error al conectar con la base de datos musical.");
      return res.json();
    })
    .then(data => {
      contenedor.innerHTML = "";

      const albumes = data.results;

      if (!albumes || albumes.length === 0) {
        contenedor.innerHTML = `<p>No se encontró información ni música reciente de <b>${artista}</b>.</p>`;
        return;
      }

      // Tomamos el nombre oficial del artista desde el primer resultado real
      const nombreArtistaOficial = albumes[0].artistName;

      let htmlNoticias = `
        <div style="background: #111; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <span style="background: #fc3c44; color: white; padding: 3px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; display: inline-block; margin-bottom: 5px;">NOVEDADES EN TIEMPO REAL</span>
          <h2 style="margin: 5px 0 0 0;">${nombreArtistaOficial}</h2>
          <p style="margin: 5px 0 0 0; color: #aaa; font-size: 14px;">Últimos trabajos discográficos y lanzamientos globales.</p>
        </div>
        <h3 style="margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Últimos Lanzamientos:</h3>
      `;

      // Recorremos los álbumes o sencillos más recientes
      albumes.forEach(album => {
        const tituloAlbum = album.collectionName;
        const imagenUrl = album.artworkUrl100.replace("100x100bb", "300x300bb"); // Mejoramos la calidad de la foto
        const linkApple = album.collectionViewUrl;
        const precio = album.collectionPrice ? `${album.collectionPrice} ${album.currency}` : "Disponible";
        
        // Formatear la fecha de lanzamiento
        const fechaOriginal = new Date(album.releaseDate);
        const fechaFormateada = fechaOriginal.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

        htmlNoticias += `
          <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; background: #fff; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <img src="${imagenUrl}" alt="${tituloAlbum}" style="width: 80px; height: 80px; border-radius: 6px; object-fit: cover;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 5px 0; color: #222; font-size: 16px;">${tituloAlbum}</h4>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">📅 Lanzamiento: ${fechaFormateada}</p>
              <a href="${linkApple}" target="_blank" rel="noopener noreferrer" style="color: #fc3c44; font-size: 13px; text-decoration: none; font-weight: bold;">Escuchar / Ver detalles →</a>
            </div>
          </div>
        `;
      });

      contenedor.innerHTML = htmlNoticias;
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = "<p style='color: red; font-weight: bold;'>Error crítico al cargar la información. Revisa tu conexión a internet.</p>";
    });
}