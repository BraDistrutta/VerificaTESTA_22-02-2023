
let utenti;
let messaggi;
const ora = new Date();

window.onload = function() {
    let promise1 = fetch("http://localhost:63342/VerificaTESTA_22-02-2023/server/utenti.php");

    promise1.then(
        async (risposta)=>{
            utenti = await risposta.json();
            aggiornaUtenti();
            let promise2 = fetch("http://localhost:63342/VerificaTESTA_22-02-2023/server/messaggi.php");
            promise2.then(
                async (risposta)=>{
                    messaggi = await risposta.json();
                    aggiornaHeader(1);
                }
            )
        }
    )


}

function aggiornaUtenti() {
    let _listUtenti = document.querySelector("#listUtenti");
    _listUtenti.innerHTML="";


    for(let i=1;i<utenti.length;i++){
        let nomeUtente = utenti[i].nome + " " + utenti[i].cognome.substring(0,1) + ".";
        let genereUtente;
        if(utenti[i].genere == "m")
            genereUtente = "face";
        else
            genereUtente = "face_3";

        let utente = `<li onclick="aggiornaHeader(` + utenti[i].codUt + `)">
                        <div class="material-symbols-outlined icone">` +
                            genereUtente
                        + `</div> ` +
                        nomeUtente
                        + `</li>`;

        _listUtenti.innerHTML += utente;
    }
}

function aggiornaMessaggi(codDestinatario) {
    let _sectionMessaggi = document.querySelector("#sectionMessaggi");
    _sectionMessaggi.innerHTML="";


    for(let i=0;i<messaggi.length;i++){
        let classUt = (i%2)+1;
        let messaggio = "";
        let mess = messaggi[i].mes;

        if((messaggi[i].codMit=="0" || messaggi[i].codDest=="0") && (messaggi[i].codMit==codDestinatario || messaggi[i].codDest==codDestinatario)){
            if(messaggi[i].orainvio.substring(0,2)<ora.getHours())
                messaggio = `<article class="mes ut`+classUt+`">`+ mess +`</article>`;
            else if (messaggi[i].orainvio.substring(0,2)==ora.getHours())
                if(messaggi[i].orainvio.substring(3,5)<=ora.getMinutes())
                    messaggio = `<article class="mes ut`+classUt+`">`+ mess +`</article>`;


            _sectionMessaggi.innerHTML += messaggio;
        }


    }
}

function aggiornaHeader(codUtente) {
    let _headerUtente = document.querySelector("#headerUtente");
    _headerUtente.innerHTML="";

    let nomeUtente = utenti[codUtente].nome + " " + utenti[codUtente].cognome;
    let genereUtente;
    if(utenti[codUtente].genere == "m")
        genereUtente = "face";
    else
        genereUtente = "face_3";

    let oraMess = "00:00";
    for(let i=0;i<messaggi.length;i++){
        if((codUtente.toString() == messaggi[i].codMit) && (messaggi[i].codDest=="0")){
            if(messaggi[i].orainvio.substring(0,2)<=ora.getHours()){
                if(messaggi[i].orainvio.substring(0,2)>oraMess.substring(0,2))
                    oraMess = messaggi[i].orainvio;
                else if(messaggi[i].orainvio.substring(0,2)==oraMess.substring(0,2)){
                    if(messaggi[i].orainvio.substring(3,5)<=ora.getMinutes()) {
                        if (messaggi[i].orainvio.substring(3, 5) == oraMess.substring(3, 5))
                            oraMess = messaggi[i].orainvio;
                    }
                }
            }
        }
    }

    _headerUtente.innerHTML += `<div class="material-symbols-outlined icone">`+
                                    genereUtente
                                +`</div>
                                <div>
                                    <div id="divNome">`+nomeUtente+`</div>
                                    <div id="divUltimoMes">Oggi alle `+ oraMess +`</div>
                                </div>`;

    aggiornaMessaggi(codUtente);
}

