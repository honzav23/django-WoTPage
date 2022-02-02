from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("tank/<str:link>", views.show, name="tank"),
    #path("index2/", views.index, name="index2"),
]
