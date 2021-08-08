from rest_framework import serializers
from .models import *

# ModelSerializer is like a ModelForm

class ConvSerializer(serializers.ModelSerializer):
    class Meta:
        model = Converts
        fields = '__all__'

class ConvListIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Converts
        fields = ['list_id', 'list_name']

class ConvBoughtQtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Converts
        fields = ['isBought', 'ingred_quantity']