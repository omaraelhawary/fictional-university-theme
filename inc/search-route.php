<?php

function unvierstyRegisterSeach(){
    register_rest_route( 'university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'universitySearchResults'
    ) );
}

add_action('rest_api_init', 'unvierstyRegisterSeach');

function universitySearchResults(){
    return "welcome";
}