from pyramid.view import view_config
from pyramid.response import Response, FileResponse
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPUnauthorized
import json
import os

# --- DATA DUMMY ---
EVENTS = [
    {"id": 1, "title": "Konser Jazz Spektakuler", "description": "Nikmati malam jazz yang indah bersama musisi ternama.", "date": "2025-07-15", "start_date": "2025-07-15T19:00:00Z", "end_date": "2025-07-15T22:00:00Z", "location": "Jakarta Convention Center", "category": "Music", "price": 350000, "image_url": "https://source.unsplash.com/800x600/?jazz,concert", "max_participants": 500},
    {"id": 2, "title": "Pameran Seni Kontemporer", "description": "Ekspresi jiwa dalam karya seni modern.", "date": "2025-08-01", "start_date": "2025-08-01T10:00:00Z", "end_date": "2025-08-10T18:00:00Z", "location": "Galeri Nasional", "category": "Art & Culture", "price": 0, "image_url": "https://source.unsplash.com/800x600/?art,exhibition,modern", "max_participants": None},
    {"id": 3, "title": "Tech Conference: Masa Depan AI", "description": "Konferensi teknologi membahas perkembangan AI terkini.", "date": "2025-09-10", "start_date": "2025-09-10T09:00:00Z", "end_date": "2025-09-11T17:00:00Z", "location": "The Ritz-Carlton", "category": "Technology", "price": 1500000, "image_url": "https://source.unsplash.com/800x600/?technology,conference,ai", "max_participants": 200},
    {"id": 4, "title": "Workshop Fotografi Alam", "description": "Belajar teknik fotografi alam dari para ahli.", "date": "2025-09-20", "start_date": "2025-09-20T08:00:00Z", "end_date": "2025-09-22T16:00:00Z", "location": "Taman Nasional Bromo", "category": "Workshop", "price": 750000, "image_url": "https://source.unsplash.com/800x600/?photography,nature,workshop", "max_participants": 30},
    {"id": 5, "title": "Festival Makanan Jalanan", "description": "Cicipi berbagai jajanan lezat dari seluruh nusantara.", "date": "2025-10-05", "start_date": "2025-10-05T11:00:00Z", "end_date": "2025-10-07T21:00:00Z", "location": "Lapangan Banteng", "category": "Food & Drink", "price": 25000, "image_url": "https://source.unsplash.com/800x600/?food,festival,street", "max_participants": None},
]

NEXT_EVENT_ID = 6

PARTICIPANTS = {
    1: [
        {"id": 1, "event_id": 1, "name": "Budi Santoso", "email": "budi@example.com", "phone": "081234567890", "attendanceStatus": "Hadir", "registration_date": "2025-07-01T10:00:00Z", "profile_image": "https://ui-avatars.com/api/?name=Budi+Santoso&background=B8CFCE&color=333446"},
        {"id": 3, "event_id": 1, "name": "Citra Lestari", "email": "citra@example.com", "phone": "081234567892", "attendanceStatus": "Belum Dikonfirmasi", "registration_date": "2025-07-03T14:00:00Z", "profile_image": "https://ui-avatars.com/api/?name=Citra+Lestari&background=B8CFCE&color=333446"},
    ],
    2: [
        {"id": 2, "event_id": 2, "name": "Ani Yudhoyono", "email": "ani@example.com", "phone": "081234567891", "attendanceStatus": "Mungkin Hadir", "registration_date": "2025-07-02T11:00:00Z", "profile_image": "https://ui-avatars.com/api/?name=Ani+Yudhoyono&background=B8CFCE&color=333446"},
    ],
}

NEXT_PARTICIPANT_ID = 4

USERS = {
    "admin": {"id": 1, "username": "admin", "password": "adminpassword", "email": "admin@example.com", "role": "admin"},
    "user1": {"id": 2, "username": "user1", "password": "pass1", "email": "user1@example.com", "role": "participant"},
}

NEXT_USER_ID = 3

def add_cors_headers(response):
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true'
    })

@view_config(request_method='OPTIONS')
def options_view(request):
    response = Response()
    add_cors_headers(response)
    return response

def base_view(view_callable):
    def wrapper(context, request):
        if request.method == 'OPTIONS':
            response = Response()
            add_cors_headers(response)
            return response
        try:
            data = view_callable(context, request)
            if isinstance(data, Response):
                response = data
            else:
                response = Response(json.dumps(data), content_type='application/json')
            add_cors_headers(response)
            return response
        except HTTPBadRequest as e:
            response = Response(json.dumps({'error': str(e)}), status=400, content_type='application/json')
            add_cors_headers(response)
            return response
        except HTTPNotFound as e:
            response = Response(json.dumps({'error': str(e)}), status=404, content_type='application/json')
            add_cors_headers(response)
            return response
        except HTTPUnauthorized as e:
            response = Response(json.dumps({'error': str(e)}), status=401, content_type='application/json')
            add_cors_headers(response)
            return response
        except Exception as e:
            print(f"Server Error: {e}")
            response = Response(json.dumps({'error': 'Internal Server Error'}), status=500, content_type='application/json')
            add_cors_headers(response)
            return response
    return wrapper

# Auth views
@view_config(route_name='login', request_method='POST', decorator=base_view)
def login_view(context, request):
    try:
        data = request.json_body
    except json.JSONDecodeError:
        raise HTTPBadRequest('Invalid JSON format.')
    username = data.get('username')
    password = data.get('password')
    user = USERS.get(username)
    if user and user['password'] == password:
        user_data_to_return = { "id": user["id"], "username": user["username"], "email": user["email"], "role": user["role"]}
        return {"status": "success", "message": "Login berhasil!", "user": user_data_to_return, "token": f"dummy-token-for-{username}"}
    else:
        request.response.status_code = 401
        return {"status": "error", "message": "Username atau password salah."}

@view_config(route_name='register', request_method='POST', decorator=base_view)
def register_view(context, request):
    global NEXT_USER_ID
    try:
        data = request.json_body
    except json.JSONDecodeError:
        raise HTTPBadRequest('Invalid JSON format.')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    if not all([username, password, email]):
        raise HTTPBadRequest('Username, password, dan email wajib diisi.')
    if username in USERS:
        request.response.status_code = 409
        return {"status": "error", "message": "Username sudah terdaftar."}
    new_user = {"id": NEXT_USER_ID, "username": username, "password": password, "email": email, "role": "participant"}
    USERS[username] = new_user
    NEXT_USER_ID += 1
    user_data_to_return = { "id": new_user["id"], "username": new_user["username"], "email": new_user["email"], "role": new_user["role"]}
    return {"status": "success", "message": "Registrasi berhasil!", "user": user_data_to_return}

@view_config(route_name='logout', request_method='POST', decorator=base_view)
def logout_view(context, request):
    return {"status": "success", "message": "Logout berhasil."}

# Event views
@view_config(route_name='events', request_method='GET', decorator=base_view)
def list_events_view(context, request):
    return {"events": EVENTS, "total": len(EVENTS)}

@view_config(route_name='events', request_method='POST', decorator=base_view)
def create_event_view(context, request):
    global NEXT_EVENT_ID
    try:
        data = request.json_body
    except json.JSONDecodeError:
        raise HTTPBadRequest('Invalid JSON format.')
    required_fields = ['title', 'date', 'location', 'category', 'price', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        raise HTTPBadRequest(f'Field wajib hilang. Diperlukan: {", ".join(required_fields)}')
    new_event = {
        "id": NEXT_EVENT_ID,
        "title": data.get('title'),
        "description": data.get('description', ''),
        "date": data.get('date'),
        "start_date": data.get('start_date'),
        "end_date": data.get('end_date'),
        "location": data.get('location'),
        "category": data.get('category'),
        "price": data.get('price', 0),
        "image_url": data.get('image_url', f'https://source.unsplash.com/800x600/?{data.get("category","event")},{NEXT_EVENT_ID}'),
        "max_participants": data.get('max_participants')
    }
    EVENTS.append(new_event)
    NEXT_EVENT_ID += 1
    request.response.status_code = 201
    return new_event

@view_config(route_name='event_detail', request_method='GET', decorator=base_view)
def get_event_detail_view(context, request):
    try:
        event_id = int(request.matchdict['event_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID harus berupa angka.")
    event = next((e for e in EVENTS if e['id'] == event_id), None)
    if event:
        return event
    else:
        raise HTTPNotFound(f"Event dengan ID {event_id} tidak ditemukan.")

@view_config(route_name='event_detail', request_method='PUT', decorator=base_view)
def update_event_view(context, request):
    try:
        event_id = int(request.matchdict['event_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID harus berupa angka.")
    event_index = next((i for i, e in enumerate(EVENTS) if e['id'] == event_id), -1)
    if event_index == -1:
        raise HTTPNotFound(f"Event dengan ID {event_id} tidak ditemukan untuk diupdate.")
    try:
        data = request.json_body
    except json.JSONDecodeError:
        raise HTTPBadRequest('Invalid JSON format.')
    for key, value in data.items():
        if key in EVENTS[event_index]:
            EVENTS[event_index][key] = value
    return EVENTS[event_index]

@view_config(route_name='event_detail', request_method='DELETE', decorator=base_view)
def delete_event_view(context, request):
    try:
        event_id = int(request.matchdict['event_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID harus berupa angka.")
    global EVENTS
    original_length = len(EVENTS)
    EVENTS = [e for e in EVENTS if e['id'] != event_id]
    if len(EVENTS) == original_length:
        raise HTTPNotFound(f"Event dengan ID {event_id} tidak ditemukan untuk dihapus.")
    if event_id in PARTICIPANTS:
        del PARTICIPANTS[event_id]
    request.response.status_code = 204
    return ""

# Participant views
@view_config(route_name='participants', request_method='GET', decorator=base_view)
def list_participants_view(context, request):
    try:
        event_id = int(request.matchdict['event_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID harus berupa angka.")
    event_exists = any(e['id'] == event_id for e in EVENTS)
    if not event_exists:
        raise HTTPNotFound(f"Event dengan ID {event_id} tidak ditemukan.")
    participants_for_event = PARTICIPANTS.get(event_id, [])
    return {"participants": participants_for_event, "total": len(participants_for_event)}

@view_config(route_name='participants', request_method='POST', decorator=base_view)
def add_participant_view(context, request):
    global NEXT_PARTICIPANT_ID
    try:
        event_id = int(request.matchdict['event_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID harus berupa angka.")
    target_event = next((e for e in EVENTS if e['id'] == event_id), None)
    if not target_event:
        raise HTTPNotFound(f"Event dengan ID {event_id} tidak ditemukan.")
    try:
        data = request.json_body
    except json.JSONDecodeError:
        raise HTTPBadRequest('Invalid JSON format.')
    name = data.get('name')
    email = data.get('email')
    if not name or not email:
        raise HTTPBadRequest("Nama dan email partisipan wajib diisi.")
    if target_event.get("max_participants") is not None:
        current_participants_count = len(PARTICIPANTS.get(event_id, []))
        if current_participants_count >= target_event["max_participants"]:
            request.response.status_code = 409
            return {"status": "error", "message": "Kapasitas event sudah penuh."}
    new_participant = {
        "id": NEXT_PARTICIPANT_ID,
        "event_id": event_id,
        "name": name,
        "email": email,
        "phone": data.get('phone', ''),
        "attendanceStatus": data.get('attendanceStatus', 'Belum Dikonfirmasi'),
        "registration_date": "2025-05-30T12:00:00Z",
        "profile_image": f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=B8CFCE&color=333446"
    }
    if event_id not in PARTICIPANTS:
        PARTICIPANTS[event_id] = []
    PARTICIPANTS[event_id].append(new_participant)
    NEXT_PARTICIPANT_ID += 1
    request.response.status_code = 201
    return new_participant

@view_config(route_name='participant_detail', request_method='PUT', decorator=base_view)
def update_participant_view(context, request):
    try:
        event_id = int(request.matchdict['event_id'])
        participant_id = int(request.matchdict['participant_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID dan Participant ID harus berupa angka.")
    if event_id not in PARTICIPANTS or not any(p['id'] == participant_id for p in PARTICIPANTS[event_id]):
        raise HTTPNotFound(f"Partisipan dengan ID {participant_id} untuk Event ID {event_id} tidak ditemukan.")
    participant_list = PARTICIPANTS[event_id]
    participant_index = next((i for i, p in enumerate(participant_list) if p['id'] == participant_id), -1)
    if participant_index == -1:
        raise HTTPNotFound("Partisipan tidak ditemukan (internal error).")
    try:
        data = request.json_body
    except json.JSONDecodeError:
        raise HTTPBadRequest('Invalid JSON format.')
    for key, value in data.items():
        if key in participant_list[participant_index] and key != 'id' and key != 'event_id':
            participant_list[participant_index][key] = value
    return participant_list[participant_index]

@view_config(route_name='participant_detail', request_method='DELETE', decorator=base_view)
def delete_participant_view(context, request):
    try:
        event_id = int(request.matchdict['event_id'])
        participant_id = int(request.matchdict['participant_id'])
    except ValueError:
        raise HTTPBadRequest("Event ID dan Participant ID harus berupa angka.")
    if event_id not in PARTICIPANTS:
        raise HTTPNotFound(f"Tidak ada partisipan untuk Event ID {event_id}.")
    original_length = len(PARTICIPANTS[event_id])
    PARTICIPANTS[event_id] = [p for p in PARTICIPANTS[event_id] if p['id'] != participant_id]
    if len(PARTICIPANTS[event_id]) == original_length:
        raise HTTPNotFound(f"Partisipan dengan ID {participant_id} tidak ditemukan untuk Event ID {event_id}.")
    request.response.status_code = 204
    return ""
