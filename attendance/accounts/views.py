from datetime import datetime
from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout
from .forms import *
from django.conf import settings
from core.models import *
from django.http import HttpResponse
from django.core.mail import send_mail
from .models import *
# Create your views here.

# def select_signup(request):
#    return render(request,'templates/registeration/select_signin.html',{})

# # def govAdminSignin(request):
# #    return render(request,'templates/registeration/signin_gov_admin.html',{})

# # def ambualnceOrganizerAdminSignin(request):
# #    return render(request,'templates/registeration/signin_ambulanceorganizer_Admin.html',{})

# def send_mail_to_companyadmin(request,semail,password):
#           subject = "Your Admin Panel Credential for Quiz Management"
#           message = f"""Hello,\nThis mail has your username and password for login in your Quiz Management Control Panel
#           \nusername:{semail}\npassword:{password}
#           \nPlease don't share this mail/credentials with anyone!\nHave a good day!"""
#           from_email = settings.EMAIL_HOST_USER
#           recipient_list  = [semail]
#           send_mail(subject=subject,message=message,from_email=from_email,recipient_list=recipient_list)
#           return redirect('index')


# def registerForambulanceOrganizerAdmin(request):
#   # form =UserRegisterationFormForOrganizerManager()
#   if request.method == 'POST':
#     form = UserRegisterationFormForOrganizerManager(request.POST,request.FILES)
#     if form.is_valid():
#       form.save()
#       username = form.cleaned_data.get('email')
#       messages.success(request,'Account has been created '+username)
#       return redirect('login')
#   else:
#     form = UserRegisterationFormForOrganizerManager()
#   context ={
#     'form':form
#   }
#   return render(request,'templates/registeration/signin_ambulanceOrganizer_Admin.html',context)



# def editdataForambulanceOrganizerAdmin(request,email):
#   userdata = CustomUser.objects.get(email=email)
#   form = UserRegisterationFormForOrganizerManager(instance=userdata)
#   if request.method == 'POST':
#     form = UserRegisterationFormForOrganizerManager(request.POST,request.FILES,instance=userdata)
#     if form.is_valid():
#       form.save()
#       messages.success(request,"Data Has been Updated!")
#       return redirect('index')
  
#   context ={
#     'form':form,
#     'userdata':userdata,
#   }
#   return render(request,'templates/registeration/signin_ambulanceOrganizer_Admin.html',context)


# def registerForgovOfficialAdmin(request):
#   # form =UserRegisterationFormForOrganizerManager()
#   if request.method == 'POST':
#     form = UserRegisterationFormForGovOfficial(request.POST,request.FILES)
#     if form.is_valid():
#       form.save()
#       username = form.cleaned_data.get('email')
#       messages.success(request,'Account has been created '+username)
#       return redirect('login')
#   else:
#     form = UserRegisterationFormForGovOfficial()
#   context ={
#     'form':form
#   }
#   return render(request,'templates/registeration/signin_gov_admin.html',context)


# def deleteUser(request,email):
#   data = CustomUser.objects.get(email=email)
#   data.delete()
#   messages.success(request,"User Has been Deleted!")
#   return redirect('index')

# def comformUserDelete(request,email):
#   data = CustomUser.objects.get(email=email)
#   context = {
#     'data':data
#   }
#   return render(request,'templates/registeration/conformUser.html',context)

# def registerGovOfficial(request):
#    if request.method == 'POST':
#     form = UserRegisterationFormForGovOfficialg(request.POST,request.FILES)
#     if form.is_valid():
#       form.save()
#       username = form.cleaned_data.get('email')
#       password = form.cleaned_data.get('password1')
#       passwordManager(email = username,password=password).save()
#       messages.success(request,'Account has been created '+username)
#       return redirect('govAdmin')
#    else:
#     form = UserRegisterationFormForGovOfficialg()
#    context ={
#     'form':form
#       }
#    return render(request,'templates/registeration/signin_gov_official.html',context)


# def editdataOfGovOfficial(request,email):
#   userdata = CustomUser.objects.get(email=email)
#   form = UserRegisterationFormForGovOfficialg(instance=userdata)
#   if request.method == 'POST':
#     form = UserRegisterationFormForGovOfficialg(request.POST,request.FILES,instance=userdata)
#     if form.is_valid():
#       form.save()
#       username = form.cleaned_data.get('email')
#       password = form.cleaned_data.get('password1')
#       data = passwordManager.objects.get(email=username)
#       data.password=password
#       data.save()
      
#       messages.success(request,"Data Has been Updated!")
#       return redirect('allGovOfficialPageForAdmin')
  
#   context ={
#     'form':form,
#     'userdata':userdata,
#   }
#   return render(request,'templates/registeration/signin_gov_official.html',context)

# def conformUserForGovOfficial(request,email):
#   data = CustomUser.objects.get(email=email)
#   context ={
#         'data':data
#       }
#   return render(request,'templates/registeration/conformuserForGov.html',context)

# def deleteUserForGovOfficial(request,email):
#    data = CustomUser.objects.get(email=email)
#    data.delete()
#    messages.success(request,'Ambulance has been Deleted!')
#    return redirect('allGovOfficialPageForAdmin')


# def registerForDriver(request):
#   # form =UserRegisterationFormForOrganizerManager()
#   if request.method == 'POST':
#     form = UserRegisterationFormForDriver(request.POST,request.FILES)
#     if form.is_valid():
#       form.save()
#       username = form.cleaned_data.get('email')
#       password = form.cleaned_data.get('password1')
#       passwordManager(email=username,password=password).save()
#       messages.success(request,'Account has been created '+username)
#       return redirect('allDriverForAdmin')
#   else:
#     form = UserRegisterationFormForDriver()
#   context ={
#     'form':form
#   }
#   return render(request,'templates/registeration/signin_driver.html',context)

# def editDataForDriver(request,email):
#   userData = CustomUser.objects.get(email=email)
#   form = UserRegisterationFormForDriver(instance=userData)
#   if request.method == 'POST':
#     form = UserRegisterationFormForDriver(request.POST,request.FILES,instance=userData)
#     if form.is_valid():
#       form.save()
#       username = form.cleaned_data.get('email')
#       password = form.cleaned_data.get('password1')
#       # data = passwordManager.objects.get(email=username)
#       # data.password=password
#       # data.save()
      
#       messages.success(request,"Data Has been Updated!")
#       return redirect('allDriverForAdmin')
  
#   context ={
#     'form':form,
#     'userdata':userData,
#   }
#   return render(request,'templates/registeration/signin_driver.html',context)


# def conformUserForDriver(request,email):
#   data = CustomUser.objects.get(email=email)
#   context ={
#         'data':data
#       }
#   return render(request,'templates/registeration/conformuserForDriver.html',context)

# def deleteUserForDriver(request,email):
#    data = CustomUser.objects.get(email=email)
#    data.delete()
#    messages.success(request,'Driver has been Deleted!')
#    return redirect('allDriverForAdmin')


# def loginhandle(request):
#    if request.method == 'POST':
#      lusername = request.POST['email']
#      lpassword = request.POST['password']
#      loginuser = authenticate(email=lusername,password=lpassword)
#      if loginuser is not None:
#         if  loginuser.is_Gov_Official_Admin == True and loginuser.is_ambulanceOrganizer_Admin==False:
#            if loginuser.granted_access==True:
#              login(request,loginuser)
#             #  data = CustomUser.objects.get(email=lusername)
#             #  data.is_student = False
#             #  data.save()
#              messages.success(request,'Logged In Successfully ' + lusername)
#              return redirect('govAdmin')
#            else:
#               login(request,loginuser)
#               messages.success(request,'Credentials Not Get Access till now please Wait for a while!' + lusername)
#               return redirect('home')
            
#         elif loginuser.is_ambulanceOrganizer_Admin == True and loginuser.is_Gov_Official_Admin == False:
#             if loginuser.granted_access==True:
#              login(request,loginuser)
#              messages.success(request,'Logged In Successfuly ' + lusername)
#              return redirect('ambulanceOrgaAdmin') 
#             else:
#               login(request,loginuser)
#               messages.success(request,'Credentials Not Get Access till now please Wait for a while!' + lusername)
#               return redirect('index')
            
#         else:
#           login(request,loginuser)
#           messages.success(request,'Logged In Successfully ' + lusername)
#           return redirect('index')
#      else:
#         messages.error(request,lusername+' Invalid Credentials!')
#         return redirect('login')
     
#    context ={
   
#   }
#    return render(request,'templates/registeration/login.html',context)

# def profileDataForGov(request,email):
#    userdata = CustomUser.objects.get(email=email)
#    context = {
#       'userdata':userdata
#    }
#    return render(request,'templates/registeration/profileForGov.html',context)


# def profileDataForAmbulanceOrganization(request,email):
#    userdata = CustomUser.objects.get(email=email)
#    ambulanceOrganization = ambulanceOrgaDetail.objects.get(user=userdata)
#    context = {
#       'userdata':userdata,
#       'ambulanceOrgaDetails':ambulanceOrganization,
#    }
#    return render(request,'templates/registeration/profileForAmbulanceOrganizer.html',context)

# def logouthandle(request):
#    logout(request)
#    messages.success(request,'Logout Sucessfully')
#    return redirect('login')

