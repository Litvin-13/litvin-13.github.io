'use strict'
document.body.style.margin = 0

var newGamer = ''


//var totalFloors = 0//доработать по уровням
// var totalBolls = 0
// var bollRadius = 0
// function getLevel(a,b) {
//     totalFloors = a
//     totalBolls = b
// }
// createPointColor()

// var level = document.getElementById('level')//сделать выбор уровнней  - доработать все
// level.addEventListener('focusout',changeGame,false)
// function changeGame() {
//     if (level[0].selected) {
//         createPointColor()
//         getLevel(10,10)
//         bollRadius = field.offsetWidth/totalBolls/2
//         console.log(totalBolls);
//     } else if (level[1].selected) {
//         createPointColor()
//         getLevel(14,14)
//         bollRadius = field.offsetWidth/totalBolls/2
//         yellowFlors = totalFloors
//         console.log(totalBolls);
//     } else if (level[2].selected) {
//         createPointColor()
//         getLevel(20,20)
//         bollRadius = field.offsetWidth/totalBolls/2
//     } 
// }



//звук взрыва мячика
var sharik = document.getElementsByTagName('audio')[0]
//игровое поле
var field=document.getElementById('Table');
var context=field.getContext('2d');
field.height = document.getElementById('Table1').offsetHeight*0.9
field.width = document.getElementById('Table1').offsetWidth*0.99
var totalBolls = 14//выбирать только четное количество шаров, важно для fieldCreate ()
var totalFloors = 10
var bollRadius = field.offsetWidth/totalBolls/2
createGamer()


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
//характерстики главного шара
var headBollColor = ''
var stopBollX = 0
var stopBollY = 0
var stopColor = ''
//счетчик игры
var countTable= document.getElementsByClassName('forCount')[0]
var counter = 0 
//связь с сервером для хранения рекордов
const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
let records;
let updatePassword;
const stringName='LITVIN_BUBBLEBOLL_RECORDS';
//сохранение движения и цвета
var X = 0
var ctg = 0
var line = []
var colorHover = 0

//создаем нового игрока
class Gamer {
    constructor() {
        this.gamer
    }
    createGamer(){
        this.gamer = prompt('Ваше имя?')
    }
    saveGamer() {
        localStorage.setItem('игрок',JSON.stringify(this.gamer))     
    }
}
function createGamer() {
    if (!localStorage.getItem('игрок')) {
    var newItem = new Gamer()
    newItem.createGamer()
    newItem.saveGamer()
    newGamer = newItem.gamer
    } 
    else 
    newGamer =JSON.parse(localStorage.getItem('игрок')) 
}

function createNewGamer() {
    getStart()
    if (localStorage.getItem('игрок')) {
        localStorage.clear('игрок')
        createGamer() 
    } else 
        createGamer() 
}

//показываем правила
function showRules() {
    alert(
        'Разноцветные шарики плавно опускаются снизу рядами. Внизу есть главный шар, который выбивает шары из появляющегося поля, если совпадает цвет. Как только нижний уровень достигне уровня главного шара - вы проиграли. Если успели выбить все шары - вы выиграли. Шарики можно выбивать только по горизонтали и вертикали от шара, по которому вы попали. Если попали в шар, который не соответсвует цвеиу главного шара - этот шар не исчезает, а меняет свой цвет, при этом шары по вертикали и горизонтали не выбиваются.'
    )
}

//сохранение и вывод рекордов
function sendRecords() {//в конце игры сохраняет рекорды?пока только по кнопке. 
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
        records.push( {name:newGamer,record:counter} );        
        records.sort( (a,b) => b.record-a.record );
        if (records.length>5) {
        records = records.slice(0,5)
        }
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
        )
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
    )
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
        str+=escapeHTML(records[r].name)+": "+ records[r].record+"; "//изменить способ выведения рекордов. Модальное окно?
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

//подбор цветов,координат и отрисовка поля
function createPointColor(){
//обнуление всех сохранений для начала игры
counter = 0 
pointBolls = {}
colorsBolls = {}
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
        for (let bollX = 1; bollX <= totalBolls; bollX++) {
            var colorBoll = bollColors[randomDiap(1,5)] 
            var x = field.offsetLeft+bollRadius*a
            var y = field.offsetTop+bollRadius*b
            pointBolls[bollY][bollX] = {'x мяча':x,'y мяча':y}
            colorsBolls[bollY][bollX]= colorBoll
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

var move = 0//если цвета главного и выбитого шара не совпадают, то указывает, что выбитый шар уже изменил свой цвет (т.е. его не нужно опять сравнивнивать по цвету, выключае повторный звук взрыва)
function changeColor() {
    if (colorsBolls[stopBollY][stopBollX]===stopColor&&move===0) {
        colorsBolls[stopBollY][stopBollX]=bollColors[6]  
        counter++   
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
    var iXLeft = 1//убираем одинаковые шары по X
    while (colorsBolls[stopBollY][stopBollX-iXLeft]===stopColor) {
        colorsBolls[stopBollY][stopBollX-iXLeft] =bollColors[6]
        iXLeft ++
        counter++ 
    }  
    var iXRight = 1
    while (colorsBolls[stopBollY][stopBollX+iXRight]===stopColor) {
        colorsBolls[stopBollY][stopBollX+iXRight] =bollColors[6]
        iXRight ++
        counter++ 
    }
    } else {
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
}

function fieldCreate() {
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
    
    //отрисовка полета шарика к цели
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

function findVibro(eo) {
    for ( let t=0; t<eo.changedTouches.length; t++ ) {
        var eoX = eo.changedTouches[t].pageX;
        var eoY =eo.changedTouches[t].pageY;
        for (let bollY= 1; bollY <= totalFloors; bollY++) {
            for (let bollX = 1; bollX <= totalBolls; bollX++) {
                if (eoX>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {
                    if (colorsBolls[bollY][bollX]!==headBollColor) {
                        window.navigator.vibrate(200)
                     }
                }
            }
        }   
    }
}

function getStart() {   
    if (localStorage.getItem('игрок')) {
        stepDown=0.3  
        createPointColor()//что-то удаляет сразу??
        field.addEventListener('click',findColor,false)
        field.addEventListener('touchstart',findVibro,false)//тач событие
        field.addEventListener('mousemove',mouseOverMove,false)
        } 
    else createGamer()
} 

function gameOver(result) {
    context.fillStyle='black';
    context.font=`italic bold 20px Arial` 
    context.textAlign='center';         
    context.fillText(result,field.width/2,field.height/2);
    field.removeEventListener('click',findColor,false)
    field.removeEventListener('mousemove',mouseOverMove,false)
    field.removeEventListener('touchstart',findVibro,false)//тач событие 
}
//отрисовка для ховер
function createLine() {
    if (colorHover!==bollColors[6]) {
        context.strokeStyle = colorHover
        context.lineWidth=3;
        context.beginPath();
        context.moveTo(field.offsetWidth/2,field.offsetHeight-bollRadius*2);
        context.lineTo(line[0],line[1]);
        context.stroke();   
    }
}

var yellowFlors = totalFloors
var stepDown = 0//скорость движения игры
setInterval(tick,40);

function tick() { 
    fieldCreate()
    createLine()
    if (stepDown>=0.3) {
        stepDown+=0.3 
    } 
    countTable.innerHTML = `Ваш счет:${counter}`

    //полет мячика
    if (stopBollX!==0&&stopBollY!==0&&colorsBolls[stopBollY][stopBollX]!==bollColors[6]&&move!==1) {//написать боле логично!!!!!!!! move!==1-чтобы звук не включаля повторно
        if (stopBollX>totalBolls/2){//шарик летит вправо
            if ((field.offsetWidth/2+X)<pointBolls[stopBollY][stopBollX]['x мяча']) {
                if(ctg>0.3){
                    X=X+50 
                    }else{
                    X=X+20
                    }
            }  else if((field.offsetWidth/2+X)>=pointBolls[stopBollY][stopBollX]['x мяча']) {   
                    sharik.play()                               
                    X=0
                    ctg = 0 
                    changeColor()
            }      
        } else  if (stopBollX<=totalBolls/2){//шарик летит влево
                if ((field.offsetWidth/2-X)>pointBolls[stopBollY][stopBollX]['x мяча']) {
                    if(ctg>0.3){
                    X=X+50
                    }else{
                    X=X+20
                    }
            }  else if((field.offsetWidth/2-X)<=pointBolls[stopBollY][stopBollX]['x мяча']) {
                    sharik.play()                               
                    X=0
                    ctg = 0 
                    changeColor()
            }   
        }   
    }
    
    //конец игры         
    var countYellowBolls = 0
    for (let bollY = 1; bollY <= totalFloors; bollY++) {
        for (const key in colorsBolls[bollY]) {
            if (colorsBolls[bollY][key]===bollColors[6]) {
                countYellowBolls++
            }
        }
    }  
    if (countYellowBolls===(totalBolls*totalFloors)) {
        gameOver('Вы выиграли!')
        yellowFlors=totalFloors
     } else { if ((pointBolls[yellowFlors][totalBolls]['y мяча'])>field.offsetHeight-bollRadius*3) {
                var countYellowBollsInFloor = 0
                for (const key in colorsBolls[yellowFlors]) {
                    if (colorsBolls[yellowFlors][key]===bollColors[6]) {
                        countYellowBollsInFloor++
                    }
                }
                if (countYellowBollsInFloor===totalBolls) {
                    yellowFlors--
                } else if (countYellowBollsInFloor!==totalBolls){
                        gameOver('Вы проиграли!')
                        stepDown+=10
                        }
                } 
            }    
}
