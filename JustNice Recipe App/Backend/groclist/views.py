from django.db.models.functions import Length
from django.http import HttpRequest
from django.http.response import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework.parsers import JSONParser

from django.contrib.auth.models import User
from .models import *
from .serializers import *
from RecIngred.serializers import *
from RecIngred.models import *
from RecIngred.views import getFullRecipe

# Create your views here.

def home(request):
    return HttpResponse("Home page for grocery list")

@csrf_exempt
def grocListGetter(request, id = 0): # This is for putting an empty list/ getting all the lists
    if request.method == "GET":
        unique = Converts.objects.filter(user_id = id).values("list_id").distinct()
        converts = Converts.objects.filter(list_id__in = unique, user_id = id).distinct()
        print(converts)
        res = []
        unique = -1
        for convert in converts:
            if convert.list_id != unique:
                res.append(convert)
                unique = convert.list_id
        # converts.objects.all().delete() # DO NOT UNCOMMENT. THIS IS TO CLEAR THE USER DB
        conv_serializer = ConvListIdSerializer(res, many = True)
        return JsonResponse(conv_serializer.data, safe = False)
    elif request.method == "POST": # Creating empty groc list 
        conv_data = JSONParser().parse(request)
        user_id, list_id, name = conv_data['user_id'], conv_data['list_id'], conv_data['list_name']
        user = User.objects.get(id = user_id) # Get the user 
        # rec = Recipe.objects.get(rec_id = 1)
        ingred = Ingredient.objects.get(ingred_id = 1)
        if Converts.objects.filter(user_id = user, list_id = list_id).exists():
            return JsonResponse({"status" : "Already created"})
        Converts.objects.create(user_id = user, ingred_id = ingred, ingred_quantity = 0, list_name = name, list_id = list_id)
        return JsonResponse({"status" : "New list created"})
    return JsonResponse({"status" : "An error has occurred"}, safe = False)

@csrf_exempt
def grocListUpdater(request, user_id = 0, list_id = 0): # This is for putting stuff into the list and for getting a full list 
    if request.method == "GET": # Get the entire list 
        converts = Converts.objects.filter(list_id = list_id, user_id_id = user_id).exclude(ingred_id = 1) # Don't incl dummy
        dummy = Converts.objects.get(list_id = list_id, user_id_id = user_id, ingred_id = 1) # Get dummy
        list_name = dummy.list_name
        res = {"list_name" : list_name} # Final res 
        for convert in converts:
            ingredient = IngredSerializer(convert.ingred_id).data # Get ingred and serialize
            ingredient['ingred_quantity'] = convert.ingred_quantity
            ingredient['isBought'] = convert.isBought
            cat = ingredient['ingred_cat']
            if cat in res: # This category has been created
                res[cat].append(ingredient)
            else : # This category is not created yet
                res[cat] = [ingredient]
        # res = {"list_name" : "No list"} # Final res 
        return JsonResponse(res, safe = False)
    elif request.method == 'POST':
        conv_data = JSONParser().parse(request) # First we parse the data
        list_name = conv_data.pop("list_name")
        dummy = Converts.objects.get(list_id = list_id, user_id_id = user_id, ingred_id = 1) # Get dummy
        dummy.list_name = list_name
        dummy.save() # This is to update the list_name if any
        existing = Converts.objects.filter(list_id = list_id, user_id_id = user_id).exclude(ingred_id = 1) # Get existing entries 
        # Iterate through the recipes
        try:
            for rec_id, rec_quantity in conv_data.items(): 
                ingredients = Requires.objects.filter(rec_id = rec_id) # Get all the ingred and qty req
                for ingredient in ingredients:
                    qty_to_update = ingredient.quantity * rec_quantity # How much ingred to update
                    res = existing.filter(ingred_id = ingredient.ingred_id) # See if a curr record exists
                    if res.exists():
                        res = res.get()
                        res.ingred_quantity += qty_to_update # Update qty of old record 
                        res.isBought = False # Reset isBought status
                        res.save()
                    else: # No pre-existing record, so we create one
                        ingred_id = Ingredient.objects.get(ingred_id = ingredient.ingred_id_id)
                        new_entry = Converts(list_id = dummy.list_id, list_name = dummy.list_name, \
                            ingred_quantity = qty_to_update, user_id = dummy.user_id, ingred_id = ingred_id)
                        new_entry.save() # Save the new record        
            return JsonResponse({"status" : "Successfully updated"}, safe = False)
        except:
            return JsonResponse({"status" : "Failed to update"}, safe = False)
    elif request.method == 'PUT': # Update isbought status
        conv_data = JSONParser().parse(request) # First we parse the data
        for ingred_id, isBought in conv_data.items():
            existing = Converts.objects.get(list_id = list_id, user_id_id = user_id, ingred_id = ingred_id) # Get existing entries 
            existing.isBought = isBought
            existing.save()
        return JsonResponse({"status" : "Successfully updated"}, safe = False)
    elif request.method == 'DELETE': # Delete the entire list 
        existing = Converts.objects.filter(list_id = list_id, user_id_id = user_id) # Get existing entries 
        existing.delete()
        return JsonResponse({"status" : "Successfully deleted"}, safe = False)