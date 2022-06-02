from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from main.models import Tank, Kategorie, Narod, Tier


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
        # queries = [f"SELECT * FROM tank WHERE Kategorie = "{tankClass}" " for tankClass in tankClasses]
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
            lightTanks = lightTanks.exclude(tier = tierToExclude)
            mediumTanks = mediumTanks.exclude(tier = tierToExclude)
            heavyTanks = heavyTanks.exclude(tier = tierToExclude)
            tankDestroyers = tankDestroyers.exclude(tier = tierToExclude)
            artys = artys.exclude(tier = tierToExclude)
        if accountTypeToExclude:
            lightTanks = lightTanks.exclude(status = 1)
            mediumTanks = mediumTanks.exclude(status = 1)
            heavyTanks = heavyTanks.exclude(status = 1)
            tankDestroyers = tankDestroyers.exclude(status = 1)
            artys = artys.exclude(status = 1)
        lightTanks = serializers.serialize("json", list(lightTanks))
        mediumTanks = serializers.serialize("json", list(mediumTanks))
        heavyTanks = serializers.serialize("json", list(heavyTanks))
        tankDestroyers = serializers.serialize("json", list(tankDestroyers))
        artys = serializers.serialize("json", list(artys))
        return JsonResponse({"light": lightTanks, "medium": mediumTanks, "heavy": heavyTanks, "td": tankDestroyers, "arty": artys}, status = 200)

    else:   # Initial page load (no filters applied)
        fixLink([lightTanks, mediumTanks, heavyTanks, tankDestroyers, artys])
        return render(response, "index.html", {"light": lightTanks, "medium": mediumTanks, "heavy": heavyTanks, "tds": tankDestroyers, "arty": artys})

def tankDetail(response, link="#"):
    tankToShow = Tank.objects.filter(odkaz__icontains = link)[0]
    tankToShow.hmotnost = round(tankToShow.hmotnost / 1000, 1)
    tankToShow.naklad = round(tankToShow.naklad / 1000, 1)
    index = 0
    tanksFound = []
    secondGuns = []
    # for t in tanciky:
    #     tankLink = t.odkaz
    #     tankLinkName = tankLink.split("/")[-1].lower()
    #     t.hmotnost /= 1000
    #     t.naklad /= 1000
    #     index += 1
    # if response.is_ajax():
    #     fetchedText = response.GET.get("text")
    #     if fetchedText is not None:
    #         tanksFound = Tank.objects.filter(nazev__icontains=fetchedText)
    #         for tankFound in tanksFound:
    #             tankFound.odkaz = tankFound.odkaz.split("/")[-1].lower()
    #         tanksFound = serializers.serialize("json", tanksFound)
    #         return JsonResponse({"foundTanks": tanksFound}, status = 200)
    return render(response, "tank.html", {"tank": tankToShow})


#def compare(response):
    #return render(response, "compare.html")

# Create your views here.

