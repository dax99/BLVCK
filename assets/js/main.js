$( document ).ready(function() {
    dohvatiProizvode();
    dohvatiSocial();
    dohvatiKategorije();
    if(window.location.href.endsWith("cart.html")){
        $("[type='number']").keypress(function (evt) {
            evt.preventDefault();
        });
        dohvatiCart()
    }
    else if(window.location.href.endsWith("item.html")){
        dohvatiProizvod();
    }
});
function dohvatiCart(){    
    let proizvodiLocal=JSON.parse(localStorage.getItem("proizvodi"));
    $.ajax({
        url:"assets/data/products.json",
        method:"GET",
        dataType:"json",
        success:function(data){            
            data=data.filter(p=> {
                for(prod of proizvodiLocal){
                    if(p.id==prod.id){
                        p.quantity=prod.quantity;
                        p.size=prod.size;
                        return true
                    }
                }
                return false
            })
            ispisiCart(data)
            
        },
        error:function(status){
            alert(status)
        }
    })
}
function ispisiCart(proizvodi){
    let proizvodiLocal=JSON.parse(localStorage.getItem("proizvodi"))
    let selectedItems=`
    Selected items(${proizvodiLocal.length})
    `
    $('#naslovCart').html(selectedItems)
    let ispis=`
    <div class="col-12 col-lg-6">
                 <table class="text-center table-striped table-responsive-xl mb-4">
                     <thead class="borderr ">
                         <th class=" p-4">
                             Product
                         </th>
                         <th class=" p-4">
                            Size
                        </th>
                         <th class=" p-4">
                            Price
                        </th>
                        <th class=" p-4">
                            Quantity
                        </th>
                        <th class=" p-4">
                            Total
                        </th>
                        <th>
                            
                        </th>
                     </thead>
                     <tbody class="p-4 mt-2 ">
    `
     let value=0
     for(let l of proizvodiLocal){       
        for(p of proizvodi){           
            if(l.id==p.id){
                value+=l.quantity*p.price
                ispis+=`
                <tr>
                    <td class="pt-2">
                        <img src="assets/img/${p.photos[0].src}" alt="${p.photos[0].alt}" class="img-fluid mala-slika">
                    </td>
                    <td class=" p-4">
                    `
                    //KAKO DOHVAITI VELICINU
                    ispis+=`
                        ${l.size}
                    </td>
                    <td class=" p-4">
                        $${p.price}
                    </td>                           
                    <td class=" p-4">
                        <input type="number" class="numb text-center" min="1" max="99" data-id="${l.id}" data-size="${l.size}" value="${l.quantity}" class="text-center">
                    </td>
                    <td class=" p-4">`
                    ispis+=`
                        $${l.quantity*p.price}
                    </td>
                    <td class="pt-2">
                        <button type="button" class="btn btn-dark ml-4 mr-4 izbaci" data-id="${p.id}" data-size="${l.size}">X</button>
                    </td>
                </tr>
                `
            }            
        }
    }
    if(value<100 && value!=0){
        tax=20
    }
    else {
        tax=0
    }
    totalValue=value+tax
    ispis+=`
            </tbody>
        </table>
    </div>
              
    <div class="col-12 col-lg-6">
                <h2 id="naslovTotal" class="borderr pb-4 mb-3">Summary</h2>
                <div class="col-12 d-flex justify-content-between ">
                    <p>
                       value of products 
                    </p>
                    <p>
                        $${value} 
                     </p>
                </div>
                <div class="col-12 d-flex pt-3 justify-content-between">
                    <p>
                       taxes 
                    </p>
                    <p>
                        $${tax} 
                    </p>
                    
                </div>
                <div class="col-12 d-flex pt-3 justify-content-between font-weight-bold">
                    <p>
                       total value of products 
                    </p>
                    <p>
                        $${totalValue} 
                    </p>
                    
                </div>
                <div class="col-12 d-flex justify-content-center" >
                    <button type="button" class="btn btn-dark mt-5 mb-3 col-10" id="btnCheckout">CHECKOUT</button>
                </div>
                
            </div>
    `    
    $('#cartDiv').html(ispis)
    dodajListenereX()
    dodajListenereNumber()
    ListenerCheckout()
 
}
function dodajListenereX(){
    $( ".izbaci" ).click(function() {
        let local=JSON.parse(localStorage.getItem("proizvodi"));
            filtrirani=local.filter(p => p.id != this.dataset.id || p.size != this.dataset.size);
            localStorage.setItem("proizvodi", JSON.stringify(filtrirani));
            dohvatiCart();
    });
    local=localStorage.getItem("proizvodi")
    if(local.length==2){
        document.getElementById("btnCheckout").disabled=true
    }
}
function dodajListenereNumber(){  
    numbersSvi=document.getElementsByClassName("numb");
    for(let i=0;i<numbersSvi.length;i++){
        numbersSvi[i].addEventListener("change",function updateCart(event){
            event.preventDefault();
            let regQuantity=/^[1-9][0-9]?$/
            if(!regQuantity.test(numbersSvi[i].value)){
                numbersSvi[i].classList.add("greska")
                document.getElementById("btnCheckout").disabled=true
            }
            else{
                let local=JSON.parse(localStorage.getItem("proizvodi"));
                for(let l of local){
                    if(l.id == this.dataset.id && l.size==this.dataset.size) {
                        l.quantity=this.value;
                        break;
                    } 
                }   
                localStorage.setItem("proizvodi", JSON.stringify(local));
                dohvatiCart();
            }
            
        })
    }
}
function ListenerCheckout(){
    $( "#btnCheckout" ).click(proveraCheckout);
    // document.getElementById("btnCheckout").addEventListener("click",proveraCheckout)
}
function proveraCheckout(){
    local=localStorage.getItem("proizvodi")
    if(local.length==2){
        document.getElementById("btnCheckout").disabled=true
    }
    else{
        window.location.href="form.html"
    }
}
// function IzbaciCart() {
    
// //     let proizvodiLocal = JSON.parse(localStorage.getItem("proizvodi"));
   
// //     filtered = proizvodiLocal.filter(p => p.id != id && p.size != size);

// //     localStorage.setItem("proizvodi", JSON.stringify(filtered));

// //    ispisiCart(proizvodiLocal);
// }
function klikk(){
    let greske=[];
    let size=""
    let quantity=document.getElementById("kolicina").value
    let sizes=document.getElementsByName("velicina")
    console.log(sizes)
    for(let i=0;i<sizes.length;i++){
        if(sizes[i].checked){
            size=sizes[i].value;
            break;           
        }
    }
    if(!size){
        greske.push("Size must be specified")
        $( "#pickASize" ).removeClass( "hide" );
    }
    else{
        $( "#pickASize" ).addClass( "hide" );
    }
    regQuantity=/^[1-9][0-9]?$/;
    if(!regQuantity.test(quantity)){
        greske.push("Quantity must be between 1 and 99")
        $( "#kolicina" ).addClass( "greska" );
    }
    else{
        $( "#kolicina" ).removeClass( "greska" );
    }

    if(!greske.length){      
        itemZaUpis={
            id:this.dataset.item,
            quantity:parseInt(quantity),
            size:size
        }
        
        //size , quantity i dataId upisujem u localStorage odnosno ItemZaUpis
        var proizvodiLocal=JSON.parse(localStorage.getItem("proizvodi"))
        if(proizvodiLocal){
             if(proizvodiLocal.filter(p => p.id == this.dataset.item && p.size==size).length){
                for(let i in proizvodiLocal){
                    if(proizvodiLocal[i].id == this.dataset.item && proizvodiLocal[i].size==size) {
                        
                        let pomocna=parseInt(proizvodiLocal[i].quantity)
                        pomocna+=parseInt(quantity)
                        proizvodiLocal[i].quantity=pomocna
                        break;
                    }  
                }
                localStorage.setItem("proizvodi",JSON.stringify(proizvodiLocal))
             }
             else{
                proizvodiLocal.push(itemZaUpis)
                localStorage.setItem("proizvodi",JSON.stringify(proizvodiLocal))
             }
        }
        else{
            let proizvodi=[]
            proizvodi[0]=itemZaUpis
            localStorage.setItem("proizvodi",JSON.stringify(proizvodi))
        }
        alert("Cart successfuly updated")
    }
    
    
}

function klikNaKategoriju(){
    var nizKategorija=document.getElementsByClassName("izbor");
    for(let i=0;i<nizKategorija.length;i++){
        nizKategorija[i].addEventListener("click",function loc(event){
            event.preventDefault();
            localStorage.setItem("kategorija",nizKategorija[i].dataset.id);
            window.location.href="products.html"
        })
    }

}

function dohvatiProizvod(){
    trazeniId=localStorage.getItem("Item");
    $.ajax({
        url:"assets/data/products.json",
        method:"GET",
        dataType:"json",
        success:function(data){
            console.log(data)
            var trazeni=data.filter(p=>p.id==trazeniId);
            console.log(trazeni)
            ispisiProizvod(trazeni)
            
        },
        error:function(status){
            console.log(status)
        }
    })
    
}
function ispisiProizvod(proizvod){
    let ispis=""
    for(p of proizvod){
    ispis+=
    `
    <div class="col-sm-6">
    <div class="col-12 p-0 mb-4">
        <img src="assets/img/${p.photos[0].src}" class="img-fluid" alt="${p.name}"/>
    </div>
    <div class="row">
        <div class="col-6 mb-4">
            <img src="assets/img/${p.photos[1].src}" class="img-fluid" alt="${p.name}"/>
        </div>
        <div class="col-6 mb-4">
            <img src="assets/img/${p.photos[2].src}" class="img-fluid" alt="${p.name}"/>
        </div>
    </div>                
</div>

<div class="col-sm-6 sticky-top">
    <div class="sticky-top pb-3">
        <h1 class="text-center pt-4">${p.name}</h1>
        <h3 class="text-center mb-3" id="cena">$${p.price}</h3>
        <form action="cart.html" method="POST">
          <div class="row d-flex justify-content-center ">
            <input type="number" step="1" min="1" max="99" name="kolicina" id="kolicina" class="col-2 text-center" value="1"/>
            <input type="button" name="dodajUKorpu" data-item="${p.id}" id="dodajUKorpu" value="ADD TO CART" class="btn btn-dark btnItem ml-2 col-9" />
          </div>
          <p class=" mt-5" id="deskripcija">
            SIZES
          </p>
          <div class="row boxed pt-2 pb-2 d-flex justify-content-center align-items-center">
          `
         for(let i=0;i<p.sizes.length;i++){
            //  if(proizvod[0].sizes[i])
            if(p.sizes[i]=="NA"){
                ispis+=`
                <input type="radio" checked name="velicina" class="col-12" id="${p.sizes[i]}" value="${p.sizes[i]}">
                <label for="${p.sizes[i]}">${p.sizes[i]}</label>
                `
            }
            else{
                ispis+=`
                <input type="radio" name="velicina" class="col-12" id="${p.sizes[i]}" value="${p.sizes[i]}">
                <label for="${p.sizes[i]}">${p.sizes[i]}</label>
                `
            }
            
         }
         ispis+=`
            <span id="pickASize" class="hide text-danger">Pick a size!</span>
            `
        //   for(p of proizvod[0].sizes){
        //     console.log("ovdeee")
        //       console.log()
        //       console.log(p)
        //       if (p=="m"){
        //           console.log("oooooo")
        //       }
        //   }
        

         ispis+=
            `
            
            </div>
            </form>
            <p class=" " id="deskripcija">
                DESCRIPTION
            </p>
            <p class="mt-3">
            ${p.desc}        
            </p>
        </div>                
    </div>
    `
    }
    $('#prrr').html(ispis);
    document.getElementById("dodajUKorpu").addEventListener("click",klikk)
}

function klikNaItem(){
    var nizItema=document.getElementsByClassName("btnItem");
    for(let i=0;i<nizItema.length;i++){
        nizItema[i].addEventListener("click",function loc(event){
            event.preventDefault();
            console.log(i)
            console.log(nizItema[i].dataset.item)
            localStorage.setItem("Item",nizItema[i].dataset.item);
            window.location.href="item.html"
        })
    }

}

function dohvatiKategorije(){
    $.ajax({
        url:"assets/data/category.json",
        method:"GET",
        dataType:"json",
        success:function(data){
            if(window.location.href.endsWith("/") || window.location.href.endsWith("index.html")){
                prikaziKategorije(data);
            }
            if(window.location.href.endsWith("products.html")){
                prikaziKategorijeFilter(data);
            }
           
        },
        error:function(status){
            console.log(status)
        }
    })
}

function prikaziKategorijeFilter(kategorije){    
    let ispis=""
    for(k of kategorije){
        ispis+=`
        <option value="${k.id}">${k.categoryName}</option>        
        `
    }
    $( "#ddlKategorija" ).html(ispis)
     document.getElementById("ddlKategorija").selectedIndex=localStorage.getItem("kategorija")-1
     if(!localStorage.getItem("kategorija")){
        document.getElementById("ddlKategorija").selectedIndex=0
     }
    
}
function dohvatiProizvode(){
    
    $.ajax({
        url:"assets/data/products.json",
        method:"GET",
        dataType:"json",
        success:function(data){
            
            if(window.location.href.endsWith("products.html")){
                let kat=localStorage.getItem("kategorija")
                console.log(kat)
                let zaSort=data
                if(kat==1 || kat==null){
                    ispisiCard(data)
                    zaSort=data
                }
                else{
                    var filtrirani=data.filter(p=>p.categoryId==kat);
                    ispisiCard(filtrirani)
                    zaSort=filtrirani
                }
                console.log(zaSort)
                document.querySelector("#ddlKategorija").addEventListener("change",function filtrirajPoKategoriji(){
                    kat=document.querySelector("#ddlKategorija")
                    izabranaKat = kat.options[kat.selectedIndex].value
                    if(izabranaKat=="1"){
                        console.log(data)
                        ispisiCard(data)
                        zaSort=data
                        localStorage.setItem("kategorija",izabranaKat)
                    }
                    else{
                        filtriraneKat = data.filter(p => p.categoryId == izabranaKat);
                        ispisiCard(filtriraneKat)
                        zaSort=filtriraneKat
                        localStorage.setItem("kategorija",izabranaKat)
                    }
                   
                });
                document.querySelector("#selectSortiranje").addEventListener("change",function sortirajPoKategoriji(){
                    let selected=document.querySelector("#selectSortiranje").selectedIndex
                    if(selected=="1"){
                        zaSort.sort((a,b) => {
                            if(a.price > b.price)
                                return -1;
                            else if(a.price < b.price)
                                return 1;
                            else 
                                return 0;
                        });
                        ispisiCard(zaSort);
                    }
                    else if(selected=="2"){
                        zaSort.sort((a,b) => {                   
                            if(a.price > b.price)
                                return 1;
                            else if(a.price < b.price)
                                return -1;
                            else 
                                return 0;
                        });
                        ispisiCard(zaSort);
                    }
                    
                   
                })
                
            }
            
            if(window.location.href.endsWith("/") || window.location.href.endsWith("index.html")){
                var data=data.filter(p=>p.topSelling==true);
                ispisiCard(data)
            }
           
        },
        error:function(status){
            console.log(status)
        }
    })
}




function filtrirajPoKategoriji(){
     kat=document.querySelector("#ddlKategorija")
     izabranaMarka = kat.options[kat.selectedIndex].value 
     filtriraniProizvodi = [];
}
function dohvatiSocial(){
    $.ajax({
        url:"assets/data/social.json",
        method:"GET",
        dataType:"json",
        success:function(data){
            //console.log(data)
            prikaziSocial(data);
        },
        error:function(status){
            console.log(status)
        }
    })
}
function prikaziSocial(social){
    let ispis="";
    for(s of social){
        ispis+=`
        <a class="text-white social" href="https://www.${s.name}.com/" target="_blank" title="${s.name}"><i class="${s.fa} m-2"></i></a>
        `
    }
    
    document.getElementById("social").innerHTML+=ispis;
}

function ispisiCard(proizvod){
    
    if(window.location.href.endsWith("/") || window.location.href.endsWith("index.html")){
        let ispis="";
        let br=0;
        for(p of proizvod){
            console.log("okkkk")
            if (br==0){
                ispis+=`
            <div class="carousel-item active">
                <div class="card mx-auto karta" >
                 <img class="card-img-top" src="assets/img/${p.photos[0].src}" alt="${p.photos[0].alt}">
                 <div class="card-body">
                     <h5 class="card-title">${p.name}</h5>
                    <p class="card-text">${p.desc}</p>
                    <a href="item.html" class="btn btn-dark btnItem " data-item="${p.id}">See more</a>
                    <span class="float-right h5">$${p.price}</span>
                 </div>
                </div>  
            </div>
            `
            }
            else{
                ispis+=`
                <div class="carousel-item ">
                    <div class="card mx-auto karta" >
                     <img class="card-img-top" src="assets/img/${p.photos[0].src}" alt="${p.photos[0].alt}">
                     <div class="card-body">
                         <h5 class="card-title">${p.name}</h5>
                        <p class="card-text">${p.desc}</p>
                        <a href="item.html" class="btn btn-dark btnItem" data-item="${p.id}">See more</a>
                        <span class="float-right h5">$${p.price}</span>
                     </div>
                    </div>  
                </div>
                `
            }
            br++;
            
        }
        $( "#carr" ).html(ispis);
        klikNaItem();
    }
    if(window.location.href.endsWith("products.html")){
       
        let ispis="";
        for(p of proizvod){
            ispis+=`
            <div class="card col-md-4 karta mx-auto mx-md-0" >
                <img class="card-img-top" src="assets/img/${p.photos[0].src}" alt="${p.photos[0].alt}">
                <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                   <p class="card-text">${p.desc}</p>
                   <a href="item.html" class="btn btn-dark btnItem" data-item="${p.id}">See more</a>
                   <span class="float-right h5">$${p.price}</span>
                </div>
            </div> 
            `
        }
        $( "#proizvodiDiv" ).html(ispis);
        klikNaItem();
    }
   
}

function prikaziKategorije(kategorije){
    //nizKat= document.getElementsByClassName("naslovKategorije");
    proba=""
    //var br=0
    for(k of kategorije){
        /////////////////////////    STAVI OVDE ZA KOLONE KATEGORIJA INDEX    /////////////////////////////////////////////////
        proba+=`
        <div class="col-sm-6 col-lg-3 col-12 crna izbor klasaKategorije d-flex align-items-center justify-content-center"data-slika="${k.src}" data-id="${k.id}">
        <h3 class="naslovKategorije">${k.categoryName}</h3>
        </div>
        `
     //  nizKat[br++].innerHTML=k.categoryName
    }
    $( "#kategorije" ).html(proba);
    let kats=document.getElementsByClassName("klasaKategorije")
    for(k of kats){        
        
       
    //    k.style.backgroundColor="red"
       //ZASTO OVO NE RADI
        k.style.backgroundImage =`url(${k.dataset.slika});`;
        k.style.cursor="pointer"
        klikNaKategoriju();
        // document.querySelector("[data-naziv]").style.backgroundImage ='url("../img/jumbotron.jpg");';
    }
}

function proveraForma(){
    let greske=[]
    let regImePrezime=/^[A-Z][a-z]{2,16}\s([A-Z][a-z]{2,20})+$/
    let regEmail=/^[\w]+([.-]?[\w\d]+)*@[\w]+([.-]?[\w]+)*(\.\w{2,4})+$/
    let regCity=/^[A-Z][a-z]{2,16}(\s([A-Z][a-z]{2,20})+)*$/
    let regAddress=/^[\w]+(\s[\w\d]+)*$/
    let ImePrezime=$("#imePrezime").val();
    let email=$("#email").val();
    let address=$("#address").val();
    let city=$("#city").val();
    if(!regImePrezime.test(ImePrezime)){
        greske.push("name and surname must be right")
        $( "#imePrezime" ).addClass( "is-invalid" );
        //document.getElementById("imePrezime").classList.add("is-invalid")
    }
    else{
        $( "#imePrezime" ).removeClass( "is-invalid" );
    }
    if(!regEmail.test(email)){
        greske.push("email must be right")
        $( "#email" ).addClass( "is-invalid" );
    }
    else{
        $( "#email" ).removeClass( "is-invalid" );
    }
    if(!regCity.test(city)){
        greske.push("city must be right")
        $( "#city" ).addClass( "is-invalid" );
    }
    else{
        $( "#city" ).removeClass( "is-invalid" );
    }

    if(!regAddress.test(address)){
        greske.push("address must be right")
        $( "#address" ).addClass( "is-invalid" );
    }
    else{
        $( "#address" ).removeClass( "is-invalid" );
    }
    console.log(greske)
    if(greske.length==0){
        alert("Successfull purchase");
        return false;
    }
    else{
        return false
    }
   
}
