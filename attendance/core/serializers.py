from rest_framework import serializers
from .models import *
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
class DaySerializer(serializers.ModelSerializer):
     class Meta:
          model = Day
          fields = '__all__'
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class DailyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyRecord
        fields = '__all__'
        read_only_fields = ['day_count', 'date']

    def validate(self, data):
        if data['attended_count'] > data['day_lec_count']:
            raise serializers.ValidationError("Attended lectures cannot be more than total lectures.")
        return data


class DayWiseLecSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayWiseLec
        fields = '__all__'
        
class WeeklyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyRecord
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
     token = serializers.SerializerMethodField()
     def create(self, validated_data):
             password = validated_data.pop("password", None)
             user = CustomUser(**validated_data)
             if password:
                   user.set_password(password)
             user.save()
             return user
     def get_token(self, obj):
             refresh = RefreshToken.for_user(obj)
             return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
                }
 
     class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {"password":{"write_only":True}}
