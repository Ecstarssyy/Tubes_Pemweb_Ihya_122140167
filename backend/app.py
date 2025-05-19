from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import Allow, Everyone, Authenticated
import os
from dotenv import load_dotenv

load_dotenv()

class Root:
    __acl__ = [
        (Allow, Authenticated, 'view'),
        (Allow, 'admin', 'admin'),
    ]

    def __init__(self, request):
        pass

def main(global_config, **settings):
    config = Configurator(settings=settings, root_factory=Root)
    
    # Security policies
    config.set_authorization_policy(ACLAuthorizationPolicy())
    
    # Include packages
    config.include('pyramid_jwt')
    config.include('pyramid_cors')
    
    # JWT settings
    config.set_jwt_authentication_policy('your-secret-key')
    
    # CORS settings
    config.add_cors_preflight_handler()
    config.add_route('cors', '/{catch_all:.*}')
    
    # Database
    config.include('.models')
    
    # Routes
    config.include('.routes')
    
    # Scan for decorators
    config.scan('.routes')
    
    return config.make_wsgi_app()

if __name__ == '__main__':
    from waitress import serve
    from pyramid.paster import get_app
    app = get_app('development.ini')
    serve(app, host='0.0.0.0', port=5000)
