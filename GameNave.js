$(document).ready(function () {

    var cnv = document.getElementById('game');
    var ctx = cnv.getContext("2d");

    var w = cnv.width;
    var h = cnv.height;

    var direction = "right";

    //carregando a imagem do fundo
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () { bgReady = true; }
    bgImage.src = './imagens/fundo.png';

    // criando objeto nave  
    var Nave = function (x, y, w, h, s) {
        this.x = x || 250;
        this.y = y || 450;
        this.speed = s || 250;
        this.w = w || 60;
        this.h = h || 60;
        this.ready = false;
        this.image = new Image();

        var self = this;
        this.image.onload = function () { self.ready = true; }
        this.image.src = './imagens/nave.png';
    }
    var nave = new Nave();

    //criando objeto tiro
    var Tiro = function (x, y, w, h, s) {
        this.x = x || 0;
        this.y = y || 0;
        this.speed = s || 250;
        this.w = w || 20;
        this.h = h || 20;
        this.ready = false;
        this.image = new Image();

        var self = this;
        this.image.onload = function () { self.ready = true; }
        this.image.src = './imagens/tiro.png';
    }
    var tiros = [];

    //Criando asteroides
    var Aste = function (x, y, w, h, s) {
        this.x = x || 0;
        this.y = y || 0;
        this.speed = s || 250;
        this.w = w || 40;
        this.h = h || 40;
        this.ready = false;
        this.image = new Image();

        var self = this;
        this.image.onload = function () { self.ready = true; }
        this.image.src = './imagens/asteroid.png';
    }
    var astes = [];

   //carregando audio fundo
   var fundoAudio = $('#sndFundo')[0];

     //carregando audio tiro
   var fireAudio = $('#sndFire')[0];

    //Eventos de movimento
    var keysDown = {};


    $(document).on('keydown', function (e) {
        keysDown[e.keyCode] = true;
    });

    $(document).on('keyup', function (e) {
        delete keysDown[e.keyCode];
    });

    //Função que trata o movimento da nave
    function updateNave(modifier) {
        if (38 in keysDown) { //cima
            if (nave.y >= 0.0) {
                nave.y -= nave.speed * modifier;
            }
        }
        if (40 in keysDown) { //baixo
            if (nave.y <= (h - nave.h)) {
                nave.y += nave.speed * modifier;
            }
        }
        if (37 in keysDown) { //esquerda
            if (nave.x >= 0.0) {
                nave.x -= nave.speed * modifier;
            }
        }

        if (39 in keysDown) {//direita
            if (nave.x <= (w - nave.w)) {
                nave.x += nave.speed * modifier;
            }
        }
    }

    function updateTiro(modifier) {
        //Barra
        if (32 in keysDown) {
            var newTiro = new Tiro();
            newTiro.x = nave.x + ((nave.w / 2) - (newTiro.w / 2));
            newTiro.y = nave.y - newTiro.h;

            tiros.push(newTiro);

            if(!fireAudio.ended){
                fireAudio.pause();
            }
            fireAudio.play();
        }

        //movimenta os tiros
        for (var tirox in tiros) {
            var tiro = tiros[tirox];
            tiro.y -= tiro.speed * modifier;

            if (tiro.y + tiro.h <= 0.0) {
                tiros.splice(tirox, 1);

            }
        }
    }

    //Função que trata a geração e movimento dos asteroides
    function updateAsteroides(modifier) {
        //Gera novos asteroides
        if (modifier > 0.0029){
        var newAsteroid = new Aste();
        newAsteroid.x = Math.floor(Math.random()*w);
        astes.push(newAsteroid);
        }
      for (var astesx in astes) {
            var asteroid = astes[astesx];
            asteroid.y += asteroid.speed * modifier;

            if (asteroid.y > h) {
                    astes.splice(astesx, 1);
            }
        }
    }


    //Função que renderiza 
    function render() {
        //Limpando a tela
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);

        //renderizando a imagem do fundo
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0, w, h);
        }
        //renderiza imagem da nave
        if (nave.ready) {
            ctx.drawImage(nave.image, nave.x, nave.y, nave.w, nave.h);
        }

        //renderiza os tiros
        for (var tirox in tiros) {
            var tiro = tiros[tirox];
            if (tiro.ready) {
                ctx.drawImage(tiro.image, tiro.x, tiro.y, tiro.w, tiro.h);
            }
        }
         //renderiza os asteroids
        for (var astesx in astes) {
            var asteroid = astes[astesx];
            if (asteroid.ready) {
                ctx.drawImage(asteroid.image, asteroid.x, asteroid.y, asteroid.w, asteroid.h);
            }
        }
    }



    var then = Date.now();
    function main() {
        var now = Date.now();
        var delta = now - then;

        render();

        then = now;

        updateNave(delta / 1000);
        updateTiro(delta / 1000);
        updateAsteroides(delta / 5000);
    }

    setInterval(main, 1);



});