from rest_framework import routers
from core import views
from django.urls import path,include


urlpatterns = [
              path('dailyRecord/',views.DailyRecordApi.as_view(),name="dailyRecord"),
              path('dayWiseLec/',views.DayWiseLecApi.as_view(),name="dayWiseLec"),
              path('login/',views.UserLoginView.as_view(),name='login'),
              path('user/',views.CustomUserApi.as_view()),
              path('day/', views.DayApiView.as_view(), name='day-list'),
              path('subjects/', views.SubjectListApi.as_view(), name='subject-list'),


             
]