const flixApp = {}
flixApp.key = 'acf63cd8f0f564cb943004e66b74e67a';
flixApp.baseUrl = 'https://api.themoviedb.org/3';
flixApp.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Carousel Function
function bannerSwitcher() {
    next = $('.carousel').filter(':checked').next('.carousel');
    if (next.length) next.prop('checked', true);
    else $('.carousel').first().prop('checked', true);
}

let bannerTimer = setInterval(bannerSwitcher, 5000);

$('nav .controls label').click(function () {
    clearInterval(bannerTimer);
    bannerTimer = setInterval(bannerSwitcher, 5000)
});


// Call to get the Top Rated Movies to display in the carousel
flixApp.moviesHero = function () {
    $.ajax({
        url: `${flixApp.baseUrl}/movie/now_playing`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: flixApp.key,
        }
    }).then(function (nowPlayingData) {
        console.log(nowPlayingData.results)
        flixApp.displayNowPlayingMovies(nowPlayingData.results);
    }).fail(function (error) {
        alert('The movie could not be found')
    });
}

// To display Now Playing Movies on the carousel
flixApp.displayNowPlayingMovies = function (playingMovies) {
    playingMovies.forEach(playingMovie => {
        const playingMovieDisplay = `
            <div class="movieBanner"> 
                <div class="bannerInfo">
                    <h3>${playingMovie.title}</h3>
                    <h4>${playingMovie.release_date}</h4>
                    <p>${playingMovie.overview}</p>
                </div>
                <div class="bannerBackdrop">
                    <img class="backdrop" src="${flixApp.imageBaseUrl}/${playingMovie.poster_path}"/>
                </div>
            </div>
        `;
        $('.bannerContainer').append(playingMovieDisplay);
    });
}

// To display Popular Movies on the page
flixApp.displayPopularMovies = function(details) {
    details.forEach(movie => {
        const movieDisplay = `
            <div class="movieDetails"> 
                <div class="moviePoster">
                    <img class="poster" src="${flixApp.imageBaseUrl}/${movie.poster_path}"/>
                    <div class="movieInfo">
                        <h3>${movie.title}</h3>
                        <h4>${movie.release_date}</h4>
                        <p>${movie.overview}</p>
                    </div>
                </div>
            </div>
        `;
        $('.results').append(movieDisplay);

        $('.movieInfo').hide();

        $('.poster').on('click', function() {
            $('.movieInfo').stop().slideUp('slow');
            $(this).next(".movieInfo").stop().slideToggle('slow');

            if (display === true) {
                $('.movieInfo').show();
            } else if (display === false) {
                $('.movieInfo').hide();
            }
        });
    });
}

    // < a href = "https://www.youtube.com/watch?v=${movie.results[0].id}" > Trailer</a >

// Call to get the data from API about the Popular Movies
flixApp.popularMovies = function() {
    $.ajax({
        url: `${flixApp.baseUrl}/movie/popular`,
        method:'GET',
        dataType: 'json',
        data: {
           api_key: flixApp.key
        }
    }).then(function(popularData) {
        // console.log(popularData.results)
        flixApp.displayPopularMovies(popularData.results)
    }).fail(function(error) {
        alert('The movie could not be found')
    });
}

// Call to get the video ID to play on YouTube
// flixApp.movieVideos = function () {
//     $.ajax({
//         url: `${flixApp.baseUrl}/movie/533ec654c3a36854480003eb/videos`,
//         method: 'GET',
//         dataType: 'json',
//         data: {
//             api_key: flixApp.key
//         }
//     }).then(function (videoData) {
//         console.log(videoData.results[0].id)
//         // flixApp.displayMovieVideos(videoData.results[0].id)
//     }).fail(function (error) {
//         alert('The movie could not be found')
//     });
// }

flixApp.init = function() {
    flixApp.popularMovies();
    // flixApp.movieVideos();
    flixApp.moviesHero();
}

$(function() {
    flixApp.init();
})