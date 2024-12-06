# from django.urls import path
# from . import views

# urlpatterns = [
#     path('', views.upload_file, name='upload_file'),
#     path('extracted-text/', views.extracted_text, name='extracted_text'),
# ]

from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_file, name='upload_file'),
    path('extracted-text/', views.extracted_text, name='extracted_text'),
]

 