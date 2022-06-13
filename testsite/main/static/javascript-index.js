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
     var input, filter, div, td, a, i;
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
    var parsed = JSON.parse(foundTanks);
    var classa = document.getElementsByClassName(classType);
    var tbl = document.createElement("TABLE");
    var tr1 = document.createElement("TR");
    var th = document.createElement("TH");
    th.innerHTML = headline;                                          
    tr1.appendChild(th);
    var tableBody = document.createElement("TBODY");
    tableBody.appendChild(tr1);
    tbl.setAttribute('class', classType + "2");
    for (i = 0; i < Object.keys(parsed).length; i++) {
        var tr = document.createElement("TR");
        var a = document.createElement("A");
        a.setAttribute('href', 'tank/' + parsed[i].fields.odkaz)
        var td = document.createElement("TD");
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

 var tiers = [""];
 var nations = [""];
 var isPremium = "normal";

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
            var indexToRemove = nations.indexOf($(this).val());
            nations.splice(indexToRemove, 1);
            if (nations.length == 0) {
                nations.push("");
            }
        }
        else if ($(this).attr('class') == "premko") {
            isPremium = "normal";
        }
        else {
            var indexToRemove = tiers.indexOf($(this).val());
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