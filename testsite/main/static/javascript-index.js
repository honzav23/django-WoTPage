/**
 * Unchecks all checkboxes when loaded
 */
window.onload = function() {
    nationCheckBoxes = document.getElementsByClassName("narod")
    tierCheckBoxes = document.getElementsByClassName("tier")
    premiumCheckBox = document.getElementById("prem")
    prem.checked = false
    for (nationCheckBox of nationCheckBoxes) {
        nationCheckBox.checked = false
    }
    for (tierCheckBox of tierCheckBoxes) {
        tierCheckBox.checked = false
    }
}


function menu() {
    $(".narody").toggle();
    $(".tiery").toggle();
    $(".lupa").toggle();
    $("#vyhledat").toggle();   
 }
 function searching() {
     let input, filter, div, td, a, i;
     input = document.getElementById("vyhledat");
     filter = input.value.toUpperCase();
     div = document.getElementById("vsechnyt");
     td = div.getElementsByTagName("td");
     for (i = 0; i < td.length; i++) {
         a = td[i].getElementsByTagName("a")[0];
         if (a.innerHTML.toUpperCase().search(filter) > -1) {
             td[i].style.display = "";
         } else {
             td[i].style.display = "none";
         }
     }
 }
 function showTanks(headline, classType, foundTanks) {
    let parsed = JSON.parse(foundTanks);
    let classa = document.getElementsByClassName(classType);
    let tbl = document.createElement("TABLE");
    let tr1 = document.createElement("TR");
    let th = document.createElement("TH");
    th.innerHTML = headline;                                          
    tr1.appendChild(th);
    let tableBody = document.createElement("TBODY");
    tableBody.appendChild(tr1);
    tbl.setAttribute('class', classType + "2");
    for (i = 0; i < Object.keys(parsed).length; i++) {
        let tr = document.createElement("TR");
        let a = document.createElement("A");
        a.setAttribute('href', 'tank/' + parsed[i].fields.odkaz)
        let td = document.createElement("TD");
        if (parsed[i].fields.tankstatus == 2) {
            td.setAttribute('id', 'premko');
        }
        a.innerHTML = parsed[i].fields.tanknazev;
        td.appendChild(a);
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }
    tbl.appendChild(tableBody);
    classa[0].appendChild(tbl);
}

 let tiers = [""];
 let nations = [""];
 let isPremium = "normal";

function makeQuery() {
    if ($(this).is(":checked") && $(this).attr('class') == "narod") {
        if (nations[0] == "") {
            nations.splice(0, 1);
        }
        nations.push($(this).val());
    }
    else if ($(this).is(":checked") && $(this).attr('class') == "tier") {
        if (tiers[0] == "") {
            tiers.splice(0, 1);
        }
        tiers.push($(this).val());
    }
    else if ($(this).is(":checked") && $(this).attr('class') == "premko") {
        isPremium = "premko";
    }
    else {
        if ($(this).attr('class') == "narod") {
            let indexToRemove = nations.indexOf($(this).val());
            nations.splice(indexToRemove, 1);
            if (nations.length == 0) {
                nations.push("");
            }
        }
        else if ($(this).attr('class') == "premko") {
            isPremium = "normal";
        }
        else {
            let indexToRemove = tiers.indexOf($(this).val());
            tiers.splice(indexToRemove, 1);
            if (tiers.length == 0) {
                tiers.push("");
            }
        }
    }
    makeAjaxRequest(nations, tiers, isPremium);
}

function makeAjaxRequest(nations, tiers, isPremium) {
    $.ajax({
        url: "",
        type: "GET",
        dataType: 'json',
        data: {
            n: nations.toString(), t: tiers.toString(), p: isPremium
        },
        success: function(response) {
            $(".lehke2, .stredni2, .tezke2, .tdcka2, .artyny2").remove();
            showTanks("Lehké tanky", "lehke", response.light);
            showTanks("Střední tanky", "stredni", response.medium);
            showTanks("Těžké tanky", "tezke", response.heavy);
            showTanks("Stíhače tanků", "tdcka", response.td);
            showTanks("Dělostřelectvo", "artyny", response.arty);
        }
    });
}