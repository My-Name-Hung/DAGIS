export const googles = {
    mounted() {
        function handleCredentialResponse(response) {
            console.log("Encoded JWT ID token: " + response.credential);
            }
            window.onload = function () {
            googles.accounts.id.initialize({
                client_id: "519317591544-2v81tnpa3u76nj5rcqiemcv8aqit4682.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });
            googles.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" }  // customization attributes
            );
            googles.accounts.id.prompt(); // also display the One Tap dialog
            }
        handleCredentialResponse()
    }
}

