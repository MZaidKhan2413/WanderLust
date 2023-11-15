let taxtoggeler = document.getElementById('flexSwitchCheckDefault');
let taxes = document.getElementsByClassName('gst-tax');
taxtoggeler.addEventListener('click', ()=>{
    for(let tax of taxes) {
        if (tax.style.display === "inline") {
            tax.style.display = "none";
        } else {
            tax.style.display = "inline";
        }
    }
});