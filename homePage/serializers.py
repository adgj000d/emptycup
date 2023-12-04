from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Designers

class DesignersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designers
        fields = '__all__'