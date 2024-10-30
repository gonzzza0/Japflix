let moviesData = [];

// Función para cargar las películas
const loadMovies = async () => {
    try {
        const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        moviesData = await response.json();
        console.log(moviesData); // Verificar datos cargados
    } catch (error) {
        console.error('Error al cargar los datos de las películas:', error);
    }
};

// Función para mostrar resultados de búsqueda
const displayResults = (results) => {
    const listaContainer = document.getElementById('lista');
    listaContainer.innerHTML = ''; // Limpiar la lista anterior

    results.forEach(movie => {
        const stars = '⭐'.repeat(Math.round(movie.vote_average / 2)) + '⭐'.repeat(5 - Math.round(movie.vote_average / 2));
        const movieItem = document.createElement('li');
        movieItem.className = 'list-group-item bg-dark text-light';
        movieItem.innerHTML = `
            <h5>${movie.title}</h5>
            <p>${movie.tagline}</p>
            <p>${stars}</p>
        `;
        movieItem.onclick = () => showMovieDetails(movie);
        listaContainer.appendChild(movieItem);
    });
};

// Función para mostrar detalles de la película
const showMovieDetails = (movie) => {
    // Actualizar el título del modal
    document.getElementById('movieModalLabel').innerText = movie.title;

    // Actualizar el contenido del cuerpo del modal
    const details = `
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p><strong>Géneros:</strong> ${movie.genres.join(', ')}</p>
        <p><strong>Año de lanzamiento:</strong> ${new Date(movie.release_date).getFullYear()}</p>
        <p><strong>Duración:</strong> ${movie.runtime} minutos</p>
        <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</p>
        <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</p>
    `;
    document.getElementById('movieModalBody').innerHTML = details;

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
};

// Evento de búsqueda
document.getElementById('btnBuscar').addEventListener('click', () => {
    const searchTerm = document.getElementById('inputBuscar').value.toLowerCase();
    console.log(searchTerm); // Verificar el término de búsqueda

    // Comprobar que los datos han sido cargados
    if (moviesData.length === 0) {
        console.error("No se han cargado las películas aún.");
        return; // Salir si no hay datos
    }

    const filteredMovies = moviesData.filter(movie => 
        (movie.title && movie.title.toLowerCase().includes(searchTerm)) ||
        (Array.isArray(movie.genres) && movie.genres.some(genre => 
            typeof genre === 'string' && genre.toLowerCase().includes(searchTerm)
        )) ||
        (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) ||
        (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
    );

    console.log(filteredMovies); // Verificar los resultados filtrados
    displayResults(filteredMovies);
});

// Cargar las películas al iniciar
loadMovies();
