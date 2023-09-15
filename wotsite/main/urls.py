from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("tank/<str:link>", views.tankDetail, name="tank"),
    #path("compare", views.compare, name="compare")
    #path("index2/", views.index, name="index2"),
]
