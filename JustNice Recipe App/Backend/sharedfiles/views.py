from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.core.files.storage import default_storage

# Create your views here.

@csrf_exempt
def saveFile(request):
    # print(request.FILES)
    try:
        file = request.FILES['pic'] # Get the file 
        if "png" in file.name:
            filename = request.POST['filename'] + ".png" # Get filename
        elif "jpg" in file.name:
            filename = request.POST['filename'] + ".jpg" # Get filename
        elif "jpeg" in file.name:
            filename = request.POST['filename'] + ".jpeg" # Get filename
        file_name = default_storage.save(filename, file)
        return JsonResponse(file_name, safe = False)
    except:
        return JsonResponse("This is for photo uploading", safe = False)

@csrf_exempt
def updatePhoto(request): # For updating user/rec photo
    try:
        # First we find (if existing) old photo and get the url
        filename = request.POST['filename'] 
        res = findPhoto(filename)
        
        # Next, we parse the new photo
        file = request.FILES['pic'] # Get the photo
        
        # Make new filename
        new_filename = nameMaker(file, filename)

        # After confirming new photo is ready for upload, delete the old one
        if res['status'] == 'old': # Delete existing photo
            default_storage.delete(res['filename'])
        
        # Now we upload the new one 
        default_storage.save(new_filename, file)
        res = findPhoto(filename)
        res['status'] = 'new' # Update status
        return JsonResponse(res, safe = False)
    except:
        return JsonResponse("This is for updating photos", safe = False)

@csrf_exempt
def getPhoto(request): # Photo retrieval
    try:
        filename = JSONParser().parse(request)['filename']
        res = findPhoto(filename)
        return JsonResponse(res, safe = False)    
    except:
        return JsonResponse("This is for getting photos ", safe = False)

@csrf_exempt
def dynamicPhoto(request, filename = 'default'): # Dynamic getter
    try:
        res = findPhoto(filename)
        return redirect(res['url'])
        # return JsonResponse(res, safe = False)    
    except:
        return JsonResponse(res['url'], safe = False)

def findPhoto(filename): # Helper function to get URL path of photo
    res = {
        "url" : default_storage.url('default.jpg'),
        "filename" : "default.jpg",
        "status" : "default"
        }
    if default_storage.exists(filename + ".png"):
        res['url'] = default_storage.url(filename + ".png")
        res['filename'] = filename + ".png"
        res['status'] = "old"
    elif default_storage.exists(filename + ".jpg"):
        res['url'] = default_storage.url(filename + ".jpg")
        res['filename'] = filename + ".jpg"
        res['status'] = "old"
    elif default_storage.exists(filename + ".jpeg"):
        res['url'] = default_storage.url(filename + ".jpeg")
        res['filename'] = filename + ".jpeg"
        res['status'] = "old"
    return res

def nameMaker(file, filename): # Helper function to make filename 
    if "png" in file.name:
        new_filename = filename + ".png" # Get filename
    elif "jpg" in file.name:
        new_filename = filename + ".jpg" # Get filename
    elif "jpeg" in file.name:
        new_filename = filename + ".jpeg" # Get filename
    return new_filename