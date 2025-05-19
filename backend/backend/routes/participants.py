from pyramid.view import view_config
from pyramid.response import Response
from pyramid.security import authenticated_userid
from ..models import Event, Participant
from datetime import datetime

@view_config(route_name='api_participants', request_method='GET', renderer='json', permission='view')
def get_event_participants(request):
    try:
        event_id = request.matchdict['event_id']
        dbsession = request.dbsession
        participants = dbsession.query(Participant).filter_by(event_id=event_id).all()
        
        return [{
            'id': participant.id,
            'name': participant.name,
            'email': participant.email,
            'phone': participant.phone,
            'event_id': participant.event_id
        } for participant in participants]
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_participants', request_method='POST', renderer='json', permission='view')
def create_participant(request):
    try:
        event_id = request.matchdict['event_id']
        user_id = authenticated_userid(request)
        data = request.json_body
        
        # Verify event exists and user has permission
        dbsession = request.dbsession
        event = dbsession.query(Event).filter_by(id=event_id).first()
        if not event:
            return Response(json={'error': 'Event not found'}, status=404)
        if event.user_id != user_id:
            return Response(json={'error': 'Unauthorized'}, status=403)
        
        participant = Participant(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            event_id=event_id
        )
        
        dbsession.add(participant)
        dbsession.flush()
        
        return {
            'id': participant.id,
            'name': participant.name,
            'email': participant.email,
            'phone': participant.phone,
            'event_id': participant.event_id
        }
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_participant', request_method='PUT', renderer='json', permission='view')
def update_participant(request):
    try:
        event_id = request.matchdict['event_id']
        participant_id = request.matchdict['id']
        user_id = authenticated_userid(request)
        data = request.json_body
        
        dbsession = request.dbsession
        participant = dbsession.query(Participant).filter_by(id=participant_id, event_id=event_id).first()
        
        if not participant:
            return Response(json={'error': 'Participant not found'}, status=404)
            
        # Check if user owns the event
        event = dbsession.query(Event).filter_by(id=event_id).first()
        if event.user_id != user_id:
            return Response(json={'error': 'Unauthorized'}, status=403)
            
        participant.name = data.get('name', participant.name)
        participant.email = data.get('email', participant.email)
        participant.phone = data.get('phone', participant.phone)
        
        dbsession.flush()
        
        return {
            'id': participant.id,
            'name': participant.name,
            'email': participant.email,
            'phone': participant.phone,
            'event_id': participant.event_id
        }
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_participant', request_method='DELETE', renderer='json', permission='view')
def delete_participant(request):
    try:
        event_id = request.matchdict['event_id']
        participant_id = request.matchdict['id']
        user_id = authenticated_userid(request)
        
        dbsession = request.dbsession
        participant = dbsession.query(Participant).filter_by(id=participant_id, event_id=event_id).first()
        
        if not participant:
            return Response(json={'error': 'Participant not found'}, status=404)
            
        # Check if user owns the event
        event = dbsession.query(Event).filter_by(id=event_id).first()
        if event.user_id != user_id:
            return Response(json={'error': 'Unauthorized'}, status=403)
            
        dbsession.delete(participant)
        return Response(status=204)
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)
