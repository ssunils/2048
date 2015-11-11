$(document).ready(function(){
    var b = c = 0;
    for(a=0;a<16;a++){

        if(a > 3 && a % 4 == 0){
            b = b+1;
            c = 0 ;
        }
        var boxes = $('<div class = "boxing" id = "block-'+b+'-'+c+'"><div class = "label"></div></div>');
        c = c+1;
        $('.grid').append(boxes);
    }
    game.run();
});


