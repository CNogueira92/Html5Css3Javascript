var i=0;

self.addEventListener('message',function(evt){
    i+= parseInt(evt.data);
})

function loop(){
  i++;
    postMessage(i); //envia mensagem para quem chama esta embutido no worker
    setTimeout('loop()',0);
};

loop();