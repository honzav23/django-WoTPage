from textwrap import indent
from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from django.db import connection
from main.models import Tank, Kategorie, Narod, Tier, TankHasGun, Nabijeni, DeloHasNaboj, Delo


def fixLink(allTankClasses):
    for tankClass in allTankClasses:
        for tank in tankClass:
            tank.odkaz = tank.odkaz.split("/")[-1].lower()

def jsonConvert(queries):
    allTankClasses = [Tank.objects.raw(query) for query in queries]

    for i in range(0, len(allTankClasses)):
        fixLink(allTankClasses[i])
        allTankClasses[i] = serializers.serialize("json", allTankClasses[i])

    return allTankClasses[0], allTankClasses[1], allTankClasses[2], allTankClasses[3], allTankClasses[4]

def findNationsToExclude(nationsToKeep: str):
    allNations = Narod.objects.all().values("nazev")
    nationsToKeep = nationsToKeep.split(",")
    excludedNations = []
    if nationsToKeep[0] != "":
        # Get nations to exclude
        excludedNations = [list(Narod.objects.filter(nazev = oneNation["nazev"]).values("idnarod"))[0]["idnarod"] for oneNation in allNations if oneNation["nazev"] not in nationsToKeep]
    
    return excludedNations

def findTiersToExclude(tiersToKeep: str):
    allTiers = Tier.objects.all().values("tier")
    tiersToKeep = tiersToKeep.split(",")
    excludedTiers = []
    if tiersToKeep[0] != "":
        # Get tiers to exclude 
        excludedTiers = [list(Tier.objects.filter(tier = oneTier["tier"]).values("idtier"))[0]["idtier"] for oneTier in allTiers if oneTier["tier"] not in tiersToKeep]

    return excludedTiers

def index(response):
    lightTanks = []
    mediumTanks = []
    heavyTanks = []
    tankDestroyers = []
    artys = []
    tankClasses = Kategorie.objects.all().values()
    for tankClass in tankClasses:
        if tankClass["nazev"] == "lehke":
            lightTankId = tankClass["idkategorie"]
        elif tankClass["nazev"] == "stredni":
            mediumTankId = tankClass["idkategorie"]
        elif tankClass["nazev"] == "tezke":
            heavyTankId = tankClass["idkategorie"]
        elif tankClass["nazev"] == "stihace":
            tdId = tankClass["idkategorie"]
        elif tankClass["nazev"] == "artyny":
            artyId = tankClass["idkategorie"]

    # Get all tanks sorted to categories without any special filters
    lightTanks = Tank.objects.filter(kategorie = int(lightTankId))
    mediumTanks = Tank.objects.filter(kategorie = int(mediumTankId))
    heavyTanks = Tank.objects.filter(kategorie = int(heavyTankId))
    tankDestroyers = Tank.objects.filter(kategorie = int(tdId))
    artys = Tank.objects.filter(kategorie = int(artyId))
    if response.is_ajax():
        nationsRequest = response.GET.get("n")
        nationsToExclude = findNationsToExclude(nationsRequest)
        tierRequest = response.GET.get("t")
        tiersToExclude = findTiersToExclude(tierRequest)
        premiumRequest = response.GET.get("p")
        accountTypeToExclude = "normal" if premiumRequest == "premko" else ""
        for nationToExclude in nationsToExclude:
            lightTanks = lightTanks.exclude(narod = nationToExclude)
            mediumTanks = mediumTanks.exclude(narod = nationToExclude)
            heavyTanks = heavyTanks.exclude(narod = nationToExclude)
            tankDestroyers = tankDestroyers.exclude(narod = nationToExclude)
            artys = artys.exclude(narod = nationToExclude)
        for tierToExclude in tiersToExclude:
            lightTanks = lightTanks.exclude(tanktier = tierToExclude)
            mediumTanks = mediumTanks.exclude(tanktier = tierToExclude)
            heavyTanks = heavyTanks.exclude(tanktier = tierToExclude)
            tankDestroyers = tankDestroyers.exclude(tanktier = tierToExclude)
            artys = artys.exclude(tanktier = tierToExclude)
        if accountTypeToExclude:
            lightTanks = lightTanks.exclude(tankstatus = 1)
            mediumTanks = mediumTanks.exclude(tankstatus = 1)
            heavyTanks = heavyTanks.exclude(tankstatus = 1)
            tankDestroyers = tankDestroyers.exclude(tankstatus = 1)
            artys = artys.exclude(tankstatus = 1)
        fixLink([lightTanks, mediumTanks, heavyTanks, tankDestroyers, artys])
        lightTanks = serializers.serialize("json", lightTanks)
        mediumTanks = serializers.serialize("json", mediumTanks)
        heavyTanks = serializers.serialize("json", heavyTanks)
        tankDestroyers = serializers.serialize("json", tankDestroyers)
        artys = serializers.serialize("json", artys)
        return JsonResponse({"light": lightTanks, "medium": mediumTanks, "heavy": heavyTanks, "td": tankDestroyers, "arty": artys}, status = 200)

    else:   # Initial page load (no filters applied)
        fixLink([lightTanks, mediumTanks, heavyTanks, tankDestroyers, artys])
        return render(response, "index.html", {"light": lightTanks, "medium": mediumTanks, "heavy": heavyTanks, "tds": tankDestroyers, "arty": artys})

def returnGunTier(gun):
    return gun.gun_idgun.nazev

def tankDetail(response, link="#"):
    linkToFilter = "http://tanky/" + link
    tankToShow = Tank.objects.get(odkaz = linkToFilter)
    tankToShow.hmotnost = round(tankToShow.hmotnost / 1000, 1)
    tankToShow.naklad = round(tankToShow.naklad / 1000, 1)

    gunsAvailableToTank = TankHasGun.objects.filter(tank=tankToShow.idtank).order_by("gun_idgun__guntier__idtier")

    if response.is_ajax():
        searchedTank = response.GET.get("text")
        newGunToShow = response.GET.get("gunId")
        if searchedTank is not None:
            searchResults = Tank.objects.filter(tanknazev__icontains=searchedTank)
            for tankFound in searchResults:
                tankFound.odkaz = tankFound.odkaz.split("/")[-1].lower()
            searchResults = serializers.serialize("json", searchResults)
            return JsonResponse({"foundTanks": searchResults}, status = 200)

        elif newGunToShow is not None:
            nonReloadingProperties = TankHasGun.objects.filter(tank = tankToShow.idtank, gun_idgun = newGunToShow)
            reloading = Nabijeni.objects.filter(tank_has_gun_tank = tankToShow.idtank, tank_has_gun_gun_idgun = newGunToShow)
            nonReloadingProperties = serializers.serialize("json", nonReloadingProperties)
            reloading = serializers.serialize("json", reloading)
            shellProperties = DeloHasNaboj.objects.filter(delo_iddelo = newGunToShow).order_by('poradi')
            shellProperties = serializers.serialize("json", shellProperties, indent = 1, use_natural_foreign_keys=True, use_natural_primary_keys=True)
            return JsonResponse({"nonReloadingProperties": nonReloadingProperties, "reloading": reloading,
                "shellProperties": shellProperties}, status = 200)
    highestTierGun = gunsAvailableToTank.last()
    nonReloadingProperties = TankHasGun.objects.get(tank = tankToShow.idtank, gun_idgun = highestTierGun.gun_idgun)
    reloading = Nabijeni.objects.filter(tank_has_gun_tank = tankToShow.idtank, tank_has_gun_gun_idgun = highestTierGun.gun_idgun)
    shellProperties = DeloHasNaboj.objects.filter(delo_iddelo = highestTierGun.gun_idgun).order_by('poradi')
    return render(response, "tank.html", {"tank": tankToShow, "guns": gunsAvailableToTank, "highestTierGun": highestTierGun.gun_idgun.nazev,
        "nonReloadingProperties": nonReloadingProperties, "reloading": reloading, "shellProperties": shellProperties
    })


#def compare(response):
    #return render(response, "compare.html")

# Create your views here.

