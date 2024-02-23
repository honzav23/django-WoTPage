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
     let input, div, td, a, i;
     input = document.getElementById("vyhledat").value.toUpperCase();
     div = document.getElementById("vsechnyt");
     td = div.getElementsByTagName("td");
     for (i = 0; i < td.length; i++) {
         a = td[i].getElementsByTagName("a")[0];
         if (a.innerHTML.toUpperCase().search(input) > -1) {
             td[i].style.display = "";
         } else {
             td[i].style.display = "none";
         }
     }
 }
 function showTanks(foundTanks) {
    let parsedTanks = [JSON.parse(foundTanks.light), JSON.parse(foundTanks.medium), JSON.parse(foundTanks.heavy),
                       JSON.parse(foundTanks.td), JSON.parse(foundTanks.arty)]

    let tankCategories = JSON.parse(foundTanks.categories)
    let tables = document.getElementsByTagName("table")

    // Hide the original tables
    for (let table of tables) {
        table.style.display = "none"
    }
    let parent = document.getElementById("tanksLocation")

    for (let i = 0; i < tankCategories.length; i++) {
        let table = document.createElement("table")
        let tbody = document.createElement("tbody")
        let headingRow = document.createElement("tr")
        let heading = document.createElement("th")
        heading.classList.add("text-center")
        heading.innerText = tankCategories[i].fields.title
        headingRow.appendChild(heading)
        tbody.appendChild(headingRow)
        
        for (let tank of parsedTanks[i]) {
            let tr = document.createElement("tr")
            let td = document.createElement("td")
            let a = document.createElement("A");
            a.setAttribute('href', 'tank/' + tank.fields.odkaz)
            if (tank.fields.tankstatus == 2) {
                td.setAttribute('id', 'premko');
            }
            a.innerHTML = tank.fields.tanknazev
            td.appendChild(a);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody)
        parent.appendChild(table)
    }
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
           showTanks(response)
        }
    });
}