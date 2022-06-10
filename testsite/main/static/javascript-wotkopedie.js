
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
        presnost: document.getElementById("nabijak"),
        dohled: document.getElementById("binoOp"),
        bino: document.getElementById("bino")
    }
    return changingPropertiesFields
}

function changeFilter(originalIcon, position, bondIcon) {
    if (originalIcon.checked) {
        if (bondIcon.checked) {
            $(".bond img").eq(position).css({WebkitFilter: "grayscale(0) blur(0px)"})
        }
        // else {
        //     $(".bond img").eq(position).css({WebkitFilter: "grayscale(0) blur(1px)"})
        // }
    }
}

/**
 * Resets bond icons to default state (unchecked, disabled)
 * @param {*} changingPropertiesFields Object with all bond icons
 */
function resetBondIcons(changingPropertiesFields) {
    if (changingPropertiesFields.reloadingIconChecked != null) {
        if (!changingPropertiesFields.reloadingIconChecked) {
            changingPropertiesFields.reloadingBondIcon.prop("checked", false)
            changingPropertiesFields.reloadingBondIcon.prop("disabled", true)
            $(".bond img").eq(3).css({WebkitFilter: "grayscale(1) blur(1px)"})
        }
    }
    if (changingPropertiesFields.aimingIconChecked != null) {
        if (!changingPropertiesFields.aimingIconChecked) {
            changingPropertiesFields.aimingBondIcon.prop("checked", false)
            changingPropertiesFields.aimingBondIcon.prop("disabled", true)
            $(".bond img").eq(2).css({WebkitFilter: "grayscale(1) blur(1px)"})
        }
    }
    if (changingPropertiesFields.opticsIconChecked != null) {
        if (!changingPropertiesFields.opticsIconChecked) {
            changingPropertiesFields.opticsBondIcon.prop("checked", false)
            changingPropertiesFields.opticsBondIcon.prop("disabled", true)
            $(".bond img").eq(1).css({WebkitFilter: "grayscale(1) blur(1px)"})
        }
    }
    if (changingPropertiesFields.ventIconChecked != null) {
        if (!changingPropertiesFields.ventIconChecked) {
            changingPropertiesFields.ventBondIcon.prop("checked", false)
            changingPropertiesFields.ventBondIcon.prop("disabled", true)
            $(".bond img").eq(0).css({WebkitFilter: "grayscale(1) blur(1px)"})
        }
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
            changingPropertiesFields.reloadingBondIcon.prop("disabled", false)
            $(".bond img").eq(3).css({WebkitFilter: "grayscale(0) blur(1px)"})
        }
    }
    if (changingPropertiesFields.aimingIconChecked) {
        let coeficient = 0.1
        if (changingPropertiesFields.aimingBondIcon.prop("checked")) {
            coeficient = 0.135
        }
        aimTime = (changingPropertiesFields.baseAimTime - changingPropertiesFields.baseAimTime * coeficient).toFixed(2)
        changingPropertiesFields.aimingBondIcon.prop("disabled", false)
        $(".bond img").eq(2).css({WebkitFilter: "grayscale(0) blur(1px)"})
    }
    if (changingPropertiesFields.opticsIconChecked) {
        let coeficient = 0.1
        if (changingPropertiesFields.opticsBondIcon.prop("checked")) {
            coeficient = 0.135
        }
        view = (changingPropertiesFields.baseView + changingPropertiesFields.baseView * coeficient).toFixed(0)
        changingPropertiesFields.opticsBondIcon.prop("disabled", false)
        $(".bond img").eq(1).css({WebkitFilter: "grayscale(0) blur(1px)"})
    }
    if (changingPropertiesFields.binoIconChecked) {
        let coeficient = 0.25
        viewBino = (changingPropertiesFields.baseView + changingPropertiesFields.baseView * coeficient).toFixed(0)
    }
   return [reloads, aimTime, view, viewBino]
}

function showCalculatedValues(changingPropertiesFields, results) {
    let greenColor = "#3eb943"
    let reloads, aimTime, view, binoView
    [reloads, aimTime, view, binoView] = results
    changingPropertiesFields.zamerovak.innerText = aimTime
    changingPropertiesFields.zamerovak.style.backgroundColor = greenColor
    changingPropertiesFields.dohled.innerText = view
    changingPropertiesFields.dohled.style.backgroundColor = greenColor
    changingPropertiesFields.bino.innerText = binoView
    changingPropertiesFields.bino.style.backgroundColor = greenColor

    for (let i = 0; i < reloads.length; i++) {
        changingPropertiesFields.nabijak[i].innerText = reloads[i]
        changingPropertiesFields.nabijak[i].style.backgroundColor = greenColor
    }
    if (changingPropertiesFields.zamerovak.innerText == changingPropertiesFields.baseAimTime) {
        changingPropertiesFields.zamerovak.style.backgroundColor = "inherit"
    }
    if (changingPropertiesFields.dohled.innerText == changingPropertiesFields.baseView) {
        changingPropertiesFields.dohled.style.backgroundColor = "inherit"
    }
    if (changingPropertiesFields.bino.innerText == changingPropertiesFields.baseView) {
        changingPropertiesFields.bino.style.backgroundColor = "inherit"
        changingPropertiesFields.bino.innerText = ""
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
    resetBondIcons(changingPropertiesFields)
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
        changingPropertiesFields.ventBondIcon.prop("disabled", false)
        $(".bond img").eq(0).css({WebkitFilter: "grayscale(0) blur(1px)"})
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
    showCalculatedValues(changingPropertiesFields, results)
    // for (let i = 0; i < bases.length; i++) {
    //     out[i].innerHTML = results[i]
    //     if (results[i] != bases[i]) {
    //         out[i].style.backgroundColor = "#3eb943"
    //     }
    //     else {
    //         out[i].style.backgroundColor = "inherit"
    //     }
    // }
}