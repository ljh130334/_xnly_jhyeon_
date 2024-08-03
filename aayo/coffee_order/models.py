from django.db import models

class Room(models.Model):
    name = models.CharField(max_length=100)
    cafe = models.CharField(max_length=100)
    creator_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Menu(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name

class Order(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    orderer_name = models.CharField(max_length=100)
    menu = models.CharField(max_length=100)
    temperature = models.CharField(max_length=3, choices=[('HOT', 'Hot'), ('ICE', 'Ice')])
    ice_amount = models.CharField(max_length=10, choices=[('적게', '적게'), ('보통', '보통'), ('많이', '많이')])
    extra_shot = models.IntegerField(default=0)
    extra_options = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.orderer_name}'s order in {self.room.name}"