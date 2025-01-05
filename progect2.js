'use strict'

document.body.style.margin = 0

var newGamer = 'Кристина'
// function createNewGamer() {
//     // newGamer = prompt('Ваше имя?')
//     newGamer = 'Кристина'
// }

var sharik = document.getElementsByTagName('audio')[0]

// console.log(window.navigator.vibrate(200));



//счетчик игры
var countTable= document.getElementsByClassName('forCount')[0]
var counter = 0 
countTable.innerHTML = `Ваш счет:${counter}`

const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
let records;
let updatePassword;
const stringName='LITVIN_BUBBLEBOLL_RECORDS';

function sendRecords() {//в конце игры сохраняет рекорды
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : stringName,
                p : updatePassword },
            cache : false,
            success : lockGetReady,
            error : errorHandler
        }
    );
}
             
function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        records=[];
        if ( callresult.result!="" ) { 
            records=JSON.parse(callresult.result);
            if ( !Array.isArray(records) )
                records=[];
        }

        // for ( let r=0; r<records.length; r++ ) {
        //     if (counter!==records[r].record) {
        //         records.push( {name:newGamer,record:counter} );//нужна проверка на рекорды          
        //     } 
        // } добавить проверку на одинаковые рекорды!!!
        records.push( {name:newGamer,record:counter} );//нужна проверка на рекорды          
        records.sort( (a,b) => b.record-a.record );
        if (records.length>5) {
        records = records.slice(0,5)
        }
        console.log(records);
                // records=[];//очистить хранилище
        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : stringName,
                    v : JSON.stringify(records), p : updatePassword },
                cache : false,
                success : updateReady,
                error : errorHandler
            }
        );
    }
}

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function getRecords() {
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'READ', n : stringName },
            cache : false,
            success : readReady,
            error : errorHandler
        }
    );
}

function readReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        records=[];
        if ( callresult.result!="" ) {
            records=JSON.parse(callresult.result);
            if ( !Array.isArray(records) )
                records=[];            
        }
    let str='';
    for ( let r=0; r<records.length; r++ ) {
        // str+="<b>"+escapeHTML(recordsAll.name)+":</b> "
        //     +escapeHTML(recordsAll.result)+"<br/>";
        str+=escapeHTML(records[r].name)+": "+ records[r].record+"; "
    }
alert(str)
  }
}

function escapeHTML(text) {
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}



//игровое поле
var field=document.getElementById('Table');
var context=field.getContext('2d');
field.height = document.getElementById('Table1').offsetHeight*0.9
field.width = document.getElementById('Table1').offsetWidth*0.99
var totalBolls = 14//выбирать только четное количество шаров, важно для fieldCreate ()
var totalFloors = 15
var bollRadius = field.offsetWidth/totalBolls/2

//получение случайного цвета
function randomDiap(n,m) {
    return Math.floor(
      Math.random()*(m-n+1)
      )+n;
}
var bollColors = {
    1:'green',
    2:'grey',
    3:'red',
    4:'violet',
    5:'black',
    6:'yellow'
}


//координаты и цвета мячей
var pointBolls = {}
var colorsBolls = {}
var pointColorBolls = {}//можно будет убрать

//характерстики главного шара. Потом обьединить в обьект или новый класс, переделать в обект главного мяча и добавть свойство - перересовка ховер в ТИК
var headBollColor = ''
var line = []
var colorHover = 0

var X = 0
var ctg = 0
var stopBollX = 0
var stopBollY = 0
var stopColor = ''

function createPointColor(){
//обнуление всех сохранений для начала игры
counter = 0 
stepDown=0.3  
pointBolls = {}
colorsBolls = {}
pointColorBolls = {}//можно будет убрать
headBollColor = ''
line = []
colorHover = 0
X = 0
ctg = 0
stopBollX = 0
stopBollY = 0
stopColor = ''


    var b = 1
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        var a = 1
        pointBolls[bollY] = {}
        colorsBolls[bollY] = {}
        pointColorBolls[bollY] ={}
        for (let bollX = 1; bollX <= totalBolls; bollX++) {
            var colorBoll = bollColors[randomDiap(1,5)] 
            var x = field.offsetLeft+bollRadius*a
            var y = field.offsetTop+bollRadius*b
            pointBolls[bollY][bollX] = {'x мяча':x,'y мяча':y}
            colorsBolls[bollY][bollX]= colorBoll
            pointColorBolls[bollY][bollX]= {[colorBoll]:{'x мяча':x,'y мяча':y}}
            a = a+2            
        }
        b = b+2
    }  
        headBollColor = colorBoll//сохраняем полученный цвет главного шарика
}
createPointColor()

function findColor(eo) {
    eo = eo||window.event
    var eoX = eo.pageX;
    var eoY =eo.pageY;
    X=0
    move=0
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        for (let bollX = 1; bollX <= totalBolls; bollX++) {
            if (eoX>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {
                if (bollX>totalBolls/2) {
                    ctg = (pointBolls[bollY][bollX]['x мяча']-field.offsetWidth/2)/(field.height-bollRadius-pointBolls[bollY][bollX]['y мяча'])                    
                } else if (bollX<=totalBolls/2){
                    ctg = (field.offsetWidth/2-pointBolls[bollY][bollX]['x мяча'])/(field.height-bollRadius-pointBolls[bollY][bollX]['y мяча'])
                }
                stopBollX = bollX
                stopBollY = bollY
                stopColor = headBollColor
            }
        }
    }  
    headBollColor=bollColors[randomDiap(1,5)]
}

var move = 0//для сохранения colorsBolls[stopBollY][stopBollX]!==stopColor в конце функции//здесь нужна еще проверка!!  так как заходит по второму кругу на colorsBolls[stopBollY][stopBollX]===stopColor  и делает шар желтым!!
function changeColor() {
    if (colorsBolls[stopBollY][stopBollX]===stopColor&&move===0) {
        colorsBolls[stopBollY][stopBollX]=bollColors[6]  
        counter++   
    // // тут начинается ошибка !!!

    var iYTop = 1//убираем одинаковые шары по Y
    while ((stopBollY-iYTop)>=1&&colorsBolls[stopBollY-iYTop][stopBollX]===stopColor) {
        colorsBolls[stopBollY-iYTop][stopBollX]=bollColors[6]
        iYTop++ 
        counter++      
    }
    var iYButtom = 1//убираем одинаковые шары по Y
    while ((stopBollY+iYButtom)<=totalFloors&&colorsBolls[stopBollY+iYButtom][stopBollX]===stopColor) {
        colorsBolls[stopBollY+iYButtom][stopBollX]=bollColors[6]
        iYButtom++ 
        counter++                      
    }    
 
    //убираем одинаковые шары по X 
    var iXLeft = 1
    var iXRight = 1
    while (colorsBolls[stopBollY][stopBollX-iXLeft]===stopColor) {
        colorsBolls[stopBollY][stopBollX-iXLeft] =bollColors[6]
        iXLeft ++
        counter++ 
    }  
    while (colorsBolls[stopBollY][stopBollX+iXRight]===stopColor) {
        colorsBolls[stopBollY][stopBollX+iXRight] =bollColors[6]
        iXRight ++
        counter++ 
    }
    } else  if (colorsBolls[stopBollY][stopBollX]!==stopColor) {
        colorsBolls[stopBollY][stopBollX]=stopColor
        move=1
    }
}

function mouseOverMove(eo) {
   eo = eo||window.event
    var eoX = eo.pageX;
    var eoY =eo.pageY;
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        for (let bollX = 1; bollX <= totalBolls; bollX++) {
            if (eoX>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {                      
            line = [pointBolls[bollY][bollX]['x мяча'],pointBolls[bollY][bollX]['y мяча']]
            colorHover = colorsBolls[bollY][bollX]
        }
    }
    }  
    if (eo.pageY-bollRadius>pointBolls[totalFloors][totalBolls]['y мяча']){
        line = []
    }

}


function fieldCreate () {
    context.fillStyle='yellow';//поле
    context.fillRect(0,0,field.width,field.height);          
    var b = 1
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        var a = 1
        for (let bollX = 1; bollX <= totalBolls; bollX++) {//записываем координаты сместившихся на ряд мячей, которые мы видим
            context.fillStyle = colorsBolls[bollY][bollX]
            context.beginPath()
            context.arc((field.offsetLeft+bollRadius*a),(bollRadius*b+stepDown-(bollRadius*2*totalFloors)),bollRadius,0,Math.PI*2, false)
            context.fill() 
            var x = field.offsetLeft+bollRadius*a
            var y = bollRadius*b+stepDown-(bollRadius*2*totalFloors)
            pointBolls[bollY][bollX] = {'x мяча':x,'y мяча':y}                
            a = a+2         
        }
        b = b+2      
    }  

    context.fillStyle = headBollColor
    context.beginPath()
    context.arc(field.offsetWidth/2,(field.offsetHeight-bollRadius),bollRadius,0,Math.PI*2, false)
    context.fill() 
                if (ctg!==0) {
                    if (stopBollX>totalBolls/2) {
                    context.fillStyle = stopColor
                    context.beginPath()
                    context.arc((field.offsetWidth/2+X),((field.offsetHeight-bollRadius) -((field.offsetWidth/2+X)-field.offsetWidth/2)/ctg),bollRadius,0,Math.PI*2, false)//это расчет, если клик по Х после главного мяча
                    context.fill() 
                
                } else if (stopBollX<=totalBolls/2){
                    context.fillStyle = stopColor
                    context.beginPath()
                    context.arc((field.offsetWidth/2-X),((field.offsetHeight-bollRadius) -(field.offsetWidth/2-(field.offsetWidth/2-X))/ctg),bollRadius,0,Math.PI*2, false)//это расчет, если клик по Х после главного мяча
                    context.fill() 
                }  
                } 

}



var stepDown = 0//скорость движения игры
function getStart() {
    createPointColor()//что-то удаляет сразу??
    field.addEventListener('click',findColor,false)

    field.addEventListener('touchstart',findVibro,false)//тач событие
    // field.addEventListener('click',findVibro,false)//тач событие

    field.addEventListener('mousemove',mouseOverMove,false)//вмето ховера
} 

function findVibro(eo) {

    for ( let t=0; t<eo.changedTouches.length; t++ ) {
        var eoX = eo.changedTouches[t].pageX;
        var eoY =eo.changedTouches[t].pageY;
        for (let bollY= 1; bollY <= totalFloors; bollY++) {
            for (let bollX = 1; bollX <= totalBolls; bollX++) {
                alert(`по Х ${eoX}, по Y ${eoY},${pointBolls[bollY][bollX]['x мяча']},${pointBolls[bollY][bollX]['y мяча']}`)
                if (eoX>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {
                    if (colorsBolls[bollY][bollX]===stopColor) {
                        window.navigator.vibrate(200)
                     }
                }
            }
        }   
    }
}


setInterval(tick,40);
function tick() { 
    if (stepDown>=0.3) {
        stepDown+=0.3 

    } else if(stepDown===field.offsetHeight-bollRadius*2){
        stepDown=0  

    }
    countTable.innerHTML = `Ваш счет:${counter}`


    if (stopBollX!==0&&stopBollY!==0&&colorsBolls[stopBollY][stopBollX]!==bollColors[6]&&move!==1) {//написать боле логично!!!!!!!! move!==1-чтобы звук не включаля повторно
            if (stopBollX>totalBolls/2){
                if ((field.offsetWidth/2+X)<pointBolls[stopBollY][stopBollX]['x мяча']) {
                    if(ctg>0.3){
                        X=X+50 
                    }else{
                        X=X+20
                    }
                }  
                else if((field.offsetWidth/2+X)>=pointBolls[stopBollY][stopBollX]['x мяча']) {   
                    sharik.play()                               
                    X=0
                    ctg = 0 
                    changeColor()
                }      
            } else  if (stopBollX<=totalBolls/2){
                     if ((field.offsetWidth/2-X)>pointBolls[stopBollY][stopBollX]['x мяча']) {
                        if(ctg>0.3){
                            X=X+50
                        }else{
                            X=X+10
                        }
                 }  
                    else if((field.offsetWidth/2-X)<=pointBolls[stopBollY][stopBollX]['x мяча']) {
                    sharik.play()                               
                     X=0
                     ctg = 0 
                     changeColor()
                 }   
            }   
    }
   

fieldCreate ()

            if ((pointBolls[totalFloors][totalBolls]['y мяча'])>field.offsetHeight-bollRadius*4) {//осановка игры -пересмотреть остановку!!!
                stepDown=field.offsetHeight-bollRadius*2
                context.fillStyle='black';
                context.font=`italic bold 20px Arial` 
                context.textAlign='center';         
                context.fillText('Вы проиграли!',field.width/2,field.height/2);
                field.removeEventListener('click',findColor,false)
                field.removeEventListener('mousemove',mouseOverMove,false)//вмето ховера 
                // if (stepDown===field.offsetHeight-bollRadius*2) {
                //     sendRecords()
                //     stepDown+=0.0001
                // }  
            }

            var countYellowBolls = 0
            for (let bollY = 1; bollY <= totalFloors; bollY++) {
                for (let bollX = 1; bollX <= totalBolls; bollX++) {
                    if (colorsBolls[bollY][bollX] === bollColors[6]) {
                        countYellowBolls++
                    }
                }
            }  
            if (countYellowBolls===(totalBolls*totalFloors)) {
            context.fillStyle='black';
            context.font=`italic bold 20px Arial` 
            context.textAlign='center';         
            context.fillText('Вы выиграли!',field.width/2,field.height/2);
            }



//отрисовка для ховер  - но не меняется, если мышь остановилась
            for (let bollY = 1; bollY <= totalFloors; bollY++) {
                for (let bollX = 1; bollX <= totalBolls; bollX++) {
                    if (pointBolls[bollY][bollX]['x мяча']===line[0]&&pointBolls[bollY][bollX]['y мяча']===line[1]) {
                        colorHover=colorsBolls[bollY][bollX]
                        }
                    }
                }
            
            context.strokeStyle = colorHover
            context.lineWidth=3;
            context.beginPath();
            context.moveTo(field.offsetWidth/2,field.offsetHeight-bollRadius*2);
            context.lineTo(line[0],line[1]);
            context.stroke();


                

                //ищу нижний желтый ряд и отсекаю его из счета, но он убирает этот ряд, только если последний ряд убрал
                // var yellowFlors = totalFloors
                // var yellowFlorsBolls = 0
                // for (let bollX=1; bollX<=totalBolls; bollX++) {
                //     if (colorsBolls[bollX][yellowFlors]===bollColors[6]) {
                //         yellowFlorsBolls++
                //     }  
                // }                    
                // if (yellowFlorsBolls===totalBolls) {
                //     yellowFlors--
                // }                
                

}





