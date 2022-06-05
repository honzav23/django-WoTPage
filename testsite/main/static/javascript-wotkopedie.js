
let Ikonanabijak = null;
let Ikonaventilace = null;
let Ikonabratri = null;
let Ikonaoptika = null;
let Ikonabino = null;
let Ikonazamerovak = null;
window.nabijak;
window.nabijeni;
let nabijak2 = null;
let nabijeni2 = null;
let nabijak3 = null;
let nabijeni3 = null;
let nabijak4 = null;
let nabijeni4 = null;

let bases = [];
let out = [];

window.zamerovani;
window.zamerovak;
window.dohled;
window.binoOp;
window.bino;
window.presnost;
window.Presnost;
window.IkonanabijakBond;
window.IkonazamerovakBond;
window.IkonaventilaceBond;
window.IkonaoptikaBond;

window.onload = setTimeout(loadVariables, 1000)  //loadVariables();

function loadVariables() {
    Ikonanabijak = document.getElementById("Ikonanabijak");
    Ikonaventilace = document.getElementById("Ikonaventilace");
    Ikonabratri = document.getElementById("Ikonabratri");
    Ikonazamerovak = document.getElementById("Ikonazamerovak");
    Ikonaoptika = document.getElementById("Ikonaoptika");
    Ikonabino = document.getElementById("Ikonabino");
    nabijak2 = document.getElementById("nabijak2");
    nabijeni2 = document.getElementById("nabijeni2");
    nabijak3 = document.getElementById("nabijak3");
    nabijeni3 = document.getElementById("nabijeni3");
    nabijak4 = document.getElementById("nabijak4");
    nabijeni4 = document.getElementById("nabijeni4");
    bases = [nabijeni.innerHTML, zamerovani.innerHTML, dohled.innerHTML, presnost.innerHTML, dohled.innerHTML];
    out = [nabijak, zamerovak, binoOp, Presnost, bino];
    if (nabijeni2 != null) {
        bases.push(nabijeni2.innerHTML);
        out.push(nabijak2);
        if (nabijeni3 != null) {
            bases.push(nabijeni3.innerHTML);
            out.push(nabijak3);
            if (nabijeni4 != null) {
                bases.push(nabijeni4.innerHTML);
                out.push(nabijak4);
            }
        }
    }
}

function changeFilter(originalIcon, position, bondIcon) {
    if (originalIcon.checked) {
        if (bondIcon.checked) {
            $(".bond img").eq(position).css({WebkitFilter: "grayscale(0) blur(0px)"});
        }
        // else {
        //     $(".bond img").eq(position).css({WebkitFilter: "grayscale(0) blur(1px)"});
        // }
    }
}

function calculateForNonCrewEquipment(resultsArray, bondEq) {
    coeficient = 0.1;
    if (Ikonanabijak != null) {
        if (Ikonanabijak.checked) {
            if (IkonanabijakBond.checked) {
                coeficient = 0.135;
            }
            resultsArray[0] = (resultsArray[0] - (resultsArray[0] * 0.875) / (0.00375 * 100 + 0.5) * coeficient).toFixed(2);
            bondEq[3].prop("disabled", false);
            $(".bond img").eq(3).css({WebkitFilter: "grayscale(0) blur(1px)"});
        }
    }
    if (Ikonazamerovak.checked) {
        if (IkonazamerovakBond.checked) {
            coeficient = 0.135;
        }
        resultsArray[1] = (resultsArray[1] - (resultsArray[1] * 0.875) / (0.00375 * 100 + 0.5) * coeficient).toFixed(2);
        bondEq[1].prop("disabled", false);
        $(".bond img").eq(2).css({WebkitFilter: "grayscale(0) blur(1px)"});
    }
    if (Ikonaoptika.checked) {
        if (IkonaoptikaBond.checked) {
            coeficient = 0.135;
        }
        resultsArray[2] = (resultsArray[2] + (resultsArray[2] / 0.875) * (0.00375 * 100 + 0.5) * coeficient).toFixed(0);
        bondEq[0].prop("disabled", false);
        $(".bond img").eq(1).css({WebkitFilter: "grayscale(0) blur(1px)"});
    }
    if (Ikonabino.checked) {
        coeficient = 0.25;
        resultsArray[4] = (resultsArray[4] + (resultsArray[4] / 0.875) * (0.00375 * 100 + 0.5) * coeficient).toFixed(0);
    }
    return resultsArray;
}

function calculate() {
    let levelPosadky = 100;
    let results = [];
    bondEq = [$("#IkonaoptikaBond"), $("#IkonazamerovakBond"), $("#IkonaventilaceBond"), $("#IkonanabijakBond")];
    for (base of bases) {
        results.push(parseFloat(base));
    }
    if (Ikonanabijak != null) {
        if (!Ikonanabijak.checked) {
            bondEq[3].prop("checked", false);
            bondEq[3].prop("disabled", true);
            $(".bond img").eq(3).css({WebkitFilter: "grayscale(1) blur(1px)"});
        }
    }
    if (!Ikonazamerovak.checked) {
        bondEq[1].prop("checked", false);
        bondEq[1].prop("disabled", true);
        $(".bond img").eq(2).css({WebkitFilter: "grayscale(1) blur(1px)"});
    }
    if (!Ikonaoptika.checked) {
        bondEq[0].prop("checked", false);
        bondEq[0].prop("disabled", true);
        $(".bond img").eq(1).css({WebkitFilter: "grayscale(1) blur(1px)"});
    }
    if (!Ikonaventilace.checked) {
        bondEq[2].prop("checked", false);
        bondEq[2].prop("disabled", true);
        $(".bond img").eq(0).css({WebkitFilter: "grayscale(1) blur(1px)"});
    }
    let iconChecked = Ikonazamerovak.checked || Ikonaoptika.checked || Ikonabino.checked;
    if (Ikonanabijak != null) {
        iconChecked = iconChecked || Ikonanabijak;
    }
    let crewLevelUp = false;
    if (iconChecked) {
        results = calculateForNonCrewEquipment(results, bondEq);
    }
    if (Ikonaventilace.checked) {
        bondEq[2].prop("disabled", false);
        $(".bond img").eq(0).css({WebkitFilter: "grayscale(0) blur(1px)"});
        levelPosadky += 5.3;
        crewLevelUp = true;
        if (IkonaventilaceBond.checked) {
            levelPosadky += 3.3;
        }
    }
    if (Ikonabratri.checked) {
        levelPosadky += 5.3;
        crewLevelUp = true;
    }
    if (crewLevelUp) {
        for (let i = 0; i < bases.length; i++) {
            if (i == 2 || i == 4) {
                results[i] = ((results[i] / 0.875) * (0.00375 * levelPosadky + 0.5)).toFixed(0);
            }
            else {
                results[i] = ((results[i] * 0.875) / (0.00375 * levelPosadky + 0.5)).toFixed(2);
            }
        }
    }
    for (let i = 0; i < bases.length; i++) {
        out[i].innerHTML = results[i];
        if (results[i] != bases[i]) {
            out[i].style.backgroundColor = "#3eb943";
        }
        else {
            out[i].style.backgroundColor = "inherit";
        }
    }
}