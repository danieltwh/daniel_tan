from django.db import models
from django.contrib.auth.models import User

from RecIngred.models import *

# Create your models here.

class Converts(models.Model):
    id = models.BigAutoField(db_column = 'id', primary_key = True)
    list_id = models.IntegerField(db_column = 'list_id')
    list_name = models.CharField(max_length = 120)
    isBought = models.BooleanField(default = False)
    ingred_quantity = models.FloatField()
    user_id = models.ForeignKey(User, models.CASCADE) # If user deletes account, delete all related recipes
    ingred_id = models.ForeignKey(Ingredient, models.CASCADE) # FK since many ingred needed in 1 recipe