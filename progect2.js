'use strict'


//получение случайного цвета 
function randomDiap(n,m) {
    return Math.floor(
      Math.random()*(m-n+1)
      )+n;
}
var bollColors = {
    1:'#CD5C5C',
    2:'#98FB98',
    3:'#66CDAA',
    4:'#BC8F8F',
    5:'#808080',
    6:'#F0FFFF'
}

document.body.style.backgroundColor = bollColors[6]
document.body.style.margin = 0
document.body.style.fontFamily = 'monospace'
document.body.style.fontSize = 2+'vh'
var button = document.querySelectorAll('button')
button.forEach(function(item) {
    item.style.padding = 0.5 +'vh'
    item.style.fontSize = 2+'vh'
    item.style.borderRadius = 10+'px'
    item.style.backgroundColor = 'white'
    item.style.marginLeft = 1+'%'
    item.style.cursor = 'pointer'
    item.style.fontFamily = 'monospace'
  });

//игровое поле
var field=document.getElementById('Table');
var context=field.getContext('2d');
field.style.display = 'block'
field.style.margin='0 auto'
var tableHeight = document.getElementById('Table1').offsetHeight
var tableWidth = document.getElementById('Table1').offsetWidth
var screen = tableWidth/tableHeight

if (screen>=1) {
    field.height = document.getElementById('Table1').offsetHeight*0.9
    field.width = field.height
    }else{
    field.width = document.getElementById('Table1').offsetWidth
    field.height = field.width*0.9
    }

//звук взрыва мячика
var sharik = document.getElementsByTagName('audio')[0]

var totalFloors = 0
var totalBolls = 0//выбирать только четное количество шаров, важно для fieldCreate ()
var bollRadius = 0
var yellowFloors = 0

//скрыть меню - тач вправо на мобильном
var menuDiv = document.getElementById('menu')
var touchRight = 0
menuDiv.addEventListener('touchstart', eo => touchRight = eo.changedTouches[0].clientX,false)
menuDiv.addEventListener('touchend', changeColorMove,false)
function changeColorMove(eo) {
    if (eo.changedTouches[0].clientX-touchRight>field.width/5) {
        menuDiv.style.display = 'none'
        document.getElementById('forMenu').style.display = "block" 
    }
}
function menuDisplay() {
    menuDiv.style.display = 'block'
    document.getElementById('forMenu').style.display = "none"
}

//вибираем уровни
var level = document.querySelectorAll('input')
level.forEach(element => {
    element.addEventListener('change',changeLevel,false)
});
function getLevel(a,b) {  
    totalFloors = a
    totalBolls = b
    yellowFloors = totalFloors
    stepDown=0
    createPointColor()
}
function changeLevel(eo) {
    eo=eo||window.event   
    if (eo.target.value==='level1') {
        getLevel(10,10)
    } else if (eo.target.value==='level2') {
        getLevel(14,14)
    } else if (eo.target.value==='level3') {
        getLevel(20,20)
    } 
}

//координаты и цвета мячей
var pointBolls = {}
var colorsBolls = {}

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
var newGamer = ''
class Gamer {
    constructor() {
        this.gamer
    }
    getGamer(){
        this.gamer = prompt('Ваше имя?')
    }
    saveGamer() {
        localStorage.setItem('игрок',JSON.stringify(this.gamer))     
    }
}
window.addEventListener('load',createGamer,false)
function createGamer() {
    if (!localStorage.getItem('игрок')) {
    var newItem = new Gamer()
    newItem.getGamer()
    newItem.saveGamer()
    newGamer = newItem.gamer
    } 
    else 
    newGamer =JSON.parse(localStorage.getItem('игрок')) 
}
function createNewGamer() {
    if(stepDown>0.3) {
    var agree =  confirm('Вы хотите потерять данные?') 
        if (agree === true) {
            stepDown=0
            if (localStorage.getItem('игрок')) {
                localStorage.clear('игрок')
                createGamer() 
            } else 
                createGamer()
        } 
    } else {
            stepDown=0
            if (localStorage.getItem('игрок')) {
                localStorage.clear('игрок')
                createGamer() 
            } else 
                createGamer()
    }
}

//показываем правила
function showRules() {
    document.getElementById('rules').style.display='block';
    document.getElementById('forTopic').innerHTML = 'Разноцветные шарики плавно опускаются снизу рядами. Внизу есть главный шар, который выбивает шары из появляющегося поля, если совпадает цвет. Как только нижний уровень достигне уровня главного шара - вы проиграли. Если успели выбить все шары - вы выиграли. Шарики можно выбивать только по горизонтали и вертикали от шара, по которому вы попали. Если попали в шар, который не соответсвует цвету главного шара - этот шар не исчезает, а меняет свой цвет, при этом шары по вертикали и горизонтали не выбиваются.'
}
function closeRules() {
    document.getElementById('rules').style.display='none';
}      
function modalWindowClick(eo) {
    eo.stopPropagation();
}

//сохранение и вывод рекордов
function sendRecords() {
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
    )
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
    if (callresult.error!=undefined)
        alert(callresult.error);
}

function getRecords() {
    $.ajax( {
        url : ajaxHandlerScript,
        type : 'POST', dataType:'json',
        data : { f : 'READ', n : stringName },
        cache : false,
        success : readReady,
        error : errorHandler}
    )
}
    
function readReady(callresult) {
    document.getElementById('records').style.display='block';
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
        str+=escapeHTML(records[r].name)+": "+ records[r].record+"<br>"
    } 
    document.getElementById('forResult').innerHTML = str
  }
}

function closeRecords() {//закрываем модальное окно с рекордами
document.getElementById('records').style.display='none';
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
            var x =bollRadius*a
            var y = field.offsetTop+bollRadius*b
            pointBolls[bollY][bollX] = {'x мяча':x,'y мяча':y}
            colorsBolls[bollY][bollX]= colorBoll
            a = a+2             }
        b = b+2
    }  
    headBollColor = colorBoll//сохраняем полученный цвет главного шарика

    field.addEventListener('click',findColor,false)
    field.addEventListener('touchstart',findVibro,false)
    field.addEventListener('mousemove',mouseOverMove,false) 
}

//находит мяч на поле по клику мыши
function findColor(eo) {
    eo = eo||window.event
    var eoX = eo.pageX;
    var eoY =eo.pageY;
    X=0
    move=0
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        for (let bollX = 1; bollX <= totalBolls; bollX++) {
            if (eoX-field.getBoundingClientRect().left>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX-field.getBoundingClientRect().left<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {
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
    sharik.play() 
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
        if (counter>0) {
            counter--
        }
        move=1
    }
}

//отслеживаем, по каким ширикам движется мышь и меняем цвет указывающей линии
function mouseOverMove(eo) {
   eo = eo||window.event
    var eoX = eo.pageX;
    var eoY =eo.pageY;
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        for (let bollX = 1; bollX <= totalBolls; bollX++) {
            if (eoX-field.getBoundingClientRect().left>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX-field.getBoundingClientRect().left<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {                      
            line = [pointBolls[bollY][bollX]['x мяча'],pointBolls[bollY][bollX]['y мяча']]
            colorHover = colorsBolls[bollY][bollX]
            }
        }
    }  
}

//отрисовка для указывающей линии
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

function fieldCreate() {
    tableHeight = document.getElementById('Table1').offsetHeight
    tableWidth = document.getElementById('Table1').offsetWidth
    screen = tableWidth/tableHeight
    if (screen>=1) {
        field.height = document.getElementById('Table1').offsetHeight*0.9
        field.width = field.height
        }else{
        field.width = document.getElementById('Table1').offsetWidth
        field.height = field.width*0.9
        }

    bollRadius = field.offsetWidth/totalBolls/2
    context.fillStyle=bollColors[6];//поле
    context.fillRect(0,0,field.width,field.height);          
    var b = 1
    for (let bollY= 1; bollY <= totalFloors; bollY++) {
        var a = 1
        for (let bollX = 1; bollX <= totalBolls; bollX++) {//записываем координаты сместившихся на ряд мячей, которые мы видим
            context.fillStyle = colorsBolls[bollY][bollX]
            context.beginPath()
            context.arc((bollRadius*a),(bollRadius*b+stepDown-(bollRadius*2*totalFloors)),bollRadius,0,Math.PI*2, false)
            context.fill() 
            var x = bollRadius*a
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

//находим шарик, по которому нажали на тачскрине и если цвет мяча не соответсвует цвету главного мяча - виброотклик
function findVibro(eo) {
    for ( let t=0; t<eo.changedTouches.length; t++ ) {
        var eoX = eo.changedTouches[t].pageX;
        var eoY =eo.changedTouches[t].pageY;
        for (let bollY= 1; bollY <= totalFloors; bollY++) {
            for (let bollX = 1; bollX <= totalBolls; bollX++) {
                if (eoX-field.getBoundingClientRect().left>pointBolls[bollY][bollX]['x мяча']-bollRadius&&eoX-field.getBoundingClientRect().left<pointBolls[bollY][bollX]['x мяча']+bollRadius&&eoY>pointBolls[bollY][bollX]['y мяча']-bollRadius&&eoY<pointBolls[bollY][bollX]['y мяча']+bollRadius) {
                    if (colorsBolls[bollY][bollX]!==headBollColor) {
                        window.navigator.vibrate(200)
                     }
                }
            }
        }   
    }
}


function getStart() { 
if(totalFloors===0){
    alert('Выберете уровень игры')
} else {
    if (localStorage.getItem('игрок')) {
        if(stepDown>0.3) { 
           var agree =  confirm('Вы хотите потерять данные?')
           if (agree === true) {
            stepDown=0.3  
            createPointColor()
            }
        }  else {
            stepDown=0.3  
            createPointColor()
        }
        } 
    else createGamer()
}
} 

function gameOver(result) {
    context.fillStyle='black';
    context.font=`italic bold 20px Arial` 
    context.textAlign='center';         
    context.fillText(result,field.width/2,field.height/2);
    field.removeEventListener('click',findColor,false)
    field.removeEventListener('mousemove',mouseOverMove,false)
    field.removeEventListener('touchstart',findVibro,false)
    if (result==='Вы выиграли!'&&stepDown>0) {
        sendRecords()
    }
}

//полет мячика
function flyBoll(){
    if (stopBollX!==0&&stopBollY!==0&&colorsBolls[stopBollY][stopBollX]!==bollColors[6]&&move!==1) {//написать боле логично!!!!!!!! move!==1-чтобы звук не включаля повторно
        if (stopBollX>totalBolls/2){//шарик летит вправо
            if ((field.offsetWidth/2+X)<pointBolls[stopBollY][stopBollX]['x мяча']) {
                if(ctg>0.3){
                    X=X+50 
                    }else{
                    X=X+20
                    }
            }  else if((field.offsetWidth/2+X)>=pointBolls[stopBollY][stopBollX]['x мяча']) {   
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
                    X=0
                    ctg = 0 
                    changeColor()
            }   
        }   
    }
}

//перезагруза страницы
window.onbeforeunload=befUnload;
function befUnload(eo) {
  eo=eo||window.event;
  if ( stepDown>0.3 )
    eo.returnValue='Игра не закончена!';
}

var stepDown = 0//скорость движения игры
setInterval(tick,40);
function tick() { 
    if (stepDown>=0.3) {
        stepDown+=(field.offsetHeight*0.0003)
    } 
    countTable.innerHTML = `Игрок:${newGamer}. Ваш счет:${counter}`
    fieldCreate()
    createLine() 
    flyBoll() 

    //конец игры         
    var countYellowBolls = 0
    for (let bollY = 1; bollY <= totalFloors; bollY++) {
        for (const key in colorsBolls[bollY]) {
            if (colorsBolls[bollY][key]===bollColors[6]) {
                countYellowBolls++
            }
        }
    }  
    if (countYellowBolls!==0&&countYellowBolls===(totalBolls*totalFloors)) {//&&counter!==0 - привязать к другому значению
        gameOver('Вы выиграли!')
        yellowFloors=totalFloors 
        stepDown=0
     } else {     
        if (totalBolls!==0&&(pointBolls[yellowFloors][totalBolls]['y мяча'])>field.offsetHeight-bollRadius*3) {
                var countYellowBollsInFloor = 0
                for (const key in colorsBolls[yellowFloors]) {
                    if (colorsBolls[yellowFloors][key]===bollColors[6]) {
                        countYellowBollsInFloor++
                    }
                }
                if (countYellowBollsInFloor===totalBolls) {
                    yellowFloors--
                } else if (countYellowBollsInFloor!==totalBolls){
                        gameOver('Вы проиграли!')
                        stepDown+=10
                        if ((pointBolls[1][totalBolls]['y мяча'])>field.offsetHeight-bollRadius*3) {
                        stepDown=0
                        }
                    }
                } 
            }    

}


