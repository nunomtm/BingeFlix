const flixApp = {}

flixApp.key = 'acf63cd8f0f564cb943004e66b74e67a';
flixApp.baseUrl = 'https://api.themoviedb.org/3';
flixApp.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
flixApp.youTubeBaseUrl = 'https://www.youtube-nocookie.com/embed'

// Global variables
flixApp.movieID;
flixApp.movieTrailer = '';
flixApp.date;
flixApp.fav = [];

// Transition between nav tabs
// $('.tabContent').hide();
// $('.tabContent:nth-child(1)').show();

// $('ul li').on('click', function() {
//     // $('ul li').removeClass('active');
//     // $(this).addClass('active');

//     let currentTabValue = $(this).attr('data-list');
//     $('.' + currentTabValue).show();
// })


// Search bar function styles
const searchBtn = $('#searchBtn');
const icon = $('.fa-search');
const iconClose = $('.fa-times');
const search = $('#searchTxt');

searchBtn.on('click', function() {
    search.css({width: '250px'});
    search.css({paddingLeft: '15px'});
    search.css({cursor: 'text'});
    icon.css({left: '10px'});
    iconClose.css({display: 'block'});
    search.focus();
    typeWriter();
});

let i = 0;
let message = `Search what you're looking for`;
let speed = 150;

function typeWriter() {
    if(i < message.length) {
        msg = search.attr('placeholder') + message.charAt(i);
        search.attr('placeholder', msg);
        i++;
        setTimeout(typeWriter, speed);
    }
};

// Search term on submit function
$('form').on('submit', function(e) {
    e.preventDefault();
    const searchTerm = $('input').val();
    if(searchTerm !== '') {
        $('.searchResult').empty();
        flixApp.search(searchTerm);
    };
    
    $("form")[0].reset();
    
    const searchTitle = $('.searchTerm h2');
    searchTitle.css({display: 'block'});
    
    $('html, body').animate({
        scrollTop: $("#search").offset().top
    }, 1000);
});

// Function to closed the search bar
iconClose.on('click', function() {
    search.css({width: '0'});
    search.css({paddingLeft: '0'});
    iconClose.css({display: 'none'});

    $("form")[0].reset();
});

// Display Search term on page
flixApp.searchDisplay = function(searchMovie) {
    searchMovie.forEach(movie => {
        const displaySearch = `
                <div class="searchDetails"> 
                    <img class="searchBackdrop" src="${flixApp.imageBaseUrl}/${movie.poster_path}"/>
                    <div class="searchInfo">
                        <div class="extraInfo">
                            <h3>${movie.title}</h3> 
                            <p><i class="fas fa-star"></i>${movie.vote_average}</p>
                        </div>
                        <h4>${movie.release_date}</h4>
                        <p>${movie.overview}</p>
                        <h4 class="fav"><i class="far fa-heart"></i> Add to list</h4> 
                    </div>
                </div>
            `;
        $('.searchResult').append(displaySearch);
    })
};

// Search term API call
flixApp.search = function(queryParam) {
    $.ajax({
        url: `${flixApp.baseUrl}/search/multi`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: flixApp.key,
            query: queryParam,
        }
    }).then(function(searchData) {
        flixApp.searchDisplay(searchData.results.slice(0, 5));
    }).fail(function(error) {
        alert('The movie searched could not be found')
    });
};

// Sign In Toggle Function 
const signUpButton = $('#signUp');
const signInButton = $('#signIn');
const container = $('#container');

signUpButton.on('click', function() {
    container.addClass("rightPanelActive")
});

signInButton.on('click', function() {
    container.removeClass("rightPanelActive");
});

// Authentication Functions
const listFav = document.querySelector('.listFav');
const loggedOutLinks = document.querySelectorAll('.loggedOut');
const loggedInLinks = document.querySelectorAll('.loggedIn');

// Setup UI
const setupUI = (user) => {
    if (user) {
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } 
    else {
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};

// Show sign in page
const signInTab = $('#signInTab')

signInTab.on('click', function() {
    $('#account').css({display: 'block'});
    $('#carouselContainer').css({display: 'none'});
    $('main').css({ display: 'none' });
});
// Authentication ends here

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

            if(slides().length == $i + 1) $i = -1;

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
        flixApp.nowPlaying = nowPlayingData.results.slice(0, 5);
        flixApp.nowPlaying.forEach(playingMovie => {
            const playingMovieDisplay = `
                <div class="movieBanner"> 
                    <div class="bannerInfo">
                        <div class="bannerDetails">
                            <h3>${playingMovie.title}</h3>
                            <p><i class="fas fa-star"></i>${playingMovie.vote_average}</p>
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

// Call to get the Popular Movies from API
flixApp.popularMovies = function() {
    $.ajax({
        url: `${flixApp.baseUrl}/movie/popular`,
        method:'GET',
        dataType: 'json',
        data: {
           api_key: flixApp.key,
        }
    }).then(function(popularData) {
        flixApp.popular = popularData.results;
        flixApp.popular.forEach(movie => {
            const movieDisplay = `
                <div class="movieDetails"> 
                    <div class="moviePoster">
                        <img class="poster" src="${flixApp.imageBaseUrl}/${movie.poster_path}"/>
                        <div class="movieInfo">
                            <h3>${movie.title} (${movie.release_date})</h3>
                            <p>${movie.overview}</p>
                            <button class="favBtn"><i class="far fa-heart"></i> Favourite this</button> 
                        </div>
                    </div>
                </div>
            `;
            $('.results').append(movieDisplay);

            $('.movieInfo').hide();

            $('.poster').on('click', function() {
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

// Add Favourites to favList
// flixApp.favourite = function() {
//     $(document).on('click', '.movieDetails', function(e) {
//         const poster = e.currentTarget.firstElementChild.children[0];
//         const title = e.currentTarget.firstElementChild.children[1].children[0];
//         const overview = e.currentTarget.firstElementChild.children[1].children[1];

//         // const favMovie = (poster + title + overview);
        
//         // flixApp.fav.push(favMovie);
//         // console.log(favMovie);

//         // // console.log(flixApp.fav);
//         // flixApp.fav.forEach(movie => {
//         //     const displayFavMovie = `
//         //         <div class="movieDetails">
//         //             <div class="moviePoster">
//         //                 <img class="poster" src="${movie.imageBaseUrl}/${movie.poster_path}" />
//         //                 <div class="movieInfo">
//         //                     <h3>${title})</h3>
//         //                     <p>${overview}</p>
//         //                     <a href="${trailer}" target="_blank" class="btn"> Trailer <i class="fas fa-play"></i></a>
//         //                 </div>
//         //             </div>
//         //         </div>
//         //     `;
//         //     $('.favList').append(displayFavMovie);
//         // })
//     });

//     // Change the heart when clicked to a check mark
//     $(document).on('click', '.favBtn', function() {
//         if($(this).text() == " Favourite this") {
//             $(this).html('<i class="fas fa-check-circle"></i> Added');
//         } else {
//             $(this).html('<i class="far fa-heart"></i> Favourite this');
//         }
//     });
// };

// Setup FavMovies
// const setupFavMovies = (data) => {
//     if (data.length) {
//         // let html = '';
//         data.forEach(fav => {
//             const favMovie = fav.data();
//             const li = `
//                 <li>
//                     <div class="collapsible-header grey lighten-4"> ${favMovie.title} </div>
//                     <div class="collapsible-body white"> ${favMovie.overview} </div>
//                 </li>
//             `;
//             // html += li;
//             $('.listFav').append(li);
//         });
//         // listFav.innerHTML = html
//     } else {
//         $('.listFav').append(`<h5 class="center-align">Login to view guides</h5>`)
//         // listFav.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
//     }
// };


// Call to get the video ID to play on YouTube
flixApp.movieVideos = function() {
    $.ajax({
        url: `${flixApp.baseUrl}/movie/${flixApp.movieID}/videos`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: flixApp.key,
        }
    }).then(function(videoData) {
        flixApp.movieTrailer = videoData.results.slice(0, 1);
        flixApp.movieTrailer.forEach(trailer => {
            const displayTrailer = `
                <div class="movieInfo">
                    <a href="${flixApp.youTubeBaseUrl}/${trailer.key}" target="_blank" class="btn"> Trailer <i class="fas fa-play"></i></a>
                </div>
            `;
            $('.movieInfo').append(displayTrailer);
        });
    }).fail(function (error) {
        alert('We have a problem!')
    });   
}

flixApp.init = function() {
    flixApp.moviesHero();
    flixApp.popularMovies();
    // flixApp.favourite();
}

$(function() {
    flixApp.init();
})