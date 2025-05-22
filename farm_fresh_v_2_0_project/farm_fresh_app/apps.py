"""  This file contains the settings for the farm_fresh_app. """
from django.apps import AppConfig


class FarmFreshAppConfig(AppConfig):
    """ This class will create the farm_fresh_app config """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'farm_fresh_app'
