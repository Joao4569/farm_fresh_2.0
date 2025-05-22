"""  This file contains the views for the farm_fresh_app. """
from django.shortcuts import render


def home(request):
    """ This function will render the home page """
    return render(request, 'home/index.html')
