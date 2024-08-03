# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('create_room/', views.create_room, name='create_room'),
    path('room/<int:room_id>/', views.room_detail, name='room_detail'),
    path('create_order/<int:room_id>/', views.create_order, name='create_order'),
    path('final_order/<int:room_id>/', views.final_order, name='final_order'),
    path('submit_order/<int:room_id>/', views.submit_order, name='submit_order'),
]
