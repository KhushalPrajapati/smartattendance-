from datetime import timedelta
from django.utils import timezone
from django.db import models
from accounts.models import CustomUser
from django.db.models import Sum
# Create your models here.
class Day(models.Model):
    did = models.BigAutoField(primary_key=True)
    day = models.CharField(max_length=20,null=False)
    def __str__(self):
        return self.day

class Subject(models.Model):
    sid = models.BigAutoField(primary_key=True)
    sub_name = models.CharField(max_length=50,null=False)
    total_lect_now = models.IntegerField(null=False)
    def __str__(self):
        return self.sub_name
    def get_attendance_for_user(self, user):
       total_attended = DailyRecord.objects.filter(user=user, subject=self).aggregate(
           total=Sum('attended_count')
       )['total'] or 0
       return total_attended

    def get_attendance_percentage_for_user(self, user):
        attended = self.get_attendance_for_user(user)
        if self.total_lect_now == 0:
            return 0
        return round((attended / self.total_lect_now) * 100, 2)
    
class DayWiseLec(models.Model):
    dwlid = models.BigAutoField(primary_key=True)
    day = models.ForeignKey(Day,on_delete=models.CASCADE)
    lec_count = models.IntegerField(null=False)
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE)

    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.day},{self.subject}"
    def save(self, *args, **kwargs):
       
        super(DayWiseLec, self).save(*args, **kwargs)

class DailyRecord(models.Model):
    drid = models.BigAutoField(primary_key=True)
    day = models.ForeignKey(Day,on_delete=models.CASCADE)
    day_count = models.IntegerField(null=False)
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    day_lec_count = models.IntegerField(null=False)
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE)
    attended_count = models.IntegerField(null=False)
    not_attended_count = models.IntegerField(null=False)
    date = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.user},{self.day},{self.date},day_lec_count:{self.day_lec_count},attended_count:{self.attended_count},not_attended_count{self.not_attended_count}"
       
    def save(self, *args, **kwargs):
     self.date = self.date or timezone.now().date()  # Ensure date is set

     # 1️⃣ Weekly tracking
     week_start = self.date - timedelta(days=self.date.weekday())  # Monday
     week_end = week_start + timedelta(days=6)  # Sunday

     existing_days_this_week = DailyRecord.objects.filter(
         user=self.user,
         date__range=(week_start, week_end)
     ).count()

     self.day_count = existing_days_this_week + 1

     latest_week = WeeklyRecord.objects.filter(userw=self.user).order_by('-week_count').first()
     if latest_week:
         if self.day_count == 1:
             week_number = latest_week.week_count + 1
         else:
             week_number = latest_week.week_count
     else:
         week_number = 1

     super().save(*args, **kwargs)  # Save DailyRecord

     # 2️⃣ Update WeeklyRecord
     weekly_data = DailyRecord.objects.filter(
         user=self.user,
         date__range=(week_start, week_end)
     ).aggregate(
         total_lectures=Sum('day_lec_count'),
         total_attended=Sum('attended_count')
     )

     weekly_record, _ = WeeklyRecord.objects.get_or_create(
         userw=self.user,
         week_count=week_number
     )
     weekly_record.week_total_lec = weekly_data['total_lectures'] or 0
     weekly_record.attended_total_count = weekly_data['total_attended'] or 0
     if weekly_record.week_total_lec > 0:
         weekly_record.overall_attendance_perc = round(
             (weekly_record.attended_total_count / weekly_record.week_total_lec) * 100, 2
         )
     else:
         weekly_record.overall_attendance_perc = 0
     weekly_record.save()

     # 3️⃣ Update SubjectWiseAttendance
     subject_data = DailyRecord.objects.filter(
         user=self.user,
         subject=self.subject
     ).aggregate(
         total_lectures=Sum('day_lec_count'),
         total_attended=Sum('attended_count')
     )

     SubjectWiseAttendance.objects.update_or_create(
         user=self.user,
         subject=self.subject,
         defaults={
             'total_lectures': subject_data['total_lectures'] or 0,
             'attended_lectures': subject_data['total_attended'] or 0,
             'attendance_percentage': round(
                 (subject_data['total_attended'] or 0) / (subject_data['total_lectures'] or 1) * 100, 2
             ) if subject_data['total_lectures'] else 0
         }
     )

     # 4️⃣ Holiday Forecast – Overall
     REQUIRED_PERCENT = 75
     overall = DailyRecord.objects.filter(user=self.user).aggregate(
         total_lectures=Sum('day_lec_count'),
         total_attended=Sum('attended_count')
     )
     overall_total = overall['total_lectures'] or 0
     overall_attended = overall['total_attended'] or 0

     if overall_total > 0:
         allowed_overall = int((overall_attended * 100 / REQUIRED_PERCENT) - overall_total)
         new_total = overall_total + max(0, allowed_overall)
         projected_attendance = (overall_attended / new_total) * 100
     else:
         allowed_overall = 0
         projected_attendance = 0

     HolidayForecast.objects.update_or_create(
         user=self.user,
         subject=None,
         defaults={
             'allowed_holidays': max(0, allowed_overall),
             'min_attendance_percentage': REQUIRED_PERCENT,
             'projected_attendance_percentage': round(projected_attendance, 2)
         }
     )

     # 5️⃣ Holiday Forecast – Subject-wise
     for subj in Subject.objects.all():
         subj_data = DailyRecord.objects.filter(user=self.user, subject=subj).aggregate(
             total_lectures=Sum('day_lec_count'),
             total_attended=Sum('attended_count')
         )
         total_lect = subj_data['total_lectures'] or 0
         attended_lect = subj_data['total_attended'] or 0

         if total_lect > 0:
             allowed_subj = int((attended_lect * 100 / REQUIRED_PERCENT) - total_lect)
             new_total = total_lect + max(0, allowed_subj)
             projected_attendance = (attended_lect / new_total) * 100
         else:
             allowed_subj = 0
             projected_attendance = 0

         HolidayForecast.objects.update_or_create(
             user=self.user,
             subject=subj,
             defaults={
                 'allowed_holidays': max(0, allowed_subj),
                 'min_attendance_percentage': REQUIRED_PERCENT,
                 'projected_attendance_percentage': round(projected_attendance, 2)
             }
         )



class SubjectWiseAttendance(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    total_lectures = models.IntegerField(default=0)
    attended_lectures = models.IntegerField(default=0)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
         return f"{self.user.email} - {self.subject.sub_name}"
    

class WeeklyRecord(models.Model):
    wrid = models.BigAutoField(primary_key=True)
    week_count = models.IntegerField(null=False)
    overall_attendance_perc = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    week_total_lec = models.IntegerField(default=0)
    attended_total_count = models.IntegerField(default=0)
    userw = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        return self.userw.email
    
    def calculate_percentage(self):
      if self.week_total_lec > 0:
          self.overall_attendance_perc = round((self.attended_total_count / self.week_total_lec) * 100, 2)
      else:
          self.overall_attendance_perc = 0
      self.save()
    

class HolidayForecast(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True)  # Null = overall
    allowed_holidays = models.IntegerField(default=0)
    min_attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=75.00)
    projected_attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        if self.subject:
            return f"{self.user.email} - {self.subject.sub_name} Forecast"
        return f"{self.user.email} - Overall Forecast"
