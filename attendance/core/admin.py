from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Subject)
admin.site.register(DayWiseLec)
admin.site.register(DailyRecord)
admin.site.register(WeeklyRecord)
admin.site.register(Day)
admin.site.register(SubjectWiseAttendance)
admin.site.register(HolidayForecast)