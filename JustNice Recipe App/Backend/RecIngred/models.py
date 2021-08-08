from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Recipe(models.Model):
    rec_id = models.AutoField(db_column = 'rec_id', primary_key = True)
    rec_name = models.CharField(max_length = 120)
    rec_instructions = models.TextField()
    cooking_time = models.FloatField()
    serving_pax = models.IntegerField()
    cuisine = models.CharField(max_length = 120)
    rec_type = models.CharField(max_length = 120)
    isPublished = models.BooleanField(default = False)
    user_id = models.ForeignKey(User, models.CASCADE) # If user deletes account, delete all related recipes

class Ingredient(models.Model):
    ingred_id = models.AutoField(db_column = 'ingred_id', primary_key = True)    
    ingred_name = models.CharField(max_length = 120, unique = True)
    ingred_unit = models.CharField(max_length = 120)
    ingred_cat = models.CharField(max_length = 120)


class Requires(models.Model): # This is a weak entity marking ingred needed in a rec
    rec_id = models.OneToOneField("Recipe", models.CASCADE) # 1-1 returns a direct obj since 1 recipe has many ingred
    ingred_id = models.ForeignKey("Ingredient", models.CASCADE) # FK since many ingred needed in 1 recipe
    quantity = models.FloatField()
