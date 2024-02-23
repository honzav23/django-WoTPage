function loadVariables() {
    let changingPropertiesFields = {    // Properties that can change values (reloading, aim time, accuracy, view)
        baseReloads: document.getElementsByClassName("baseReloading"),
        baseAimTime: document.getElementById("baseAimTime").innerText,
        baseAccuracy: document.getElementById("baseAccuracy").innerText,
        baseView: parseFloat(document.getElementById("baseView").innerText),
        reloadingIconChecked: document.getElementById("Ikonanabijak") ? document.getElementById("Ikonanabijak").checked : null, // Might be undefined
        aimingIconChecked: document.getElementById("Ikonazamerovak").checked,
        opticsIconChecked: document.getElementById("Ikonaoptika").checked,
        binoIconChecked: document.getElementById("Ikonabino").checked,
        ventIconChecked: document.getElementById("Ikonaventilace").checked,
        biaIconChecked: document.getElementById("Ikonabratri").checked,
        reloadingBondIcon: $("#IkonanabijakBond"),
        aimingBondIcon: $("#IkonazamerovakBond"),
        opticsBondIcon: $("#IkonaoptikaBond"),
        ventBondIcon: $("#IkonaventilaceBond"),
        nabijak: document.getElementsByClassName("nabijak"),
        zamerovak: document.getElementById("zamerovak"),
        presnost: document.getElementById("presnost"),
        dohled: document.getElementById("binoOp"),
        bino: document.getElementById("bino")
    }
    return changingPropertiesFields
}

/**
 * Changes filters for nonBond elements (grayscale, blur)
 * @param {*} parent Parent container of a given nonBond element
 */
function changeFilter(parent) {
   let nonBondCheckbox = parent.children[0]
   let bondCheckbox = parent.children[2]
   let bondIcon = parent.children[3].childNodes[0]
   if (nonBondCheckbox.checked && !bondCheckbox.checked) {
    bondCheckbox.disabled = false
    bondIcon.setAttribute("style", "-webkit-filter:grayscale(0) blur(1px)")
   }

   else if (nonBondCheckbox.checked && bondCheckbox.checked) {
    bondIcon.setAttribute("style", "-webkit-filter:grayscale(0) blur(0px)")
   }

   else if (!nonBondCheckbox.checked) {
    bondCheckbox.checked = false
    bondCheckbox.disabled = true
    bondIcon.setAttribute("style", "-webkit-filter:grayscale(1) blur(1px)")
   }
}


/**
 * Calculates the results for non crew equipment (gun rammer, optics, ...)
 */
function calculateForNonCrewEquipment(changingPropertiesFields, results) {
    let reloads, aimTime, view, viewBino
    [reloads, aimTime, view, viewBino] = results
    if (changingPropertiesFields.reloadingIconChecked != null) {
        if (changingPropertiesFields.reloadingIconChecked) {
            let coeficient = 0.1
            if (changingPropertiesFields.reloadingBondIcon.prop("checked")) {
                coeficient = 0.135
            }
            for (let i = 0; i < changingPropertiesFields.baseReloads.length; i++) {
                reloads[i] = (parseFloat(baseReload.innerText) - parseFloat(baseReload.innerText) * coeficient).toFixed(2)
            }
        }
    }
    if (changingPropertiesFields.aimingIconChecked) {
        let coeficient = 0.1
        if (changingPropertiesFields.aimingBondIcon.prop("checked")) {
            coeficient = 0.135
        }
        aimTime = (changingPropertiesFields.baseAimTime - changingPropertiesFields.baseAimTime * coeficient).toFixed(2)
    }
    if (changingPropertiesFields.opticsIconChecked) {
        let coeficient = 0.1
        if (changingPropertiesFields.opticsBondIcon.prop("checked")) {
            coeficient = 0.135
        }
        view = (changingPropertiesFields.baseView + changingPropertiesFields.baseView * coeficient).toFixed(0)
    }
    if (changingPropertiesFields.binoIconChecked) {
        let coeficient = 0.25
        viewBino = (changingPropertiesFields.baseView + changingPropertiesFields.baseView * coeficient).toFixed(0)
    }
   return [reloads, aimTime, view, viewBino]
}

function showCalculatedValues(changingPropertiesFields, results, accuracy) {
    let greenColor = "#3eb943"
    let reloads, aimTime, view, binoView
    [reloads, aimTime, view, binoView] = results
    changingPropertiesFields.zamerovak.innerText = aimTime
    changingPropertiesFields.zamerovak.style.backgroundColor = greenColor
    changingPropertiesFields.dohled.innerText = view
    changingPropertiesFields.dohled.style.backgroundColor = greenColor
    changingPropertiesFields.bino.innerText = binoView
    changingPropertiesFields.bino.style.backgroundColor = greenColor
    changingPropertiesFields.presnost.innerText = accuracy
    changingPropertiesFields.presnost.style.backgroundColor = greenColor

    for (let i = 0; i < reloads.length; i++) {
        changingPropertiesFields.nabijak[i].innerText = reloads[i]
        changingPropertiesFields.nabijak[i].style.backgroundColor = greenColor
    }
    if (changingPropertiesFields.zamerovak.innerText == changingPropertiesFields.baseAimTime) {
        changingPropertiesFields.zamerovak.style.backgroundColor = "inherit"
    }
    if (changingPropertiesFields.presnost.innerText == changingPropertiesFields.baseAccuracy) {
        changingPropertiesFields.presnost.style.backgroundColor = "inherit"
    }
    if (changingPropertiesFields.dohled.innerText == changingPropertiesFields.baseView) {
        changingPropertiesFields.dohled.style.backgroundColor = "inherit"
    }
    if (changingPropertiesFields.bino.innerText == changingPropertiesFields.baseView) {
        changingPropertiesFields.bino.style.backgroundColor = "inherit"
        changingPropertiesFields.bino.innerText = ""
    }
    if (reloads[0] == changingPropertiesFields.baseReloads[0].innerText) {
        for (reload of changingPropertiesFields.nabijak) {
            reload.style.backgroundColor = "inherit"
        }
    }
}

function calculate() {
    let changingPropertiesFields = loadVariables()
    let crewLevel = 100
    let reloadingArr = []
    for (baseReload of changingPropertiesFields.baseReloads) {
        reloadingArr.push(parseFloat(baseReload.innerText))
    }
    let results = [reloadingArr, changingPropertiesFields.baseAimTime, changingPropertiesFields.baseView, changingPropertiesFields.baseView]
    let accuracy = changingPropertiesFields.baseAccuracy

    let iconChecked = changingPropertiesFields.aimingIconChecked || changingPropertiesFields.opticsIconChecked
                        || changingPropertiesFields.binoIconChecked

    if (changingPropertiesFields.reloadingIconChecked != null) {
        iconChecked = iconChecked || changingPropertiesFields.reloadingIconChecked
    }

    let crewLevelUp = false

    if (iconChecked) {
        results = calculateForNonCrewEquipment(changingPropertiesFields, results)
    }
    if (changingPropertiesFields.ventIconChecked) {
        crewLevel += 5.3
        crewLevelUp = true
        if (IkonaventilaceBond.checked) {
            crewLevel += 3.3
        }
    }
    if (Ikonabratri.checked) {
        crewLevel += 5.3
        crewLevelUp = true
    }
    if (crewLevelUp) {
            results[1] = ((results[1] * 0.875) / (0.00375 * crewLevel + 0.5)).toFixed(2)
            results[2] = ((results[2] / 0.875) * (0.00375 * crewLevel + 0.5)).toFixed(0)
            results[3] = ((results[3] / 0.875) * (0.00375 * crewLevel + 0.5)).toFixed(0)
            accuracy = ((parseFloat(accuracy) * 0.875) / (0.00375 * crewLevel + 0.5)).toFixed(2)
            results[0] = results[0].map(elem =>((elem * 0.875) / (0.00375 * crewLevel + 0.5)).toFixed(2))
    }
    showCalculatedValues(changingPropertiesFields, results, accuracy)
}