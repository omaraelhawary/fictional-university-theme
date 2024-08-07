<?php

function unvierstyRegisterSeach(){
    register_rest_route( 'university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'universitySearchResults'
    ) );
}

add_action('rest_api_init', 'unvierstyRegisterSeach');

function universitySearchResults(){
    $proffessors = new WP_Query(array(
        'post_type' => 'professor',
    ));

    $proffessorsResult = array();
    
    while($proffessors -> have_posts()){
        $proffessors -> the_post();
        array_push($proffessorsResult, array(
            'id' => get_the_id(),
            'title' => get_the_title(),
            'link' => get_the_permalink(),
            'professorImage' => get_the_post_thumbnail_url(0, 'professorLandscape'),
        ));
    }

    return $proffessorsResult;
}