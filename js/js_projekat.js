class Clan_teretane{
    id
    ime_i_prezime
    godina_rodjenja
    email
    vrsta_clana
    clanarina

    constructor(id, ime_i_prezime, godina_rodjenja, email, vrsta_clana){
        this.id = id
        this.ime_i_prezime = ime_i_prezime
        this.godina_rodjenja = godina_rodjenja
        this.email = email
        this.vrsta_clana = vrsta_clana
        if (vrsta_clana == "povlašćen"){
            this.clanarina = 3000 * 0.8;
        }
        else{
            this.clanarina = 3000;
        }
    }

    static napravi_th(text) {
        var novi_th = document.createElement('th');
        novi_th.innerText = text;
        return novi_th;
    }
}

clan1 = new Clan_teretane(1, "Ana Kosanović", 1999, "anakosanovic@gmail.com", "regularan") 
clan2 = new Clan_teretane(2, "Milica Kosanović", 1999, "mkosanovic@gmail.com", "povlašćen")
clan3 = new Clan_teretane(3, "Pera Žikić", 1995, "perazikic@gmail.com", "regularan")
//prilikom kreiranja objekata, da bismo pozvali konstruktor moramo da stavimo "new", pa parametri redom iz samog konstruktora 

niz_svih_clanova = [clan1, clan2, clan3]
if (!localStorage.getItem("svi_clanovi"))
    localStorage.setItem("svi_clanovi", JSON.stringify(niz_svih_clanova))

window.addEventListener('load', init)
var niz_svih_clanova
var tabela;
var interval = null;
var trenutna_duzina_timera = 100;
var brojac = 0
var vreme_stoperice;
var div_za_timer;
var broj1
var broj2
var operacija


function init() {
    niz_svih_clanova = JSON.parse(localStorage.getItem('svi_clanovi')) || [clan1, clan2, clan3]

    tabela = document.getElementById('tabela')
    var brojac = 0;

    for(const clan of niz_svih_clanova) {
        var novi_red = document.createElement('tr')

        for (const key in clan) {
            if (Object.hasOwnProperty.call(clan, key)) {
                const element = clan[key];
                var novi_th = Clan_teretane.napravi_th(element)
                novi_red.appendChild(novi_th)
            }

        }

        var th_delete = Clan_teretane.napravi_th("Delete");
        th_delete.id = "delete_" + brojac;
        novi_red.appendChild(th_delete)
        
        var th_update = Clan_teretane.napravi_th("Update");
        th_update.id = "update_" + brojac;

        novi_red.appendChild(th_delete)
        novi_red.appendChild(th_update)

        tabela.appendChild(novi_red)

        th_delete.addEventListener('click', obrisi_iz_tabele)
        th_update.addEventListener('click', prikaži_update_formu)
        brojac++;
    }

    dugme_dodaj_clana = document.getElementById('dugme_dodaj_clana')
    dugme_dodaj_clana.addEventListener('click', dodaj_clana)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function zapocni_timer()
{
    
    if(trenutna_duzina_timera <= 0) {
        trenutna_duzina_timera = 0;
        window.alert("Vreme isteklo")
        clearInterval(interval);
        interval = null;
        location.reload()
        return;
    }
    brojac+=1;

    trenutna_duzina_timera -= 100/vreme_stoperice/20;
    


    div_za_timer.style.width = trenutna_duzina_timera + "%";

}

function dodaj_clana(event){
    console.log("Dugme dodaj člana je povezano!")
    event.preventDefault();

    
    var id_element = document.getElementById('id');
    var ime_prezime_element = document.getElementById('ime_i_prezime');
    var godina_rodjenja_element = document.getElementById('godina_rodjenja');
    var email_element = document.getElementById('email');
    var vrsta_clana_element_reg = document.getElementById('vrsta_clana_reg');
    var vrsta_clana_element_povl = document.getElementById('vrsta_clana_povl');
    var prostor_provera = document.getElementById('provera');

    id = id_element.value
    ime_i_prezime = ime_prezime_element.value
    godina_rodjenja = godina_rodjenja_element.value
    email = email_element.value
    vrsta_clana = ''

    if(id == "" || ime_i_prezime =="" || godina_rodjenja =="" || email == "")
    {
        window.alert("Moraju svi podaci biti popunjeni")
        return;
    }

    console.log(id)

    if(proveri_da_li_postoji_id_u_storageu(id) == true)
    {
        alert(`ID: ${id} mora biti jedinstven!`)
        return;
    }

    if(validiraj_ime_i_prezime(ime_i_prezime) == false) {
        document.getElementById('ime_i_prezime_greska').innerText = "Ime i prezime moraju da se sastoje od makar 2 slova!"
        return
    } else {
        document.getElementById('ime_i_prezime_greska').innerText = ""
    }

    if(vrsta_clana_element_reg.checked){
        vrsta_clana = 'regularan'
    }
    else if (vrsta_clana_element_povl.checked){
        vrsta_clana = 'povlašćen'
    }
    else{
        window.alert("Moraju svi podaci biti popunjeni")
        return;
    }

    
    if(godina_rodjenja < 0 || godina_rodjenja > 2023)
    {
        window.alert("Godina rodjenja mora biti izmedju 0 i 2023!")
        return;
    }

    if(!email.includes("@")) 
    {
        window.alert("Email adresa mora biti validna!")
        return;
    }


    /// kada se zavrsi validacija => dodajemo u local storage 
    /// element 


    broj1 = getRandomInt(10);
    broj2 = getRandomInt(10);
    operacija = getRandomInt(4);

    switch(operacija){
        case 1:
            operacija = '+';
            break;
        case 2:
            operacija = '-';
            break;
        case 3:
            operacija = '*';
            break;
        case 4:
            operacija = '-';
            break;
    }

    var izraz_text = broj1 + ' ' + operacija + ' ' + broj2 + ' ='
    

    prostor_provera.innerHTML = `
        <div class="za_timer">
        
        </div>
        <p id="izraz">${izraz_text}</p>
        <label>Resenje:</label>
        <input type="number" id="resenje">
        <button id="proveri">Posalji</button>
    `
    div_za_timer = document.querySelector('.za_timer')
    dugme_proveri = document.getElementById('proveri')
    dugme_proveri.addEventListener('click', proveri)

    vreme_stoperice = 30;
    if(interval== null)
    {
        interval = setInterval(zapocni_timer, 1000/20)
    }



}

function proveri(event){

    event.preventDefault();
    var resenje;
    switch(operacija){
        case '+':
            resenje = broj1 + broj2;
            break;
        case '-':
            resenje = broj1 - broj2;
            break;
        case '*':
            resenje = broj1 * broj2;
            break;
        case '/':
            resenje = broj1 / broj2;
            resenje = Math.floor(resenje);
            break;
    }
    input_resenja = document.getElementById('resenje').value;
    if (resenje == input_resenja){
        var t = new Clan_teretane(id, ime_i_prezime, godina_rodjenja, email, vrsta_clana)
        console.log(t)
        var svi_clanovi = JSON.parse(localStorage.getItem('svi_clanovi')) || [];
        svi_clanovi.push(t);
        localStorage.setItem('svi_clanovi', JSON.stringify(svi_clanovi))
        location.reload() 
    }
    else {
        window.alert("Netacno resenje");
        location.reload();
        return;
    }

}

function validiraj_ime_i_prezime(ime_i_prezime){
    if(ime_i_prezime.length < 2) return false;
    return true;
}

function proveri_da_li_postoji_id_u_storageu(id)
{
    var svi_clanovi = JSON.parse(localStorage.getItem('svi_clanovi')) || [];

    for (const clan of svi_clanovi) { 
        if (clan.id == id){ 
            return true; 
        }
    }
    return false; 
}

function obrisi_iz_tabele(event){
    var meta_dogadjaja = event.target;
    console.log(meta_dogadjaja);
    var id_mete = meta_dogadjaja.id;
    var delovi_id_mete = meta_dogadjaja.id.split("_")
    var pozicija = parseInt(delovi_id_mete[1]);
    
    console.log(id_mete)
    console.log(delovi_id_mete)
    console.log(pozicija)

    var svi_clanovi = JSON.parse(localStorage.getItem('svi_clanovi'))
    console.log(svi_clanovi)
    svi_clanovi.splice(pozicija, 1)

    localStorage.setItem('svi_clanovi', JSON.stringify(svi_clanovi))
    location.reload()
}

function prikaži_update_formu(event){
    var pozicija = parseInt(event.target.id.split("_") [1]);
    var svi_clanovi = JSON.parse(localStorage.getItem('svi_clanovi'))
    
    var trenutni_clan = svi_clanovi[pozicija];
    console.log(trenutni_clan)
    console.log(pozicija)
    console.log("Desio se prikaz!")
    var prostor_za_update = document.getElementById('update_clan');
    console.log(trenutni_clan)
    

    if (trenutni_clan.vrsta_clana == 'regularan'){
        vrsta_clana_reg_bool = true
    }
    else{
        vrsta_clana_povl_bool = true
    }

    prostor_za_update.innerHTML = `
    <form action="">
    <p>
        <label for="id">ID</label>
        <input type="number" name="id" id="id_update" value=${trenutni_clan.id} readonly>
    </p>

    <p>
        <label for="ime_i_prezime">Ime i prezime</label>
        <input type="text" name="ime_i_prezime" id="ime_prezime_update" value='${trenutni_clan.ime_i_prezime}'>
        
    </p>

    <p>
        <label for="godina_rodjenja">Godina rodjenja</label>
        <input type="number" name="godina_rodjenja" id="godina_rodjenja_update" value='${trenutni_clan.godina_rodjenja}'>
    </p>

    <p>
        <label for="email">Email</label>
        <input type="email" name="email" id="email_update" value=${trenutni_clan.email}> 
    </p>

    <p>
        <label for="vrsta_clana">Vrsta člana:</label>
        <p><input type="radio" name="vrsta_clana" id="vrsta_clana_reg_update" value="regularni">regularni</p>
        <p><input type="radio" name="vrsta_clana" id="vrsta_clana_povl_update" value="povlašćeni">povlašćeni</p>
    </p>


    <p>
        <button id="dugme_izmeni_clana">Update!</button>
    </p>
</form>
    `

    var vrsta_clana_element_reg_update = document.getElementById('vrsta_clana_reg_update');
    var vrsta_clana_element_povl_update = document.getElementById('vrsta_clana_povl_update');
    if (trenutni_clan.vrsta_clana == 'regularan'){
        vrsta_clana_element_reg_update.checked = true
    }
    else{
        vrsta_clana_element_povl_update.checked = true
    }
    var dugme_izmeni_clana = document.getElementById('dugme_izmeni_clana')
    dugme_izmeni_clana.addEventListener('click', update_clan)

function update_clan(event){
    event.preventDefault()

    var id_element = document.getElementById('id_update');
    var ime_prezime_element = document.getElementById('ime_prezime_update');
    var godina_rodjenja_element = document.getElementById('godina_rodjenja_update');
    var email_element = document.getElementById('email_update');
    var vrsta_clana_element_reg = document.getElementById('vrsta_clana_reg_update');
    var vrsta_clana_element_povl = document.getElementById('vrsta_clana_povl_update');

    id = id_element.value
    ime_i_prezime = ime_prezime_element.value
    godina_rodjenja = godina_rodjenja_element.value
    email = email_element.value
    vrsta_clana = ''

    if(id == "" || ime_i_prezime =="" || godina_rodjenja =="" || email == "")
    {
        window.alert("Moraju svi podaci biti popunjeni")
        return;
    }

    console.log(id)

    

    if(validiraj_ime_i_prezime(ime_i_prezime) == false) {
        document.getElementById('ime_i_prezime_greska').innerText = "Ime i prezime moraju da se sastoje od makar 2 slova!"
        return
    } else {
        document.getElementById('ime_i_prezime_greska').innerText = ""
    }

    if(vrsta_clana_element_reg.checked){
        vrsta_clana = 'regularan'
    }
    else if (vrsta_clana_element_povl.checked){
        vrsta_clana = 'povlašćen'
    }
    else{
        window.alert("Moraju svi podaci biti popunjeni")
        return;
    }

    
    if(godina_rodjenja < 0 || godina_rodjenja > 2023)
    {
        window.alert("Godina rodjenja mora biti izmedju 0 i 2023!")
        return;
    }

    if(!email.includes("@")) 
    {
        window.alert("Email adresa mora biti validna!")
        return;
    }


    var t = new Clan_teretane(id, ime_i_prezime, godina_rodjenja, email, vrsta_clana)
    console.log(t)
    var svi_clanovi = JSON.parse(localStorage.getItem('svi_clanovi')) || [];

    
    var n = svi_clanovi.length;
    for(var i = 0;i < n;i++)
        if(svi_clanovi[i].id == id)
        {
            svi_clanovi[i] = t; 
            
            break;
        }
    }

    localStorage.setItem('svi_clanovi',JSON.stringify(svi_clanovi))

    location.reload();

}



