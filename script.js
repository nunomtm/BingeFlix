const flixApp = {}
flixApp.key = 'acf63cd8f0f564cb943004e66b74e67a';
flixApp.baseUrl = 'https://api.themoviedb.org/3';
flixApp.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
flixApp.youTubeBaseUrl = 'https://www.youtube.com/embed'

flixApp.movieID;
flixApp.movieTrailer;

// Carousel Function
jQuery(function($) {
    let $slider = $('.slider');
    let $slide = '.movieBanner';
    let $transitionTime = 1000;
    let $timeBetweenSlides = 8780;

    function slides() {
        return $slider.find($slide);
    }

    slides().fadeOut();

    // set active classes
    slides().first().addClass('active');
    slides().first().fadeIn($transitionTime);

    // auto scroll 
    $interval = setInterval(
        function() {
            let $i = $slider.find($slide + '.active').index();

            slides().eq($i).removeClass('active');
            slides().eq($i).fadeOut($transitionTime);

            if (slides().length == $i + 1) $i = -1;

            slides().eq($i + 1).fadeIn($transitionTime);
            slides().eq($i + 1).addClass('active');
        }, 
        $timeBetweenSlides + $transitionTime
    );

    // Carousel Controls Function
    function controlSwitcher() {
        next = $('.carousel').filter(':checked').next('.carousel');
        if (next.length) next.prop('checked', true);
        else $('.carousel').first().prop('checked', true);
    }
    
    let bannerTimer = setInterval(controlSwitcher, 10000);
    
    $('nav .controls label').click(function() {
        clearInterval(bannerTimer);
        bannerTimer = setInterval(bannerSwitcher, 10000)
    });
});

// Call to get the Top Rated Movies to display in the carousel
flixApp.moviesHero = function() {
    $.ajax({
        url: `${flixApp.baseUrl}/movie/now_playing`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: flixApp.key,
        }
    }).then(function (nowPlayingData) {
        // console.log(nowPlayingData.results)
        flixApp.nowPlaying = nowPlayingData.results.slice(0, 5);
        flixApp.nowPlaying.forEach(playingMovie => {
            const playingMovieDisplay = `
                <div class="movieBanner"> 
                    <div class="bannerInfo">
                        <div class="bannerDetails">
                            <h3>${playingMovie.title}</h3>
                            <p>⭐️ ${playingMovie.vote_average}</p>
                        </div>
                        <h4>${playingMovie.release_date}</h4>
                        <p>${playingMovie.overview}</p>
                    </div>
                    <div class="bannerBackdrop">
                        <img class="backdrop" src="${flixApp.imageBaseUrl}/${playingMovie.poster_path}"/>
                    </div>
                </div>
            `;
            $('.slider').append(playingMovieDisplay);
        });
    }).fail(function (error) {
        alert('The movie could not be found')
    });
}

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
        flixApp.popular = popularData.results;
        flixApp.popular.forEach(movie => {
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

            $('.poster').on('click', function () {
                $('.movieInfo').stop().slideUp('slow');
                $(this).next(".movieInfo").stop().slideToggle('slow');
                flixApp.movieID = `${movie.id}`
                flixApp.movieVideos(flixApp.movieID);

                if (display === true) {
                    $('.movieInfo').show();
                } else if (display === false) {
                    $('.movieInfo').hide();
                }
            });
        });
    }).fail(function(error) {
        alert('The movie could not be found')
    });
}

// Call to get the video ID to play on YouTube
flixApp.movieVideos = function() {
    $.ajax({
        url: `${flixApp.baseUrl}/movie/${flixApp.movieID}/videos`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: flixApp.key
        }
    }).then(function(videoData) {
        // console.log(videoData.results[0].key);
        flixApp.movieTrailer = videoData.results[0].key;
       
        $('.movieInfo').append(`<a href="${flixApp.youTubeBaseUrl}/${flixApp.movieTrailer}" class="btn"> Trailer <i class="fas fa-play"></i></a>`);

    }).fail(function (error) {
        alert('We have a problem!')
    });
}

flixApp.init = function() {
    flixApp.moviesHero();
    flixApp.popularMovies();
}

$(function() {
    flixApp.init();
})