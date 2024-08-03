from django import forms
from .models import Room, Order

class RoomForm(forms.ModelForm):
    creator_name = forms.CharField(max_length=100)
    
    class Meta:
        model = Room
        fields = ['name', 'cafe', 'creator_name']

class OrderForm(forms.ModelForm):
    orderer_name = forms.CharField(max_length=100)
    
    class Meta:
        model = Order
        fields = ['orderer_name', 'menu', 'temperature', 'ice_amount', 'extra_shot', 'extra_options']