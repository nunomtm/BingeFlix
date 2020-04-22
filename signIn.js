// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('favMovies').get().then(snapshot => {
            // setupFavMovies(snapshot.docs);
            setupUI(user);
        });
    } else {
        setupUI();
        // setupFavMovies([]);
    }
});

// signup
const signupForm = document.querySelector('#signUpForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signUpEmail'].value;
    const password = signupForm['signUpPassword'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // close the signup modal & reset form
        const modal = document.querySelector('.signUpContainer');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

// logout
const logout = document.querySelector('#logOut');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// signin
const signinForm = document.querySelector('#signInForm');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signinForm['signInEmail'].value;
    const password = signinForm['signIpPassword'].value;

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        // close the signup modal & reset form
        const modal = document.querySelector('.signInContainer');
        M.Modal.getInstance(modal).close();
        signinForm.reset();
    });

});