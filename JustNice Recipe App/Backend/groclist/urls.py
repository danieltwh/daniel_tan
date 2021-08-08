from django.contrib import admin
from django.urls import path
from .views import * # IMPORT THE VIEWS

from django.conf.urls.static import static
from django.conf import settings

app_name = 'groclist' # Remember to set the app name

urlpatterns = [
    path('', home), # Home
    path('getter/', grocListGetter),
    path('getter/<int:id>/', grocListGetter), # Get user with user_id = id's list of lists
    path('update/', grocListUpdater), # Putting stuff into list with list_id = id
    path('update/<int:user_id>/<int:list_id>/', grocListUpdater)


] + static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)
