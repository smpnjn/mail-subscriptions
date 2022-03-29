if(document.getElementById('subscribe-box') !== null) {
    // If the subscribe box is on this page..
    if(document.getElementById('subscribe-box') !== null) {
        // For validating an email
        const validateEmail = function(email) {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return regex.test(email);
        }
        // For verifying a subscription
        const subscribe = async function() {
            // Get the value of the input
            let input = document.querySelector('#subscribe-box input[type="text"]').value;
            // Validate if it's an email
            if(!validateEmail(input)) {
                // Show an error if it's not
                document.querySelector('#subscribe-box .error-message').classList.add('active');
                setTimeout(function() {
                    document.querySelector('#subscribe-box .error-message').classList.remove('active');
                }, 3000);
            } else {
                // Otherwise post to our subscribe endpoint
                let postEmailSubscription = await fetch('/subscribe/email', {
                    method: 'POST',
                    body: JSON.stringify({
                        "email" : input
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });

                // Get the response
                let getResponse = await postEmailSubscription.json();
                document.querySelector('#subscribe-box .error-message').textContent = getResponse.message;
                document.querySelector('#subscribe-box .error-message').classList.add('active');

                // Show the apropriate response
                if(getResponse.code == "03") {
                    localStorage.setItem('#subscribe', input);
                } else {
                    setTimeout(function() {
                        document.querySelector('#subscribe-box .error-message').classList.remove('active');
                    }, 3000);
                }
            }
        };

        // If the user clicks subscribe submit their subscription
        document.querySelector('#subscribe-box input[type="submit"]').addEventListener('click', function(e) {
            subscribe();
        });

        // If the user presses enter submit their subscription
        document.querySelector('#subscribe-box input[type="text"]').addEventListener('keydown', function(e) {
            if(e.keyCode === 13) {
                subscribe();
            }
        });

    }
}