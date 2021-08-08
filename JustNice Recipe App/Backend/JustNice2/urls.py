"""JustNice2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from sharedfiles.views import *
from .views import populate, populateRec, home

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('user/', include('Accounts.urls')),
    path('recingred/', include('RecIngred.urls')),
    path('groclist/', include('groclist.urls')),
    path('uploadphoto/', saveFile),
    path('updatephoto/', updatePhoto),
    path('getphoto/', getPhoto),
    path('getphoto/<str:filename>/', dynamicPhoto),
    # path('populate/', populate), # Only enabled locally for ingred population
    # path('poprec/', populateRec), # Only enabled locally for rec population
] + static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)
