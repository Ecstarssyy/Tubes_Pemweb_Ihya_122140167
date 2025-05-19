from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import Allow, Everyone, Authenticated

class RootFactory(object):
    __acl__ = [
        (Allow, Everyone, 'view'),
        (Allow, Authenticated, 'create'),
        (Allow, Authenticated, 'edit'),
    ]

    def __init__(self, request):
        pass

def main(global_config, **settings):
    config = Configurator(settings=settings, root_factory=RootFactory)
    config.include('pyramid_jwt')
    
    config.set_authorization_policy(ACLAuthorizationPolicy())
    config.set_jwt_authentication_policy('your-secret-key-change-this-in-production')
    
    config.add_route('api_register', '/api/register')
    config.add_route('api_login', '/api/login')
    config.add_route('api_events', '/api/events')
    config.add_route('api_event', '/api/events/{id}')
    config.add_route('api_participants', '/api/participants')
    config.add_route('api_event_participants', '/api/events/{event_id}/participants')
    
    config.scan('.routes')
    return config.make_wsgi_app()
