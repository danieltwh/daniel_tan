from django.core.files.storage import default_storage
from django.db.models.functions import Length
from django.http.response import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from json import dumps
from rest_framework.parsers import JSONParser

from django.contrib.auth.models import User
from .models import *
from .serializers import *
from sharedfiles.views import findPhoto, nameMaker

# Create your views here

def home(request):
    return HttpResponse("Home page for rec and ingred")

# Recipe creation with no linking to ingred. THIS IS DEPRECATED
# @csrf_exempt
# def recNoIngred(request, id = 0, *args, **kwargs):
#     if request.method == "GET":
#         recipes = Recipe.objects.all()
#         # Recipe.objects.all().delete() # DO NOT UNCOMMENT. THIS IS TO CLEAR THE USER DB
#         rec_serializer = RecSerializer(recipes, many = True)
#         return JsonResponse(rec_serializer.data, safe = False)
#     elif request.method == "POST": # Submission of recipes 
#         rec_data = JSONParser().parse(request)
#         rec_serializer = RecSerializer(data = rec_data)
#         if rec_serializer.is_valid():
#             rec_data["user_id"] = User.objects.get(id = rec_data["user_id"])
#             Recipe.objects.create(**rec_data)
#             return JsonResponse("Added Successfully", safe = False)
#         print(rec_serializer.errors) # Print errors 
#         return JsonResponse("Failed to add", safe = False)
#     elif request.method == "PUT":
#         rec_data = JSONParser().parse(request)
#         rec = Recipe.objects.get(rec_name = rec_data['rec_name'])
#         rec_serializer = RecSerializer(rec, data = rec_data)
#         if rec_serializer.is_valid():
#             rec_serializer.save()
#             return JsonResponse("Updated Successfully", safe = False)
#         return JsonResponse("Failed to update", safe = False)
#     elif request.method == "DELETE":
#         rec = Recipe.objects.get(id = id)
#         rec.delete()
#         return JsonResponse("Deleted successfully", safe = False)

# Ingred Creation
@csrf_exempt
def ingredView(request, id = 0, *args, **kwargs): 
    # No update/delete as this db should be fully created and unedited thereafter
    if request.method == "GET":
        ingredients = Ingredient.objects.all()
        # Ingredient.objects.all().delete() # DO NOT UNCOMMENT. THIS IS TO CLEAR THE USER DB
        ingred_serializer = IngredSerializer(ingredients, many = True)
        return JsonResponse(ingred_serializer.data, safe = False)
    elif request.method == "POST":
        try:
            ingred_data = JSONParser().parse(request)
            ingred_serializer = IngredSerializer(data = ingred_data)
            #ingred_data.pop('ingred_id', "required_default")
            exist = Ingredient.objects.filter(ingred_name = ingred_data['ingred_name']).exists() # Check existence
            res = {"status" : "Failed to add"}
            if ingred_serializer.is_valid() and not exist:
                Ingredient.objects.create(**ingred_data)
                res['status'] = f"Successfully added {ingred_data['ingred_name']}"
                return JsonResponse(res, safe = False)
            elif exist:
                res['status'] = f"{ingred_data['ingred_name']} already exists"
                return JsonResponse(res, safe = False)
        except:
            return JsonResponse(res, safe = False)

# Verification view on whether an ingredient exists in our DB
@csrf_exempt
def verifyIngred(request): 
    if request.method == "GET":
        return JsonResponse("This page is for verifying ingredients", safe = False)
    elif request.method == "POST":
        ingred_data = JSONParser().parse(request) # Parse ingredient info
        keywords = ingred_data['ingred_name'].split()
        keywords_full = ' '.join(keywords)
        res = Ingredient.objects.all()
        for keyword in keywords: # Start filtering 
            res = res.filter(ingred_name__icontains = keyword)
        if len(res) > 1 and len(keywords) > 1: # If more than one result, we take the exact keyword 
            res = res.order_by(Length('ingred_name'))[0:1]
        elif len(keywords) == 1: # Filter for exact
            res = res.filter(ingred_name__iexact = keyword)
        if res.exists():
            res = IngredSerializer(res.get())
            return JsonResponse(res.data, safe = False)
        return JsonResponse("Does not exist", safe = False)

# Actual recipe creation page
@csrf_exempt
def recipeCreation(request): 
    # Recipe.objects.all().delete() # DO NOT UNCOMMENT. THIS IS TO CLEAR THE USER DB
    if request.method == "GET":
        recipes = Recipe.objects.all()
        rec_serializer = RecSerializer(recipes, many = True)
        return JsonResponse(rec_serializer.data, safe = False)
        # return JsonResponse("This page is for creating recipes", safe = False)
    elif request.method == "POST":
        rec_data = JSONParser().parse(request)
        ingredients = rec_data.pop('ingredients') # Take out the ingredients
        res = {"status" : -1}

        # First we create/update the recipe in Recipe table
        rec_serializer = RecSerializer(data = rec_data)
        if rec_serializer.is_valid(): # Validate
            rec_data["user_id"] = User.objects.get(id = rec_data["user_id"]) # Get the User for the foreign key
            recipe = Recipe(**rec_data) # Create/update recipe
            recipe.save()
            res['status'] = 1
            res['msg'] = f"Successfully added {recipe.rec_name}"
            res['rec_id'] = recipe.rec_id

            # Now we create/update the Requires table
            if Requires.objects.filter(rec_id = recipe.rec_id).exists(): # Delete before update 
                Requires.objects.filter(rec_id = recipe.rec_id).delete()
                res['msg'] = f"Successfully updated {recipe.rec_name}"
            for ingredient in ingredients: 
                for ingred_id, data in ingredient.items():
                    try:
                        ingredient = Ingredient.objects.get(ingred_id = ingred_id) # Get actual ingredient
                    except: # DNE so we create
                        ingredient = Ingredient.objects.create(ingred_name = data['ingred_name'], ingred_unit = data['ingred_unit'], ingred_cat = 'Uncategorised')
                        data = data['ingred_quantity']
                    Requires.objects.create(ingred_id = ingredient, rec_id = recipe, quantity = data) # Create Requires entry

            # Finally we set a default photo for the rec 
            rec_id = res['rec_id'] # Get id
            filename = "rec" + str(rec_id) + ".jpg"
            default_photo = default_storage.open("default.jpg") # Get photo
            default_storage.save(filename, default_photo) # Save copy

            # for ingred_id, data in ingredients.items():
            #     try:
            #         ingredient = Ingredient.objects.get(ingred_id = ingred_id) # Get actual ingredient
            #     except: # DNE so we create
            #         ingredient = Ingredient.objects.create(ingred_name = data['ingred_name'], ingred_unit = data['ingred_unit'], ingred_cat = 'Uncategorised')
            #         data = data['ingred_quantity']
            #     Requires.objects.create(ingred_id = ingredient, rec_id = recipe, quantity = data) # Create Requires entry
            return JsonResponse(res, safe = False)
        else: # For debugging 
            print(rec_serializer.errors)
            res['status'] = -1
            res['msg'] = "Failed to add"
            res.pop('rec_id')
        return JsonResponse(res, safe = False)
    elif request.method == "DELETE":
        res = {"status" : "Failed to delete"}
        try:
            rec_data = JSONParser().parse(request)
            rec_id = rec_data['rec_id']
            rec = Recipe.objects.get(rec_id = rec_id) # Get recipe 
            filename = "rec" + str(rec.rec_id)
            filename = findPhoto(filename)['filename']

            # Delete photo then the recipe
            default_storage.delete(filename)
            rec.delete() # Delete the user 
            res['status'] = "Deleted successfully"
            return JsonResponse(res, safe = False)
        except:
            return JsonResponse(res, safe = False)

# Getting all the recipes of the user 
@csrf_exempt
def getUserRec(request):
    if request.method == "GET":
        return JsonResponse("This page is for getting recipes of a user", safe = False)
    elif request.method == 'POST':
        user_id = JSONParser().parse(request)['user_id']
        recipes = Recipe.objects.filter(user_id = user_id)
        rec_serializer = RecSerializer(recipes, many = True)
        res = rec_serializer.data
        # Now we add the photo url in
        for rec in res:
            filename = "rec" + str(rec['rec_id'])
            rec['url'] = findPhoto(filename)['url']
        return JsonResponse(res, safe = False)

@csrf_exempt
# Search bar for recipes
def searchRec(request): 
    if request.method == "GET":
        recipes = Recipe.objects.filter(isPublished = True)
        rec_serializer = RecSerializer(recipes, many = True)
        res = rec_serializer.data
        # Now we add the photo url in
        for rec in res:
            filename = "rec" + str(rec['rec_id'])
            rec['url'] = findPhoto(filename)['url']
        return JsonResponse(res, safe = False)
        # return JsonResponse(rec_serializer.data, safe = False)
        # return JsonResponse("This page is for creating recipes", safe = False)
    elif request.method == "POST":
        rec_data = JSONParser().parse(request)
        category = rec_data['category'] # Get the category
        keywords = rec_data['keywords'].split() # Split the keywords
        res = {}
        # Then we search based on the category given
        if category == "recingred":
            rec = Recipe.objects.filter(rec_name__icontains = keywords[0])
            ingredients = Ingredient.objects.filter(ingred_name__icontains = keywords[0]).values("ingred_id")
            for keyword in keywords[1:]:
                rec = rec.union(Recipe.objects.filter(rec_name__icontains = keyword))
                ingredients = ingredients.union(Ingredient.objects.filter(ingred_name__icontains = keyword).values("ingred_id"))
            ingred = Requires.objects.filter(ingred_id__in = ingredients)
            recingred = rec.union(ingred).values("rec_id")
            recipes = Recipe.objects.filter(rec_id__in = recingred)
        elif category == "cooking_time":
            recipes = Recipe.objects.filter(cooking_time__icontains = float(keywords[0]))
        elif category == "serving_pax":
            recipes = Recipe.objects.filter(serving_pax__icontains = int(keywords[0]))
        elif category == "cuisine":
            recipes = Recipe.objects.filter(cuisine__in = keywords)
        elif category == "rec_type":
            recipes = Recipe.objects.filter(rec_type__in = keywords)
        recipes = recipes.filter(isPublished = True) # Keep only those recipes that are public 
        rec_serializer = RecSerializer(recipes, many = True)
        res = rec_serializer.data
        # Now we add the photo url in
        for rec in res:
            filename = "rec" + str(rec['rec_id'])
            rec['url'] = findPhoto(filename)['url']
        return JsonResponse(res, safe = False)

@csrf_exempt
def complexSearch(request): 
    if request.method == "GET":
        recipes = Recipe.objects.filter(isPublished = True)
        rec_serializer = RecSerializer(recipes, many = True)
        res = rec_serializer.data
        # Now we add the photo url in
        for rec in res:
            filename = "rec" + str(rec['rec_id'])
            rec['url'] = findPhoto(filename)['url']
        return JsonResponse(res, safe = False)
        # return JsonResponse(rec_serializer.data, safe = False)
        # return JsonResponse("This page is for creating recipes", safe = False)
    elif request.method == "POST":
        data = JSONParser().parse(request)
        res = Recipe.objects.filter(rec_id = 0)
        counter = 1
        for rec_data in data:
            category = rec_data['category'] # Get the category
            keywords = rec_data['keywords'].split() # Split the keywords
            # Then we search based on the category given
            if category == "recingred":
                rec = Recipe.objects.filter(rec_name__icontains = keywords[0], isPublished = True)
                ingredients = Ingredient.objects.filter(ingred_name__icontains = keywords[0]).values("ingred_id")
                for keyword in keywords[1:]:
                    rec = rec.union(Recipe.objects.filter(rec_name__icontains = keyword, isPublished = True))
                    ingredients = ingredients.union(Ingredient.objects.filter(ingred_name__icontains = keyword).values("ingred_id"))
                ingred = Requires.objects.filter(ingred_id__in = ingredients)
                recingred = rec.union(ingred).values("rec_id")
                if res.exists():
                    res = res.intersection(Recipe.objects.filter(rec_id__in = recingred, isPublished = True))
                elif counter == 1:
                    res = res.union(Recipe.objects.filter(rec_id__in = recingred, isPublished = True))
            elif category == "cooking_time":
                if res.exists():
                    res = res.intersection(Recipe.objects.filter(cooking_time__icontains = float(keywords[0]), isPublished = True))
                elif counter == 1:
                    res = res.union(Recipe.objects.filter(cooking_time__icontains = float(keywords[0]), isPublished = True))
            elif category == "serving_pax":
                if res.exists():
                    res = res.intersection(Recipe.objects.filter(serving_pax__icontains = int(keywords[0]), isPublished = True))
                elif counter == 1:
                    res = res.union(Recipe.objects.filter(serving_pax__icontains = int(keywords[0]), isPublished = True))
            elif category == "cuisine":
                if res.exists():
                    res = res.intersection(Recipe.objects.filter(cuisine__in = keywords, isPublished = True))
                elif counter == 1:
                    res = res.union(Recipe.objects.filter(cuisine__in = keywords, isPublished = True))
            elif category == "rec_type":
                if res.exists():
                    res = res.intersection(Recipe.objects.filter(rec_type__in = keywords, isPublished = True))
                elif counter == 1:
                    res = res.union(Recipe.objects.filter(rec_type__in = keywords, isPublished = True))
            counter += 1
        rec_serializer = RecSerializer(res, many = True)
        res = rec_serializer.data
        # Now we add the photo url in
        for rec in res:
            filename = "rec" + str(rec['rec_id'])
            rec['url'] = findPhoto(filename)['url']
        return JsonResponse(res, safe = False)

# Getting full recipe of the user with ingredients
@csrf_exempt
def getFullRecipe(request):
    if request.method == "GET":
        return JsonResponse("This page is for getting a full recipe with ingredients", safe = False)
    elif request.method == 'POST':
        rec_id = JSONParser().parse(request)['rec_id']
        recipe = Recipe.objects.get(rec_id = rec_id) # First we get the recipe
        rec_serializer = RecSerializer(recipe)
        res = rec_serializer.data # Append to final result
        ingredients = Requires.objects.filter(rec_id = rec_id).values('ingred_id_id', 'quantity') # Then we get all the ingred and qty involved
        ingred_serializer = []
        quantity = {}
        for idPair in ingredients:
            ingred_serializer.append(Ingredient.objects.get(ingred_id = idPair['ingred_id_id'])) # Collect ingredients 
            quantity[idPair['ingred_id_id']] = idPair['quantity'] # Store quantity
        ingred_serializer = IngredSerializer(ingred_serializer, many = True) 
        for ingredient in ingred_serializer.data: # This is to integrate the quantity into ingredient for readability
            ingredient['ingred_quantity'] = quantity[ingredient['ingred_id']]
        res['ingredient'] = ingred_serializer.data # Append to final res
        # Now we add the photo in
        filename = "rec" + str(res['rec_id'])
        res['url'] = findPhoto(filename)['url']
        return JsonResponse(res, safe = False)