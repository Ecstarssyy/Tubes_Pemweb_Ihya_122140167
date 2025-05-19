from pyramid.view import view_config
from pyramid.response import Response
from pyramid.security import authenticated_userid
from ..models import Event, User
import json
from datetime import datetime

@view_config(route_name='api_events', request_method='GET', renderer='json', permission='view')
def get_events(request):
    try:
        dbsession = request.dbsession
        events = dbsession.query(Event).all()
        return [{
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'location': event.location,
            'user_id': event.user_id
        } for event in events]
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_events', request_method='POST', renderer='json', permission='view')
def create_event(request):
    try:
        user_id = authenticated_userid(request)
        data = request.json_body
        
        event = Event(
            title=data['title'],
            description=data.get('description'),
            date=datetime.fromisoformat(data['date']),
            location=data.get('location'),
            user_id=user_id
        )
        
        dbsession = request.dbsession
        dbsession.add(event)
        dbsession.flush()
        
        return {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'location': event.location,
            'user_id': event.user_id
        }
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_event', request_method='PUT', renderer='json', permission='view')
def update_event(request):
    try:
        event_id = request.matchdict['id']
        user_id = authenticated_userid(request)
        data = request.json_body
        
        dbsession = request.dbsession
        event = dbsession.query(Event).filter_by(id=event_id).first()
        
        if not event:
            return Response(json={'error': 'Event not found'}, status=404)
            
        if event.user_id != user_id:
            return Response(json={'error': 'Unauthorized'}, status=403)
            
        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'])
        event.location = data.get('location', event.location)
        
        dbsession.flush()
        
        return {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'location': event.location,
            'user_id': event.user_id
        }
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_event', request_method='DELETE', renderer='json', permission='view')
def delete_event(request):
    try:
        event_id = request.matchdict['id']
        user_id = authenticated_userid(request)
        
        dbsession = request.dbsession
        event = dbsession.query(Event).filter_by(id=event_id).first()
        
        if not event:
            return Response(json={'error': 'Event not found'}, status=404)
            
        if event.user_id != user_id:
            return Response(json={'error': 'Unauthorized'}, status=403)
            
        dbsession.delete(event)
        return Response(status=204)
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)
