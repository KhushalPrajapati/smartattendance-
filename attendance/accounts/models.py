from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from .managers import CustomUserManager
class CustomUser(AbstractUser):
   username = None
   email = models.EmailField(_('email address'),unique=True)
   branch = models.CharField(max_length=100,null=False,blank=True,default="")
   enrollment_number = models.IntegerField(null=False,blank=True,default="")
   semester = models.CharField(max_length=10,null=False,blank=True,default="") 
   USERNAME_FIELD = 'email'
   REQUIRED_FIELDS = []
   objects = CustomUserManager()

   def __str__(self):
        return self.email
   


