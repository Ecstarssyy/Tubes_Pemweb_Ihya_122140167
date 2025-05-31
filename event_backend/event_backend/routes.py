# event_backend/event_backend/routes.py
def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')  # Added to fix missing route error

    # Auth routes
    config.add_route('login', '/api/login')
    config.add_route('logout', '/api/logout')
    config.add_route('register', '/api/register')
    config.add_route('user_profile_me', '/api/users/me') # Rute baru untuk info user login

    # Event routes
    config.add_route('events', '/api/events') # GET (list), POST (create)
    config.add_route('event_detail', '/api/events/{event_id}') # GET (detail), PUT (update), DELETE (delete)
    
    # Rute tambahan untuk event detail page hooks
    config.add_route('event_registration_stats', '/api/events/{event_id}/registration-stats')
    config.add_route('user_event_registration', '/api/users/me/events/{event_id}/registration') # {user_id} bisa dari token
    config.add_route('related_events', '/api/events/{event_id}/related')


    # Participant routes
    config.add_route('participants', '/api/events/{event_id}/participants') # GET (list), POST (create)
    config.add_route('participant_detail', '/api/events/{event_id}/participants/{participant_id}') # PUT (update), DELETE (delete)

    # Catchall untuk SPA (opsional, jika Pyramid serve frontend)
    # config.add_route('catchall_frontend', '/{*subpath}')