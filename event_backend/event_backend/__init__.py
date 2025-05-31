from pyramid.config import Configurator


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        # Removed config.include('.views') because event_backend.views has no includeme
        config.scan()
    return config.make_wsgi_app()
