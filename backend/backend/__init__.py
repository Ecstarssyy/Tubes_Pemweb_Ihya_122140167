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
    
    # Include packages and setup database
    config.include('pyramid_jwt')
    config.include('.models')

    # JWT settings from development.ini
    jwt_secret = settings['jwt.secret']
    jwt_expiration = int(settings.get('jwt.expiration', 3600))
    jwt_algorithm = settings.get('jwt.algorithm', 'HS512')

    # Configure JWT authentication
    config.set_authorization_policy(ACLAuthorizationPolicy())
    config.set_jwt_authentication_policy(
        jwt_secret,
        auth_type='Bearer',
        algorithm=jwt_algorithm,
        expiration=jwt_expiration,
        callback=lambda claim: {'userid': claim.get('sub')}
    )
    
    # Enable CORS
    config.add_cors_preflight_handler()
    config.add_route('cors', '/{catch_all:.*}')
    
    # Configure routes
    config.add_route('api_register', '/api/register')
    config.add_route('api_login', '/api/login')
    config.add_route('api_events', '/api/events')
    config.add_route('api_event', '/api/events/{id}')
    config.add_route('api_participants', '/api/events/{event_id}/participants')
    config.add_route('api_participant', '/api/events/{event_id}/participants/{id}')
    
    # Scan for decorators
    config.scan('.routes')
    
    return config.make_wsgi_app()
