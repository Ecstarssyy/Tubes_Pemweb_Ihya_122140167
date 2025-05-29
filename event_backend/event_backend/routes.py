def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')

    # Auth routes
    config.add_route('login', '/api/login')
    config.add_route('logout', '/api/logout')
    config.add_route('register', '/api/register')

    # Event routes
    config.add_route('events', '/api/events')
    config.add_route('event_detail', '/api/events/{event_id}')

    # Participant routes
    config.add_route('participants', '/api/events/{event_id}/participants')
    config.add_route('participant_detail', '/api/events/{event_id}/participants/{participant_id}')
