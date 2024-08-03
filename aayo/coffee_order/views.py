import json
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Room, Order
from .forms import RoomForm, OrderForm
from django.urls import reverse
import logging
logger = logging.getLogger(__name__)

def home(request):
    rooms = Room.objects.all()
    return render(request, 'home.html', {'rooms': rooms})

def create_room(request):
    if request.method == 'POST':
        form = RoomForm(request.POST)
        if form.is_valid():
            room = form.save()
            request.session['room_name'] = room.name
            request.session['creator_name'] = room.creator_name
            request.session['selected_cafe'] = room.cafe
            return redirect('create_order', room_id=room.id)
    else:
        form = RoomForm()
    return render(request, 'create_room.html', {'form': form})

def room_detail(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    orders = Order.objects.filter(room=room)
    menu_name = request.GET.get('menu', 'Unknown Menu')
    return render(request, 'room_detail.html', {'room': room, 'orders': orders, 'menu_name': menu_name})

def create_order(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    room_name = request.session.get('room_name', '방 이름 없음')
    creator_name = request.session.get('creator_name', '만든 사람 없음')
    selected_cafe = request.session.get('selected_cafe', 'starbucks')
    
    context = {
        'room': room,
        'selected_cafe': selected_cafe,
        'room_name': room_name,
        'creator_name': creator_name
    }
    return render(request, 'create_order.html', context)

def final_order(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    orders = Order.objects.filter(room=room)
    return render(request, 'final_order.html', {'room': room, 'orders': orders})

@require_POST
@csrf_protect
def submit_order(request, room_id):
    try:
        data = json.loads(request.body)
        logger.info(f"Received data: {data}")
        room = get_object_or_404(Room, id=room_id)
        order = Order(
            room=room,
            orderer_name=data['orderer_name'],
            menu=data['menu'],
            temperature=data['temperature'].upper(),
            ice_amount=data['ice'],
            extra_shot=int(data['extra_shot']),
            extra_options=data.get('extra_options', '')
        )
        order.save()
        logger.info(f"Order saved successfully: {order.id}")
        return JsonResponse({
            'success': True,
            'redirect_url': reverse('final_order', args=[room.id])
        })
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except KeyError as e:
        logger.error(f"Missing key in data: {str(e)}")
        return JsonResponse({'success': False, 'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        logger.error(f"Unexpected error in submit_order: {str(e)}", exc_info=True)
        return JsonResponse({'success': False, 'error': 'Server error'}, status=500)