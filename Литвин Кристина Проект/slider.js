var slid  = document.getElementsByClassName('slid');
console.log(slid);

var indexSlid = 0;

function nextSlid() {
    indexSlid = indexSlid + 1;
    showSlider();

}

function prevSlid() {
    indexSlid = indexSlid - 1;
    showSlider();
}

function showSlider() {
    if (indexSlid === slid.length) {
        indexSlid = 0;
    }

    if (indexSlid < 0) {
        indexSlid = slid.length-1;
    }

    for (let i = 0; i < slid.length; i++) {
        slid[i].style.display = 'none';
    }
    slid[indexSlid].style.display = 'block';

}

showSlider()
