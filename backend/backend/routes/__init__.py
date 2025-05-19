def includeme(config):
    config.add_route('api_register', '/api/register')
    config.add_route('api_login', '/api/login')
    
    # Event routes
    config.add_route('api_events', '/api/events')
    config.add_route('api_event', '/api/events/{id}')
    
    # Participant routes
    config.add_route('api_participants', '/api/participants')
    config.add_route('api_event_participants', '/api/events/{event_id}/participants')
    config.add_route('api_participant', '/api/participants/{id}')
