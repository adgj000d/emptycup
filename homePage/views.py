from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DesignersSerializer

from .models import Designers

# Create your views here.

@api_view(['GET'])
def viewData(request):
    data = Designers.objects.all()
    serializer = DesignersSerializer(data, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def createData(request):
    data = request.data

    designers = Designers.objects.create(
        name = data['name'],
        description = data['description'],
        rating = data['rating'],
        projects = data['projects'],
        experience = data['experience'],
        price = data['price'],
        contacts = data['contacts']
    )

    serializer = DesignersSerializer(designers, many=False)
    
    return Response({'Success'})

@api_view(['POST'])
def updateShortlistData(request):
    data = request.data
    designer = Designers.objects.get(id=data['id'])

    designer.shortlist = data['shortlist']
    designer.save()

    serializer = DesignersSerializer(designer, many=False)

    return Response(serializer.data)

def HomePage(request):
    return render(request, 'home.html')