from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomePage, name='Home'),
    path('server/view/', views.viewData, name='viewData'),
    path('server/create/', views.createData, name='createData'),
    path('server/update-shortlist/', views.updateShortlistData, name='updateShortlistData'),
]
