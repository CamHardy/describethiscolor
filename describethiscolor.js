let cover = document.getElementById('cover');
let hexlabel = document.getElementById('hexlabel');
let descInput = document.getElementById('descInput');
applyRandomColor();

window.addEventListener('load', () => {
    var form = document.getElementsByClassName('needs-validation')[0];
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let hexVal = hexlabel.innerText;
            let description = descInput.value;

            grecaptcha.ready(() => {
                grecaptcha.execute('6Lfp3NkUAAAAAI82ud6HdW-4a_ekNrr7-lvYnpdU', {action: 'homepage'}).then(token => {
                    fetch('http://describethiscolor.xyz:5000/api/descriptions', {
                        method: 'POST',
                        body: JSON.stringify({hexVal, description, token}),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(desc => {
                        console.log(desc);
                        window.location.reload();
                    });
                });
            });
        }
        form.classList.add('was-validated');
    });
}, false);

function applyRandomColor() {
    function randHex() {return Math.floor(Math.random() * 255)}
    function dec2hex(dec) {return dec.toString(16).padStart(2, '0')}
    let rr = randHex();
    let gg = randHex();
    let bb = randHex();
    let colorStr = "#" + dec2hex(rr) + dec2hex(gg) + dec2hex(bb);
    let colorVal = `rgba(${rr}, ${gg}, ${bb}, 1)`;
    cover.style.backgroundColor = colorVal;
    hexlabel.innerText = colorStr;
    hexlabel.style.color = colorVal;

    jss.set('.btn-outline-primary', {
        'color': colorVal,
        'border': `2px solid ${colorVal}`
    });
    jss.set('.btn-outline-primary:hover', {
        'color': 'rgba(0,0,0,0.3)',
        'background-color': colorVal,
        'border': `2px solid ${colorVal}`
    });
}