window.onload = function() {
    equipment = document.getElementsByClassName("equipment")
    for (equip of equipment) {
        equip.checked = false
    }
}
function checkTotalNumOfTanksInComparison() {
    tanksInComparisonNum = parseInt(document.getElementById("comparisonCount").innerHTML)
    if (tanksInComparisonNum >= 2) {
        document.getElementById("addToComparison").setAttribute("disabled", true)
    }
    else {
        document.getElementById("addToComparison").removeAttribute("disabled")
    }
}

$("#vyhledat").keyup(() => {
    $("ul").remove();
    if ($("#vyhledat").val().length > 0) {
        $.ajax({
            type: "GET",
            url: "",
            dataType: "json",
            data: {
                text : $("#vyhledat").val()
            },
            success: function(response) {
                let parsed = JSON.parse(response.foundTanks);
                let keysLength = Object.keys(parsed).length
                if (keysLength > 0) {
                    let ul = document.createElement("UL");
                    for (i = 0; i < keysLength; i++) {
                        let name = parsed[i].fields.tanknazev;
                        let a = document.createElement('a');
                        let li = document.createElement("LI");
                        li.setAttribute('class', 'link');
                        li.innerHTML = name;
                        a.setAttribute('href', parsed[i].fields.odkaz);
                        a.appendChild(li);
                        ul.appendChild(a);
                    }
                    document.getElementById("tankList").appendChild(ul);
                    $("ul").show();
                }
            }
        });
    }
    else {
        $("ul").fadeOut(1);
    }
});

$("#dela").change(function(){
    $.ajax({
        type: "GET",
        url: "",
        dataType: "json",
        data: {
            gunId: $("#dela").val()
        },
        success: response => {
            let parsedNonReloadingProps = JSON.parse(response.nonReloadingProperties)[0]
            let parsedReloading = JSON.parse(response.reloading)
            let parsedShellProps = JSON.parse(response.shellProperties)
            showNewGunInfo(parsedNonReloadingProps.fields, parsedReloading, parsedShellProps)
        },
        error: (xhr, status, error) => {
            console.log(xhr)
        }
    })
});

function createMissingFields() {
    let descs = ["Počet ran v zásobníku:", "Nabíjení mezi ranami:"]
    let table = document.getElementsByTagName("table")[0]
    for (let i = 5; i <= 6; i++) {
        let row = table.insertRow(i)
        let th = document.createElement("th")
        th.innerText = descs[i-5]
        row.appendChild(th)
        row.insertCell()
        row.insertCell()
        row.insertCell()
    }
}


function showNewGunInfo(nonReloadingProperties, reloading, shellProperties) {
    let aimField, accuracyField, reloadingField
    let shellNameFields, penetrationFields, damageFields
    [shellNameFields, penetrationFields, damageFields] = alignTables(shellProperties)
    autoReloadFields = [...document.querySelectorAll("tr")].filter((elem) => {  // Find if autoreloading fields are present
        return elem.cells[0]?.innerText == "Počet ran v zásobníku:" ||
            elem.cells[0]?.innerText == "Nabíjení mezi ranami:"
    })
    if (nonReloadingProperties.autoloader) {    // Gun is autoloading
        if (!autoReloadFields.length) {
            createMissingFields()
            $("tr").eq(5).children().eq(1).text(nonReloadingProperties.pocetran)
            $("tr").eq(6).children().eq(1).text(nonReloadingProperties.mezinabijeni.toFixed(1))
        }
        reloadingField = $("tr").eq(7).children()
        aimField = $("tr").eq(8).children().eq(1)
        accuracyField = $("tr").eq(9).children().eq(1)
    }
    else {
        autoReloadFields.forEach((elem) => elem.remove())
        reloadingField = $("tr").eq(5).children() 
        aimField = $("tr").eq(6).children().eq(1)
        accuracyField = $("tr").eq(7).children().eq(1)
    }
    accuracyField.text(nonReloadingProperties.presnost)
    aimField.text(nonReloadingProperties.zamereni)
    basicReloadFields = document.getElementsByClassName("nabijak")
    for (let i = 1; i < reloadingField.length; i++) {   // Fill all reloading fields with their values (tanks can have multiple reloadings)
        reloadingField.eq(i).text(reloading[i-1].fields.nabijeni)
        basicReloadFields[i-1].innerText = reloading[i-1].fields.nabijeni
    }
    for (let i = 0; i < shellProperties.length; i++) {
        shellNameFields.eq(i+1).text(shellProperties[i].fields.naboj_idnaboj)
        penetrationFields.eq(i+1).text(shellProperties[i].fields.prubojnost + " mm")
        damageFields.eq(i+1).text(shellProperties[i].fields.poskozeni)
    }
    document.getElementById("baseAimTime").innerText = nonReloadingProperties.zamereni
    document.getElementById("baseAccuracy").innerText = nonReloadingProperties.presnost
    basicReloadingFields = document.getElementsByClassName("baseReloading")
    for (let i = 0; i < basicReloadingFields.length; i++) {
        basicReloadingFields[i].innerText = reloading[i].fields.nabijeni 
    }
}

function alignTables(shellProperties) {
    let shellNameFields = $("tr").eq(2).children()
    let penetrationFields = $("tr").eq(3).children()
    let damageFields = $("tr").eq(4).children()
    if (shellNameFields.length - 1 > shellProperties.length) {  // Remove shell names if previous gun had more shells than the current one
        for (let i = shellProperties.length; i < shellNameFields.length; i++) {
            shellNameFields.eq(i+1).text("")
            penetrationFields.eq(i+1).text("")
            damageFields.eq(i+1).text("")
        }
    }
    if (shellNameFields.length - 1 < shellProperties.length) {
        for (let i = 0; i < shellNameFields.length - shellProperties.length + 1; i++) {
            $("tr").eq(2).append("<td></td>")
            $("tr").eq(3).append("<td></td>")
            $("tr").eq(4).append("<td></td>")
        }
    }
    shellNameFields = $("tr").eq(2).children()
    penetrationFields = $("tr").eq(3).children()
    damageFields = $("tr").eq(4).children()
    return [shellNameFields, penetrationFields, damageFields]
}

function addToComparison(tankId) {
    $.ajax({
        type: "GET",
        url: "",
        dataType: "json",
        data: {
            tankId: tankId,
        },
        success: response => {
            console.log(response.msg)
            document.getElementById("comparisonCount").innerHTML = response.totalTanksInComparison
            checkTotalNumOfTanksInComparison()
        }
    })
}