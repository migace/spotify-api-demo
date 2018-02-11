import './main.scss';
import * as swal from 'sweetalert2';
import Spotify from './classes/Spotify';

document.getElementById('test').addEventListener('click', function() {    
    swal({
        html: `
            <iframe id="iframe" src="http://localhost:3000"></iframe>
        `
    });
});

window.addEventListener('message', function(e) {
    if (e.data.access_token) {
        swal.close();
        const spotify = new Spotify(e.data.access_token);
        spotify.getTracks('love');
    }
},false);