const flixApp = {}
flixApp.key = 'acf63cd8f0f564cb943004e66b74e67a';
flixApp.baseUrl = 'https://api.themoviedb.org/3';
flixApp.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Carousel Function
function bannerSwitcher() {
    next = $('.sec-1-input').filter(':checked').next('.sec-1-input');
    if (next.length) next.prop('checked', true);
    else $('.sec-1-input').first().prop('checked', true);
}

let bannerTimer = setInterval(bannerSwitcher, 6000);

$('nav .controls label').click(function () {
    clearInterval(bannerTimer);
    bannerTimer = setInterval(bannerSwitcher, 6000)
});


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
                        <a href = "${flixApp.baseUrl}/movie/${movie.id}/videos"> Trailer</a >
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

    // <a href = "${flixApp.baseUrl}/movie/${movie.id}/videos"> Trailer</a >

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

flixApp.init = function() {
    flixApp.popularMovies();
}

$(function() {
    flixApp.init();
})

// // Carousel 
// let carousel = document.querySelector('.carousel');
// let container = carousel.querySelector('.carouselContainer');
// let prevBtn = carousel.querySelector('.carouselPrev');
// let nextBtn = carousel.querySelector('.carouselNext');
// let pagination = carousel.querySelector('.carouselPagination');
// let bullets = [].slice.call(carousel.querySelectorAll('.carouselBullet'));
// let totalItems = container.querySelectorAll('.carouselItem').length;
// let percent = (100 / totalItems);
// let currentIndex = 0;

// function next() {
//     slideTo(currentIndex + 1);
// }

// function prev() {
//     slideTo(currentIndex - 1);
// }

// function slideTo(index) {
//     index = index < 0 ? totalItems - 1 : index >= totalItems ? 0 : index;
//     container.style.WebkitTransform = container.style.transform = 'translate(-' + (index * percent) + '%, 0)';
//     bullets[currentIndex].classList.remove('activeBullet');
//     bullets[index].classList.add('activeBullet');
//     currentIndex = index;
// }

// bullets[currentIndex].classList.add('activeBullet');
// prevBtn.addEventListener('click', prev, false);
// nextBtn.addEventListener('click', next, false);

// pagination.addEventListener('click', function (e) {
//     let index = bullets.indexOf(e.target);
//     if (index !== -1 && index !== currentIndex) {
//         slideTo(index);
//     }
// }, false);
