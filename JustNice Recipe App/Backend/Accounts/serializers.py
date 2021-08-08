from rest_framework import serializers
from django.contrib.auth.models import User

# ModelSerializer is like a ModelForm

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'id', 'first_name', 'last_name',
            'password', )
        