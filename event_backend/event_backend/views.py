from pyramid.view import view_config
from pyramid.response import Response
import json

# Dummy data for demonstration
EVENTS = [
    {"id": 1, "name": "Event 1", "description": "Description of Event 1"},
    {"id": 2, "name": "Event 2", "description": "Description of Event 2"},
]

PARTICIPANTS = {
    1: [{"id": 1, "name": "Participant 1"}],
    2: [{"id": 2, "name": "Participant 2"}],
}

USERS = {
    "user1": {"username": "user1", "password": "pass1"},
}

@view_config(route_name='home', renderer='json')
def home_view(request):
    return {"message": "Welcome to the Event Backend API"}

# Auth views
@view_config(route_name='login', request_method='POST', renderer='json')
def login_view(request):
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')
        user = USERS.get(username)
        if user and user['password'] == password:
            return {"status": "success", "message": "Logged in"}
        else:
            return {"status": "error", "message": "Invalid credentials"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@view_config(route_name='logout', request_method='POST', renderer='json')
def logout_view(request):
    return {"status": "success", "message": "Logged out"}

@view_config(route_name='register', request_method='POST', renderer='json')
def register_view(request):
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')
        if username in USERS:
            return {"status": "error", "message": "User already exists"}
        USERS[username] = {"username": username, "password": password}
        return {"status": "success", "message": "User registered"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Event views
@view_config(route_name='events', request_method='GET', renderer='json')
def events_view(request):
    return {"events": EVENTS}

@view_config(route_name='event_detail', request_method='GET', renderer='json')
def event_detail_view(request):
    event_id = int(request.matchdict['event_id'])
    event = next((e for e in EVENTS if e['id'] == event_id), None)
    if event:
        return event
    else:
        return Response(json.dumps({"error": "Event not found"}), status=404, content_type='application/json')

# Participant views
@view_config(route_name='participants', request_method='GET', renderer='json')
def participants_view(request):
    event_id = int(request.matchdict['event_id'])
    participants = PARTICIPANTS.get(event_id, [])
    return {"participants": participants}

@view_config(route_name='participants', request_method='POST', renderer='json')
def add_participant_view(request):
    event_id = int(request.matchdict['event_id'])
    try:
        data = request.json_body
        participant_name = data.get('name')
        if not participant_name:
            return {"status": "error", "message": "Participant name is required"}
        participant = {"id": len(PARTICIPANTS.get(event_id, [])) + 1, "name": participant_name}
        PARTICIPANTS.setdefault(event_id, []).append(participant)
        return {"status": "success", "participant": participant}
    except Exception as e:
        return {"status": "error", "message": str(e)}
