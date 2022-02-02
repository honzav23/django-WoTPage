from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from main.models import Tank
from main.models import Dela


def fixLink(tanks):
    for tank in tanks:
        tank.odkaz = tank.odkaz.split('/')[-1].lower()


def jsonConvert(queries):
    allTankClasses = []
    for i in range(0, 5):
        x = Tank.objects.raw(queries[i])
        allTankClasses.append(x)

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
    if response.is_ajax():
        tankClasses = ['lehke', 'stredni', 'tezke', 'stihace', 'artyny']
        queries = []
        print("here")
        for tankClass in tankClasses:
            queryToPush = f"SELECT * FROM tank WHERE Kategorie = '{tankClass}' "
            queries.append(queryToPush)
        res1 = response.GET.get('n')
        res2 = response.GET.get('t')
        res3 = response.GET.get('p')
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
    else:
        lightTanks = Tank.objects.raw('SELECT * FROM tank WHERE Kategorie = %s', ['lehke'])
        fixLink(lightTanks)
        mediumTanks = Tank.objects.raw('SELECT * FROM tank WHERE Kategorie = %s', ['stredni'])
        fixLink(mediumTanks)
        heavyTanks = Tank.objects.raw('SELECT * FROM tank WHERE Kategorie = %s', ['tezke'])
        fixLink(heavyTanks)
        tankDestroyers = Tank.objects.raw('SELECT * FROM tank WHERE Kategorie = %s', ['stihace'])
        fixLink(tankDestroyers)
        artys = Tank.objects.raw('SELECT * FROM tank WHERE Kategorie = %s', ['artyny'])
        fixLink(artys)
        return render(response, 'index.html', {'light': lightTanks, 'medium': mediumTanks, 'heavy': heavyTanks, 'tds': tankDestroyers, 'arty': artys})

def show(response, link="#"):
    tanciky = Tank.objects.raw('SELECT * FROM tank WHERE Prubojnost1 != %s', ['10000'])
    index = 0
    tanksFound = []
    secondGuns = []
    for t in tanciky:
        tankLink = t.odkaz
        tankLinkName = tankLink.split('/')[-1].lower()
        t.hmotnost /= 1000
        t.naklad /= 1000
        if tankLinkName == link:
            if t.vicedel == '1':
                if t.nazev == "Rhm.-Borsig Waffenträger":
                    secondGuns = Dela.objects.get(nazev="Borsig")
                elif t.nazev == "Waffenträger auf Pz. IV":
                    secondGuns = Dela.objects.get(nazev="Wafle")
                else:
                    secondGuns = Dela.objects.get(nazev=t.nazev)
            break
        index += 1
    if response.is_ajax():
        print("zde")
        whatToSearch = response.GET.get('text')
        tanksFound = Tank.objects.filter(nazev__icontains=whatToSearch)
        for tankFound in tanksFound:
            tankFound.odkaz = tankFound.odkaz.split('/')[-1].lower()
        tanksFound = serializers.serialize('json', tanksFound)
        return JsonResponse({'foundTanks': tanksFound}, status = 200)
    return render(response, 'tank.html', {'tank':tanciky[index], 'foundTanks': tanksFound, 'foundSecondGuns': secondGuns})
# Create your views here.

