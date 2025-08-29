from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .serializers import *
from django.contrib.auth import authenticate
from accounts.models import CustomUser

# Create your views here.
def index(request):
  user = request.user.id
  return render(request,'templates/index.html',{'user':user})


def calculate_overall_attendance(request):
    user  = request.user.id
    print(user)
    alldata = DailyRecord.objects.filter(user=user).all()
    weekData = WeeklyRecord.objects.filter(userw=user).all()
    subjectdata = SubjectWiseAttendance.objects.filter(user=user).all()
    holidayData = HolidayForecast.objects.filter(user=user).all()
    
    context = {
        # 'data':data,
        'alldata':alldata,
        'week':weekData,
        'subject':subjectdata,
        'holiday':holidayData
    }
    return render(request,'templates/calculate_attendance.html',context)


class DailyRecordApi(APIView):
    def options(self, request, *args, **kwargs):
        return Response(status=200)

    def get_permissions(self):
        if self.request.method in ['POST', 'OPTIONS','GET']:
            return [AllowAny()]  # Allow unauthenticated signup and preflight
        elif self.request.method in ['PATCH', 'DELETE']:
            return [IsAuthenticated()]  # Require authentication
        return [IsAuthenticated()]  # Default fallback

    def get(self, request):
        if request.user.is_authenticated:
            user_id = request.user.id
        else:
            # Fallback to query parameter if user is not authenticated
            user_id = request.query_params.get("id")
            print
            user = CustomUser.objects.get(id=user_id)
            if not user_id:
                return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure user_id is an integer
            # user_id = int(user_id)
            records = DailyRecord.objects.filter(user=user)
            serializer = DailyRecordSerializer(records, many=True)
            return Response({"data": serializer.data})
        except ValueError:
            return Response({"error": "Invalid user ID format."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # logger.error(f"Error fetching records: {str(e)}")
            return Response({"error": "An error occurred while fetching records."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        mutable_data = request.data
        # mutable_data['user'] = request.user.id
        
        serializer = DailyRecordSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Record created", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        data = request.data
        if not data.get('drid'):
            return Response({"message": "drid is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            record = DailyRecord.objects.get(drid=data['drid'])
            serializer = DailyRecordSerializer(record, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Updated", "data": serializer.data})
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except DailyRecord.DoesNotExist:
            return Response({"message": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        drid = request.data.get('drid')
        if not drid:
            return Response({"message": "drid is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            DailyRecord.objects.get(drid=drid).delete()
            return Response({"message": "Record deleted"})
        except DailyRecord.DoesNotExist:
            return Response({"message": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

class SubjectListApi(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class DayWiseLecApi(APIView):
    def options(self, request, *args, **kwargs):
        return Response(status=200)

    def get_permissions(self):
        if self.request.method in ['POST', 'OPTIONS']:
            return [AllowAny()]  # Allow unauthenticated signup and preflight
        elif self.request.method in ['GET', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]  # Require authentication
        return [IsAuthenticated()]  # Default fallback

    def get(self, request):
        user_id = request.user
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        records = DayWiseLec.objects.filter(user=user_id)
        serializer = DayWiseLecSerializer(records, many=True)
        return Response({"data": serializer.data})
    
    def post(self, request):
        import json
        print("Received data:", json.dumps(request.data))  # Debug print
        data = request.data.copy()

        # Validate and set user
        user_id = data.get('user')
        if not user_id:
            return Response({"message": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = CustomUser.objects.get(id=int(user_id))
            data['user'] = user.id
        except (ValueError, CustomUser.DoesNotExist):
            return Response({"message": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and set day
        day_id = data.get('day')
        if not day_id:
            return Response({"message": "Day ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle subject creation/update
        subject_name = data.get('subject')
        if isinstance(subject_name, str) and subject_name:
            subject_obj, created = Subject.objects.get_or_create(
                sub_name=subject_name,
                defaults={'total_lect_now': 0}
            )
            lec_count = int(data.get('lec_count', 0))
            if not created:
                subject_obj.total_lect_now += lec_count  # Update total_lect_now
                subject_obj.save()
            data['subject'] = subject_obj.sid  # Set the ForeignKey to the Subject ID
        elif not subject_name:
            return Response({"message": "Subject is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check for existing DayWiseLec record
        existing_record = DayWiseLec.objects.filter(
            day_id=day_id,
            subject_id=data['subject'],
            user_id=data['user']
        ).first()

        if existing_record:
            # Update existing record
            existing_record.lec_count += lec_count
            serializer = DayWiseLecSerializer(
                  existing_record, 
                  data={k: v for k, v in data.items() if k != 'lec_count'},  # Exclude lec_count
                   partial=True  )
            if serializer.is_valid():
                serializer.save()
                print("Updated data:", serializer.data)  # Debug print
                return Response({"message": "Record updated", "data": serializer.data}, status=status.HTTP_200_OK)
            print("Validation errors:", serializer.errors)  # Debug print
            return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Create new record
            serializer = DayWiseLecSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                print("Saved data:", serializer.data)  # Debug print
                return Response({"message": "Record created", "data": serializer.data}, status=status.HTTP_201_CREATED)
            print("Validation errors:", serializer.errors)  # Debug print
            return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        data = request.data
        if not data.get('dwlid'):
            return Response({"message": "dwlid is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            record = DayWiseLec.objects.get(dwlid=data['dwlid'])
            serializer = DayWiseLecSerializer(record, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Updated", "data": serializer.data})
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except DayWiseLec.DoesNotExist:
            return Response({"message": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        dwlid = request.data.get('dwlid')
        if not dwlid:
            return Response({"message": "dwlid is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            DayWiseLec.objects.get(dwlid=dwlid).delete()
            return Response({"message": "Record deleted"})
        except DayWiseLec.DoesNotExist:
            return Response({"message": "Record not found"}, status=status.HTTP_404_NOT_FOUND)



class CustomUserApi(APIView):
    def options(self, request, *args, **kwargs):
        return Response(status=200)

    def get_permissions(self):
        if self.request.method in ['POST', 'OPTIONS']:
            return [AllowAny()]  # Allow unauthenticated signup and preflight
        elif self.request.method in ['GET', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]  # Require authentication
        return [IsAuthenticated()]  # Default fallback

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Invalid Credentials"}, status=401)

        user_id = request.query_params.get("id")
        print(user_id)
        if user_id:
            queryset = CustomUser.objects.filter(id=user_id)
        else:
            queryset = CustomUser.objects.all()

        serializer = CustomUserSerializer(queryset, many=True)
        return Response({"data": serializer.data})

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"message": "Data is invalid", "errors": serializer.errors})
        serializer.save()
        return Response({"message": "Data Saved", "data": serializer.data})

    def patch(self, request):
        user_id = request.query_params.get('id')
        if not user_id:
            return Response({"message": "Data not updated", "errors": "id is invalid"})
        user = CustomUser.objects.get(id=user_id)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({"message": "Data is invalid", "errors": serializer.errors})
        serializer.save()
        return Response({"message": "Data Saved", "data": serializer.data})

    def delete(self, request):
        user_id = request.data.get('id')
        if not user_id:
            return Response({"message": "Data not updated", "errors": "id is invalid"})
        CustomUser.objects.filter(id=user_id).delete()
        return Response({"message": "Data Deleted", "data": {}})


class UserLoginView(APIView):
    def options(self, request, *args, **kwargs):
        return Response(status=200)

    def get_permissions(self):
        if self.request.method in ['POST', 'OPTIONS']:
            return [AllowAny()]  # Allow unauthenticated signup and preflight
        elif self.request.method in ['GET', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]  # Require authentication
        return [IsAuthenticated()]  # Default fallback

    def get(self, request):
        if not request.user.is_authenticated:
            return Response("Invalid Credentials")
        serializer = CustomUserSerializer(request.user)
        return Response({"data": serializer.data})

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=400)

        user = authenticate(email=email, password=password)
        if user and user.is_active:
            serializer = CustomUserSerializer(user)
            return Response(serializer.data, status=200)
        return Response("Invalid Credentials", status=403)

class DayApiView(APIView):
    def get_permissions(self):
        # Allow unauthenticated access to GET
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]  # For future methods if needed

    def get(self, request):
        days = Day.objects.all()
        serializer = DaySerializer(days, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)