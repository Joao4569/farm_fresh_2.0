"""  This module defines the URL patterns for the farm_fresh_app. """
from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home')
]
