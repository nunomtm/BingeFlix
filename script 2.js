const movieApp = {};
    movieApp.key = 'acf63cd8f0f564cb943004e66b74e67a';
    movieApp.baseUrl = 'https://api.themoviedb.org/3';
    movieApp.imageBaseUrl = 'https://image.tmdb.org/t/p/w500'

    // Add html to be inserted on the page for the search query //
    movieApp.displayMovie = function(details) {
        details.forEach(movie => {
            const movieHtml = `
                <div class="movie-details">
                    <div class="movie-poster">
                        <img src="${movieApp.imageBaseUrl}/${movie.poster_path}"/>
                    </div>
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <h4>Released date:</h4> 
                        <p>${movie.release_date}</p>
                        <h4>Overview:</h4>
                        <p>${movie.overview}</p>
                    </div>
                </div>
            `;
            $(".results").append(movieHtml);
            console.log(movie);
        })
    };

    // Add html to be inserted on the page for the playing now movies //
    movieApp.displayMoviesPlaying = function(movies) {
        movies.forEach(movie => {
            const moviePlayingHtml = `
                <div class="moviesPlaying">
                    <img src="${movieApp.imageBaseUrl}/${movie.poster_path}"/>
                    <p>${movie.title}<p>
                </div>
            `;
            $(".nowPlaying").append(moviePlayingHtml);
        })
    };

    // The scroll down arrow function here // 
    $(document).ready(function() {
        const y = $(window).scrollTop();
        $('.fa-level-down-alt').click(function(){
            $('html, body').animate({scrollTop: y + 720}) 
        });
    });

    // API call for the Now Playing Movies //
    movieApp.nowPlaying = function() {
        $.ajax ({
            url: `${movieApp.baseUrl}/movie/now_playing`,
            method: 'GET',
            dataType: 'json',
            data: {
                api_key: movieApp.key
            }
        }).then(function(playingData){
            movieApp.displayMoviesPlaying(playingData.results);
        }).fail(function(error) {
            console.log(error);
        });
    }

    // The API call for the actor query search // 
    movieApp.getMovie = function(queryParam) {
        $.ajax({
            url: `${movieApp.baseUrl}/search/person`,
            method: 'GET',
            dataType: 'json',
            data: {
                api_key: movieApp.key,
                query: queryParam
            }
        }).then(function(movieData){
            let knownFor = movieData.results[0].known_for.map((item) => {
                return item;
            });
            movieApp.displayMovie(movieData.results[0].known_for);
        }).fail(function(error) {
            console.log(error);
        })
    };

    movieApp.init = function() {
        $('form').on('submit', function(event){
            event.preventDefault();
            const searchTerm = $('input').val();
            if (searchTerm !== '') {
                $('.results').empty();
                movieApp.getMovie(searchTerm);
            };
        });
        movieApp.nowPlaying();
    };

    $(function() {
        movieApp.init();
    });