from django.contrib import admin
from django.urls import path
from .views import * # IMPORT THE VIEWS

from django.conf.urls.static import static
from django.conf.urls import url
from django.conf import settings

app_name = 'RecIngred' # Remember to set the app name

urlpatterns = [
    path('', home), #CBV 
    # path('recipe/', recNoIngred), # Deprecated 
    # path('recipe/<int:id>/', recNoIngredView), # Deprecated 
    path ('recipe/', recipeCreation), # For creating recipes
    path('getallrec/', getUserRec), # Get list of user's recipe
    path('getfullrec/', getFullRecipe), # Get full recipe
    path('checkingred/', verifyIngred), # Ingredient validation
    path('ingred/', ingredView), # Ingredient CRUD
    path('search/', searchRec), # Normal search function
    path('compsearch/', complexSearch), # Complex search function
] + static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)
