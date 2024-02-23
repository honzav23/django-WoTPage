let focusedElement = -1
let visibleTopBound = -1
let visibleBottomBound = -1

document.getElementById("vyhledat").onkeyup = ((key) => {
    if (key.key != "ArrowUp" && key.key != "ArrowDown" && key.key != "Enter") {
        searchTanks()
    }
    else {
        // document.getElementById("vyhledat").blur()
        changeSelectedElement(key)
    }
})

    window.onclick = () => {
       removeTankList()
    }


function searchTanks() {
    focusedElement = -1
    removeTankList()
    let val = document.getElementById("vyhledat").value
    if (val) {
        $.ajax({
            type: "GET",
            url: "",
            dataType: "json",
            data: {
                text : val
            },
            success: function(response) {
                let parsed = JSON.parse(response.foundTanks);
                let keysLength = Object.keys(parsed).length
                if (keysLength > 0) {
                    let ul = document.createElement("UL");

                    // So that the results overlap the content and not pushing it down
                    ul.style.position = "absolute"
                    ul.style.maxHeight = "420px"
                    ul.style.overflowY = "scroll"
                    ul.classList.add("list-group")
                    for (i = 0; i < keysLength; i++) {
                        let name = parsed[i].fields.tanknazev;
                        let a = document.createElement('a');
                        let li = document.createElement("LI");
                        li.classList.add("list-group-item")
                        li.innerHTML = name;
                        a.setAttribute('href', parsed[i].fields.odkaz);
                        a.appendChild(li);
                        ul.appendChild(a);
                    }
                    document.getElementById("tankList").appendChild(ul);
                    ul.style.display = "block"
                }
            }
        });
    }
}

function changeSelectedElement(key) {
    let tankList = document.getElementsByTagName("li")
    if (tankList) {
        if (focusedElement == -1 && key.key == "ArrowDown") {
            tankList[0].style.backgroundColor = "#b0b0b0"
            focusedElement = 0
            visibleBottomBound = 9
            visibleTopBound = 0
        }
        else if ((focusedElement == 0 || focusedElement == -1) && key.key == "ArrowUp") {
            focusedElement = -1
            tankList[0].style.backgroundColor = "white"
        }
        else if (key.key == "ArrowDown") {
            tankList[focusedElement++].style.backgroundColor = "white"
            tankList[focusedElement].style.backgroundColor = "#b0b0b0"
        }
        else if (key.key == "ArrowUp") {
            tankList[focusedElement--].style.backgroundColor = "white"
            tankList[focusedElement].style.backgroundColor = "#b0b0b0"
        }
        else if (key.key == "Enter") {
            tankList[focusedElement].click()
        }
        scrollList(tankList)
    }
}
function scrollList(tankList) {
    let scrollHeight = tankList[0].clientHeight
    let scrollableList = document.getElementsByTagName("ul")[0]
    if (tankList.length > 10) {

        // Need to scroll down
        if (focusedElement > visibleBottomBound) {
            scrollableList.scrollBy(0, scrollHeight)
            visibleBottomBound++
            visibleTopBound++
        }

        // Need to scroll up
        else if (focusedElement < visibleTopBound) {
            scrollableList.scrollBy(0, -scrollHeight)
            visibleBottomBound--
            visibleTopBound--
        }
    }
}

function removeTankList() {
    let ulElements = document.getElementsByTagName("ul")
    if (ulElements.length) {
        ulElements[0].remove()
    }
}

document.getElementById("dela").onchange = (() => {
    $.ajax({
        type: "GET",
        url: "",
        dataType: "json",
        data: {
            gunId: document.getElementById("dela").value
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