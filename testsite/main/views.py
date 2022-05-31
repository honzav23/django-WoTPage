from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from main.models import Tank
from main.models import Kategorie


def fixLink(allTankClasses):
    for tankClass in allTankClasses:
        for tank in tankClass:
            tank.odkaz = tank.odkaz.split('/')[-1].lower()


def jsonConvert(queries):
    allTankClasses = [Tank.objects.raw(query) for query in queries]

    for i in range(0, len(allTankClasses)):
        fixLink(allTankClasses[i])
        allTankClasses[i] = serializers.serialize('json', allTankClasses[i])

    return allTankClasses[0], allTankClasses[1], allTankClasses[2], allTankClasses[3], allTankClasses[4]

def index(response):
    lightTanks = []
    mediumTanks = []
    heavyTanks = []
    tankDestroyers = []
    artys = []
    tankClasses = Kategorie.objects.all().values()
    for tankClass in tankClasses:
        if tankClass['nazev'] == 'lehke':
            lightTankId = tankClass['idkategorie']
        elif tankClass['nazev'] == 'stredni':
            mediumTankId = tankClass['idkategorie']
        elif tankClass['nazev'] == 'tezke':
            heavyTankId = tankClass['idkategorie']
        elif tankClass['nazev'] == 'stihace':
            tdId = tankClass['idkategorie']
        elif tankClass['nazev'] == 'artyny':
            artyId = tankClass['idkategorie']
    if response.is_ajax():
        queries = [f"SELECT * FROM tank WHERE Kategorie = '{tankClass}' " for tankClass in tankClasses]
        res1 = response.GET.get('n')
        res2 = response.GET.get('t')
        res3 = response.GET.get('p')
        print(res1)
        if res1:
            nations = res1.split(',')
            nations = "','".join(nations)
            for i in range(0,len(queries)):
                queries[i] += f"AND Narod IN ('{nations}') "
        if res2:
            tiers = res2.split(',')
            tiers = "','".join(tiers)
            for i in range(0,len(queries)):
                queries[i] += f"AND Tier IN ('{tiers}') "
        if res3 == "premko":
            for i in range(0,len(queries)):
                queries[i] += "AND Status = 'premko' "
        lightTanks, mediumTanks, heavyTanks, tankDestroyers, artys = jsonConvert(queries)
        return JsonResponse({'light': lightTanks, "medium": mediumTanks, "heavy": heavyTanks, "td": tankDestroyers, "arty": artys}, status = 200)

    else:   #Initial page load (no filters applied)
        lightTanks = Tank.objects.filter().filter(kategorie = int(lightTankId))
        mediumTanks = Tank.objects.filter(kategorie = int(mediumTankId))
        heavyTanks = Tank.objects.filter(kategorie = int(heavyTankId))
        tankDestroyers = Tank.objects.filter(kategorie = int(tdId))
        artys = Tank.objects.filter(kategorie = int(artyId))
        fixLink([lightTanks, mediumTanks, heavyTanks, tankDestroyers, artys])
        return render(response, 'index.html', {'light': lightTanks, 'medium': mediumTanks, 'heavy': heavyTanks, 'tds': tankDestroyers, 'arty': artys})

def show(response, link="#"):
    tanciky = Tank.objects.raw('SELECT * FROM tank')
    index = 0
    tanksFound = []
    secondGuns = []
    for t in tanciky:
        tankLink = t.odkaz
        tankLinkName = tankLink.split('/')[-1].lower()
        t.hmotnost /= 1000
        t.naklad /= 1000
        index += 1
    if response.is_ajax():
        fetchedText = response.GET.get('text')
        if fetchedText is not None:
            tanksFound = Tank.objects.filter(nazev__icontains=fetchedText)
            for tankFound in tanksFound:
                tankFound.odkaz = tankFound.odkaz.split('/')[-1].lower()
            tanksFound = serializers.serialize('json', tanksFound)
            return JsonResponse({'foundTanks': tanksFound}, status = 200)
    return render(response, 'tank.html', {'tank':tanciky[index], 'foundTanks': tanksFound, 'foundSecondGuns': secondGuns})


#def compare(response):
    #return render(response, 'compare.html')

# Create your views here.

