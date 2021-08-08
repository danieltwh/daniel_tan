from django.contrib import admin
from django.urls import path
from .views import *
from sharedfiles.views import saveFile

from django.conf.urls.static import static
from django.conf.urls import url
from django.conf import settings

app_name = 'Accounts' # Remember to set the app name

urlpatterns = [
    # path('', home_view, name = 'home'),
    # path('api/lead/', LeadListCreate.as_view()), #CBV 
    path('', userApi), #CBV 
    path('login/', login),
    path('<int:id>/', userApi),
    path('uploadphoto/', saveFile),
    path('checkuser/', verifyUser), # User validation
] + static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)
