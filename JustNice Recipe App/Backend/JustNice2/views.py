from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from rest_framework.parsers import JSONParser
from json import dumps, load, loads
from requests import get

from RecIngred.models import *
from data.dataparser import read_csv
from sharedfiles.views import findPhoto, nameMaker


# Create your views here

# These 2 views are used to populate the db with the desired stuff 
# ENABLE THE URLS FIRST BEFORE RUNNING THEM.
# ONLY TO BE DONE LOCALLY 
@csrf_exempt
def populate(request):
    try:
        rows = load(open("C:/Users/Anthony/dev/JustNice2/data/Ingredients v6.json"))
        # print(Ingredient(**rows[0]).save())
        # print(rows[0])
        for row in rows:
            ingred = Ingredient(**row).save()
            # print(ingred)
        return JsonResponse("Ingredients added", safe = False)
    except:
        return JsonResponse("Population failed", safe = False)
        # return JsonResponse(f"Failed to add {ingred}", safe = False)

@csrf_exempt
def populateRec(request):
    try:
        # First we load the json file of data
        rows = load(open("C:/Users/Anthony/dev/JustNice2/data/Extracted.json"))
        user = User.objects.get(id = 1)
        # print(user)
        # print(rows[0])
        for row in rows[0:24]:
            # For each row, prep the details
            ingredients = row['ingredients'].split(',') # List of ingreds
            quantity = row['quantity'].split(',') # List of qty
            rec_details = { 
                "rec_name" : row['rec_name'],
                'rec_instructions' : row['rec_instructions'],
                'cooking_time' : row['cooking_time'],
                'serving_pax' : row['serving_pax'],
                'cuisine' : row['cuisine'],
                'rec_type' : row['rec_type'],
                'isPublished' : True,
                'user_id' : user
            }
            rec = Recipe(**rec_details)
            rec.save() 
            # print(rec)

            # Now we create/update the Requires table 
            for i in range(len(ingredients)):
                ingred_name = ingredients[i]
                qty = quantity[i]
                # print(ingred_name)
                # print(qty)
                ingredient = Ingredient.objects.get(ingred_name = ingred_name) 
                Requires.objects.create(ingred_id = ingredient, rec_id = rec, quantity = qty)

            # Finally we upload the photo for the rec
            rec_id = rec.rec_id # Get id
            filename = "rec" + str(rec_id) + ".jpg" # Filename of photo

            photo_url = row['rec_photo'] 
            req = get(photo_url, stream = True) # Get the photo from the url
            req.raw.decode_content = True
            photo = req.raw # The photo itself
            default_storage.save(filename, photo) # Save photo

        return JsonResponse("Recipes added", safe = False)
    except:
        return JsonResponse("Population failed", safe = False)

def home(request):
    return JsonResponse("Homepage of JustNice", safe = False)