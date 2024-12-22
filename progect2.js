'use strict'


document.body.style.margin = 0// 40+'px'почему все получае -40???
var field=document.getElementById('Table');
var context=field.getContext('2d');
// var bollRadius = 30 //нельзя ризиновый???
var bollRadius = document.getElementById('Table1').offsetWidth
var totalBolls = 9
var totalFloors = 10
field.width = (bollRadius*2)*totalBolls
field.height = (bollRadius*2)*totalFloors+(bollRadius*2)
field.style.border = '1px solid black'
// var headBollPlace = (totalBolls/2)*(bollRadius*2)

//координаты клика мыши по полю

// field.addEventListener('click',drawBoll,false)
// function drawBoll(eo) {
//     eo = eo||window.event
//     var clickMouseX = eo.pageX-40;
//     var clickMouseY = eo.pageY-40;
// for (let k = 1; k <= Object.keys(pointFirstFloor).length; k++) {
//     if (clickMouseX>=pointFirstFloor[k]['x мяча']&&clickMouseX<=(pointFirstFloor[k]['x мяча']+(bollRadius*2))&&clickMouseY>=pointFirstFloor[k]['y мяча']&&clickMouseY<=(pointFirstFloor[k]['y мяча']+(bollRadius*2))){
//     context.clearRect(0,0,field.width,field.height)//перерисовываем
//     context.fillStyle='yellow';
//     context.fillRect(0,0,field.width,field.height);
//     let bollC = 1; 
//     let boll = 0;
//     for (let i = 1; i <=totalBolls; i++) {//нашла нужный по клику мяч и перерисовала его, пока просто для проверки
//         if (i===k) {
//             context.fillStyle = 'white'
//             context.beginPath()
//             context.arc((field.offsetLeft+bollRadius-40+boll),(field.offsetTop+bollRadius-40),bollRadius,0,Math.PI*2, false)
//             context.closePath()
//             context.closePath()
//             context.fill()
//             pointFirstFloor[bollC] = 
//             {'x мяча':(field.offsetLeft+bollRadius-40+boll-bollRadius),
//             'y мяча':(field.offsetTop+bollRadius-40-bollRadius),
//             }
//             boll+=bollRadius*2
//             bollC++   
//         }
//         context.fillStyle = bollColors[bollColorsFlor[bollC]]
//         context.beginPath()
//         context.arc((field.offsetLeft+bollRadius-40+boll),(field.offsetTop+bollRadius-40),bollRadius,0,Math.PI*2, false)
//         context.closePath()
//         context.closePath()
//         context.fill()
//         pointFirstFloor[bollC] = 
//         {'x мяча':(field.offsetLeft+bollRadius-40+boll-bollRadius),
//         'y мяча':(field.offsetTop+bollRadius-40-bollRadius),
//         }
//         boll+=bollRadius*2
//         bollC++ 
//         }   
//     } 
// }
// }

field.addEventListener('click',drawBoll,false) // проваерить, почему иногда исчезает главный шар и добавить совпадение по цветам шариков с главным шаром
function drawBoll(eo) {
    eo = eo||window.event
    var clickMouseX = eo.pageX;
    var clickMouseY = eo.pageY;

for (let i = 1; i <=totalBolls; i++) {
   for (let k= 0; k < totalFloors; k++) {
    
    if (clickMouseX>=pointFirstFloorStart[i][i][k]['x мяча']-bollRadius&&clickMouseX<=(pointFirstFloorStart[i][i][k]['x мяча']+bollRadius)&&clickMouseY>=pointFirstFloorStart[i][i][k]['y мяча']-bollRadius&&clickMouseY<=(pointFirstFloorStart[i][i][k]['y мяча']+bollRadius)){
        console.log('попал');
        context.clearRect(0,0,field.width,field.height)//перерисовываем
        context.fillStyle='yellow';
        context.fillRect(0,0,field.width,field.height);



        let bollC = 1; 
        let boll = 0;        
    for (let i = 1; i <=totalBolls; i++) {
        var b = 1
        for (let k= 9; k >= 0; k--) {

                context.fillStyle =bollColorsFlor[i][i][k]//рисуем шарики
                context.beginPath()
                context.arc((field.offsetLeft+bollRadius+boll),(field.offsetTop+bollRadius*b),bollRadius,0,Math.PI*2, false)
                context.fill() 
                b=b+2 
        }
            boll+=bollRadius*2
            bollC++ 
            }

            if (bollColorsFlor[i][i][k]===bollColorHead[0]) {
            context.fillStyle ='yellow'//рисуем шарик, по которому попали мышью
            context.beginPath()
            context.arc((pointFirstFloorStart[i][i][k]['x мяча']),(pointFirstFloorStart[i][i][k]['y мяча']),bollRadius+0.6,0,Math.PI*2, false)
            context.fill() 
            bollColorsFlor[i][i][k] = 'yellow'
            bollColorHead[0] = bollColors[randomDiap(1,5)]
            } else {
                context.fillStyle =bollColorHead[0] 
                context.beginPath()
                context.arc((pointFirstFloorStart[i][i][k]['x мяча']),(pointFirstFloorStart[i][i][k]['y мяча']+bollRadius*2),bollRadius,0,Math.PI*2, false)
                context.fill()  
                // var pointFloor = []//нужно не совпадающий  мяч сохранить в объект мячей
                // var x = pointFirstFloorStart[i][i][k]['x мяча']
                // var y = pointFirstFloorStart[i][i][k]['y мяча']+bollRadius*2
                // pointFloor.unshift({'x мяча':x,'y мяча':y})
                // pointFirstFloorStart[i+1] = {[i]:pointFloor}
                // console.log(pointFirstFloorStart[i]);
                
                bollColorHead[0] = bollColors[randomDiap(1,5)]
            }

            context.fillStyle =bollColorHead[0] 
            context.beginPath()
            context.arc(field.offsetWidth/2,(field.offsetHeight-bollRadius),bollRadius,0,Math.PI*2, false)
            context.fill()  
    
  
    }
}
}
}


//координаты первого ряда мячей 
var pointFirstFloor = {}
var pointFirstFloorStart = {}

//рандомный цвет
var bollColors = {
    1:'green',
    2:'grey',
    3:'red',
    4:'violet',
    5:'black',
    6:'yellow'
}
var bollColorsFlor = {}

var bollColorHead = {}

function randomDiap(n,m) {
    return Math.floor(
      Math.random()*(m-n+1)
      )+n;
  }
  
//отрисовка при запуске
function fieldCreate () {
    context.fillStyle='yellow';//поле
    context.fillRect(0,0,field.width,field.height);
    let bollC = 1; 
    let boll = 0;
    
for (let i = 1; i <=totalBolls; i++) {
    bollColorsFlor[i] = {}
    var numberFloor = []
    pointFirstFloorStart[i] = {}
    var pointFloor = []
    var x= 0
    var y = 0
    var c =1
    for (let b = 1; b <=(totalFloors*2); b=b+2) {
        var colorBoll = randomDiap(1,5)
        context.fillStyle =bollColors[colorBoll]//рисуем шарик
        context.beginPath()
        context.arc((field.offsetLeft+bollRadius+boll),(field.offsetTop+bollRadius*b),bollRadius,0,Math.PI*2, false)
        context.fill() 
        numberFloor.unshift(bollColors[colorBoll])
        x = field.offsetLeft+bollRadius+boll
        y = field.offsetTop+bollRadius*b
        pointFloor.unshift({'x мяча':x,'y мяча':y})

        // pointFirstFloorStart[i] = //запомнить координаты каждого мяча!!!!
        //     {'x мяча':(field.offsetLeft+bollRadius-40+boll-bollRadius),
        //     'y мяча':(field.offsetTop+bollRadius-40+oneTick-bollRadius),
        //     }  
        c++
    }
        bollColorsFlor[i] = {[i]:numberFloor}
        pointFirstFloorStart[i] = {[i]:pointFloor}
        boll+=bollRadius*2
        bollC++ 
        }
        context.fillStyle =bollColors[colorBoll]//наверно нужен прелоад, так как при загрузке  - шарик спрятан наполовину
        bollColorHead[0] = bollColors[colorBoll]//сохраняем полученный цвет рда
        context.beginPath()
        context.arc(field.offsetWidth/2,(field.offsetHeight-bollRadius),bollRadius,0,Math.PI*2, false)
        context.fill()   
        
    }

       

    fieldCreate()
    
    
    var lastHeadBoll = 0
    // var int = setInterval(tick,1000);
    var oneTick = bollRadius*2
    var step = 0
    var colorHeadStep = {}



    // field.addEventListener('click',drawBollStart,false)
    // function drawBollStart(eo) {
          
    //     eo = eo||window.event
    //     var clickMouseX = eo.pageX-40;
    //     var clickMouseY = eo.pageY-40;

    // for (let k = 1; k <= Object.keys(pointFirstFloorStart).length; k++) {   
    //     if (clickMouseX>=pointFirstFloorStart[k]['x мяча']&&clickMouseX<=(pointFirstFloorStart[k]['x мяча']+(bollRadius*2))&&clickMouseY>=pointFirstFloorStart[k]['y мяча']&&clickMouseY<=(pointFirstFloorStart[k]['y мяча']+(bollRadius*2))){
    //     step++//считаем клики по мячам в ряду
    //     context.clearRect(0,0,field.width,field.height)//перерисовываем
    //     context.fillStyle='yellow';
    //     context.fillRect(0,0,field.width,field.height);
    //     var colorBoll = randomDiap(1,5)
    //     context.fillStyle =bollColors[colorBoll]//это главный мячик
    //     colorHeadStep[step] = bollColors[bollColorHead[0]]//сохраняем цвет последней смены шара
    //     bollColorHead[0] = colorBoll//сохраняем полученный цвет 
    //     context.beginPath()
    //     context.arc(field.offsetWidth/2,(field.offsetHeight-bollRadius),bollRadius,0,Math.PI*2, false)
    //     context.fill()
    //     let bollCeo = 1; 
    //     let bolleo = 0;        
    //     for (let i = 1; i <=totalBolls; i++) {//нашла нужный по клику мяч и перерисовала его, пока просто для проверки
    //         if (i===k) {
    //             console.log(bollColors[lastHeadBoll],bollColors[bollColorsFlor[bollCeo]]);
    //             if (bollColors[lastHeadBoll]===bollColors[bollColorsFlor[bollCeo]]) {
    //                 context.fillStyle= 'yellow'
    //                 context.beginPath()
    //                 context.arc((pointFirstFloor[i]['x мяча']+bollRadius),(pointFirstFloorStart[i]['y мяча']+bollRadius),bollRadius,0,Math.PI*2, false)
    //                 context.fill()
    //                 context.fillStyle = 'yellow'//по клику бросаем мячик к указанным координатам нминус один ряд. но нужно не минус 1 ряд, а минус последний ряд!!!!!! исправить
    //                 context.beginPath()
    //                 context.arc((pointFirstFloor[i]['x мяча']+bollRadius),(pointFirstFloorStart[i]['y мяча']+bollRadius*3),bollRadius,0,Math.PI*2, false)
    //                 context.fill()
    //                 console.log(bollColorsFlor[k]=6);//после этого новый мяч снизу стал желтым
    //                 // lastHeadBoll = bollColorHead[0] 

    //             } else {
    //                 if(bollColors[bollColorsFlor[bollCeo]]!=='yellow'){
    //             context.fillStyle = bollColors[bollColorsFlor[bollCeo]]
    //             context.beginPath()
    //             context.arc((pointFirstFloor[i]['x мяча']+bollRadius),(pointFirstFloorStart[i]['y мяча']+bollRadius),bollRadius,0,Math.PI*2, false)
    //             context.fill()
    //             context.fillStyle =colorHeadStep[step]//по клику бросаем мячик к указанным координатам нминус один ряд. но нужно не минус 1 ряд, а минус последний ряд!!!!!! исправить
    //             context.beginPath()
    //             context.arc((pointFirstFloor[i]['x мяча']+bollRadius),(pointFirstFloorStart[i]['y мяча']+bollRadius*3),bollRadius,0,Math.PI*2, false)
    //             context.fill()
    //             } else {
    //                 context.fillStyle =colorHeadStep[step]//по клику бросаем мячик к указанным координатам нминус один ряд. но нужно не минус 1 ряд, а минус последний ряд!!!!!! исправить
    //                 context.beginPath()
    //                 context.arc((pointFirstFloor[i]['x мяча']+bollRadius),(pointFirstFloorStart[i]['y мяча']+bollRadius),bollRadius,0,Math.PI*2, false)
    //                 context.fill()
    //             }
    //         }
    //             bolleo+=bollRadius*2
    //             bollCeo++  
    //         } else {
    //         context.fillStyle = bollColors[bollColorsFlor[bollCeo]]
    //         context.beginPath()
    //         context.arc((pointFirstFloorStart[i]['x мяча']+bollRadius),(pointFirstFloorStart[i]['y мяча']+bollRadius),bollRadius,0,Math.PI*2, false)
    //         context.fill()
    //         bolleo+=bollRadius*2
    //         bollCeo++ 
    //         }
    //         }   
    //     } 
    // }

    // }  
    

    function tick() {

        // let bollC = 1; 
        context.clearRect(0,0,field.width,field.height)
        context.fillStyle='yellow';
        context.fillRect(0,0,field.width,field.height);
        var boll = 0

        context.fillStyle =bollColors[bollColorHead[0]]//это главный мячик
        context.beginPath()
        context.arc(field.offsetWidth/2,(field.offsetHeight-bollRadius),bollRadius,0,Math.PI*2, false)
        context.fill()  


        var changeStep  = bollRadius*2
        // {for (let i = 0; i <= totalBolls; i++) {//строим первый ряд шариков

        //     context.fillStyle = bollColors[bollColorsFlor[bollC]]
        //     context.beginPath()
        //     context.arc((field.offsetLeft+bollRadius-40+boll),(field.offsetTop+bollRadius-40+oneTick),bollRadius,0,Math.PI*2, false)
        //     context.fill()
        //     pointFirstFloorStart[bollC] = 
        //     {'x мяча':(field.offsetLeft+bollRadius-40+boll-bollRadius),
        //     'y мяча':(field.offsetTop+bollRadius-40+oneTick-bollRadius),
        //     }   

        //     boll+=bollRadius*2
        //     bollC++
        //     }

        //     oneTick = oneTick+bollRadius*2

        // if (oneTick>=field.height-bollRadius*2) {
        //     oneTick = field.height-(bollRadius*2)*2

        //     context.fillStyle='black';
        //     context.font=`italic bold 20px Arial` 
        //     context.textAlign='center';         
        //     context.fillText('Вы проиграли!',field.width/2,field.height/2);
        //     // colorHeadStep = {} в конце игры - очищать
        // }}

        for (let i = 1; i <=totalBolls; i++) {
            var k = 0
            pointFirstFloorStart[i] = {}
            var pointFloor = []
            var x= 0
            var y = 0
            var b = 1
            for (let k= 9; k >= 0; k--) {
                context.fillStyle=bollColorsFlor[i][i][k]//разворачиваю присваивание цветов
                context.beginPath()
                context.arc((field.offsetLeft+bollRadius+boll),(bollRadius*b+oneTick-(field.offsetHeight-bollRadius*2)),bollRadius,0,Math.PI*2, false)
                context.fill()    
                x = field.offsetLeft+bollRadius+boll
                y = bollRadius*b+oneTick-(field.offsetHeight-bollRadius*2)
                pointFloor.unshift({'x мяча':x,'y мяча':y})
                b = b+2
            }
            pointFirstFloorStart[i] = {[i]:pointFloor}
            boll+=bollRadius*2
            }
            oneTick = oneTick+20
            lastHeadBoll = bollColorHead[0]   
      
        
            if (oneTick>=field.height-bollRadius*2) {
            oneTick = field.height-(bollRadius*2)*2            
            context.fillStyle='black';
            context.font=`italic bold 20px Arial` 
            context.textAlign='center';         
            context.fillText('Вы проиграли!',field.width/2,field.height/2);
            // colorHeadStep = {} в конце игры - очищать
            
        }
    }

    

    


    